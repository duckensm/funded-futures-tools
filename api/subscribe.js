const BEEHIIV_ENDPOINT = 'https://api.beehiiv.com/v2/publications';
const MAILERLITE_ENDPOINT = 'https://connect.mailerlite.com/api';

export function isValidEmail(email){
  const value = String(email || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function cleanText(value, fallback = ''){
  return String(value || fallback).trim().slice(0, 160);
}

export function buildBeehiivPayload(input){
  const email = String(input?.email || '').trim().toLowerCase();
  return {
    email,
    reactivate_existing: true,
    send_welcome_email: false,
    utm_source: 'funded_futures_tools',
    utm_medium: 'checklist_form',
    utm_campaign: cleanText(input?.source, 'nq_prop_firm_checklist'),
    utm_content: cleanText(input?.focus, 'NQ/MNQ prop firm challenges'),
    referring_site: cleanText(input?.path, '#checklist'),
  };
}

export function buildMailerLitePayload(input, groupId = ''){
  const email = String(input?.email || '').trim().toLowerCase();
  const payload = {
    email,
    fields: {
      trading_focus: cleanText(input?.focus, 'NQ/MNQ prop firm challenges'),
      signup_source: cleanText(input?.source, 'nq_prop_firm_checklist'),
      signup_path: cleanText(input?.path, '#checklist'),
    },
    status: 'active',
  };
  if(groupId){
    payload.groups = [String(groupId)];
  }
  return payload;
}

function parseJsonBody(req){
  if(!req.body) return {};
  if(typeof req.body === 'object') return req.body;
  try{
    return JSON.parse(req.body);
  }catch{
    return {};
  }
}

async function readProviderError(response){
  const text = await response.text();
  if(!text) return `beehiiv returned ${response.status}`;
  try{
    const json = JSON.parse(text);
    return json?.message || json?.error || text;
  }catch{
    return text.slice(0, 240);
  }
}

export async function subscribeToBeehiiv(input, env = process.env, fetchImpl = fetch){
  const apiKey = env.BEEHIIV_API_KEY;
  const publicationId = env.BEEHIIV_PUBLICATION_ID;
  if(!apiKey || !publicationId){
    throw new Error('BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID are required');
  }
  if(!/^pub_[0-9a-fA-F-]+$/.test(publicationId)){
    throw new Error('BEEHIIV_PUBLICATION_ID must be the API V2 pub_... value');
  }
  if(!isValidEmail(input?.email)){
    throw new Error('A valid email address is required');
  }

  const response = await fetchImpl(`${BEEHIIV_ENDPOINT}/${publicationId}/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildBeehiivPayload(input)),
  });

  if(!response.ok){
    throw new Error(await readProviderError(response));
  }

  const json = await response.json();
  return json.data || json;
}

export async function subscribeToMailerLite(input, env = process.env, fetchImpl = fetch){
  const apiKey = env.MAILERLITE_API_KEY;
  const groupId = env.MAILERLITE_GROUP_ID;
  if(!apiKey){
    throw new Error('MAILERLITE_API_KEY is required');
  }
  if(!isValidEmail(input?.email)){
    throw new Error('A valid email address is required');
  }

  const response = await fetchImpl(`${MAILERLITE_ENDPOINT}/subscribers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(buildMailerLitePayload(input, groupId)),
  });

  if(!response.ok){
    throw new Error(await readProviderError(response));
  }

  const json = await response.json();
  return json.data || json;
}

export async function subscribeLead(input, env = process.env, fetchImpl = fetch){
  const provider = String(env.EMAIL_PROVIDER || '').trim().toLowerCase();
  if(provider === 'mailerlite'){
    return subscribeToMailerLite(input, env, fetchImpl);
  }
  return subscribeToBeehiiv(input, env, fetchImpl);
}

export default async function handler(req, res){
  if(req.method !== 'POST'){
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  const body = parseJsonBody(req);
  try{
    const subscription = await subscribeLead(body);
    res.status(200).json({
      ok: true,
      saved: true,
      message: 'Subscribed. Download your checklist below.',
      subscriptionId: subscription.id,
    });
  }catch(error){
    const message = error instanceof Error ? error.message : 'Subscription failed';
    const status = message.includes('valid email') ? 400 : message.includes('BEEHIIV_') || message.includes('MAILERLITE_') ? 500 : 502;
    res.status(status).json({ ok: false, saved: false, message, error: message });
  }
}
