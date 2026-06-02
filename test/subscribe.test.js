import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildBeehiivPayload,
  buildMailerLitePayload,
  isValidEmail,
  subscribeLead,
  subscribeToBeehiiv,
  subscribeToMailerLite,
} from '../api/subscribe.js';

test('validates normal email addresses and rejects invalid ones', () => {
  assert.equal(isValidEmail('trader@example.com'), true);
  assert.equal(isValidEmail(' trader@example.com '), true);
  assert.equal(isValidEmail('missing-at-symbol'), false);
  assert.equal(isValidEmail(''), false);
});

test('builds beehiiv payload without exposing raw email in analytics fields', () => {
  const payload = buildBeehiivPayload({
    email: 'Trader@Example.com ',
    focus: 'EOD drawdown accounts',
    path: '#checklist',
  });

  assert.equal(payload.email, 'trader@example.com');
  assert.equal(payload.reactivate_existing, true);
  assert.equal(payload.send_welcome_email, false);
  assert.equal(payload.utm_source, 'funded_futures_tools');
  assert.equal(payload.utm_medium, 'checklist_form');
  assert.equal(payload.utm_campaign, 'nq_prop_firm_checklist');
  assert.equal(payload.utm_content, 'EOD drawdown accounts');
  assert.equal(payload.referring_site, '#checklist');
});

test('builds MailerLite payload with group assignment and safe fields', () => {
  const payload = buildMailerLitePayload({
    email: 'Trader@Example.com ',
    focus: 'EOD drawdown accounts',
    source: 'nq_prop_firm_checklist',
    path: '#checklist',
  }, '189206662443173777');

  assert.equal(payload.email, 'trader@example.com');
  assert.deepEqual(payload.groups, ['189206662443173777']);
  assert.equal(payload.status, 'active');
  assert.equal(payload.fields.trading_focus, 'EOD drawdown accounts');
  assert.equal(payload.fields.signup_source, 'nq_prop_firm_checklist');
  assert.equal(payload.fields.signup_path, '#checklist');
});

test('requires beehiiv API env values', async () => {
  await assert.rejects(
    () => subscribeToBeehiiv(
      { email: 'trader@example.com', focus: 'NQ/MNQ prop firm challenges', path: '#checklist' },
      {},
      async () => new Response('{}')
    ),
    /BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID/
  );
});

test('posts subscription to beehiiv v2 publication endpoint', async () => {
  const calls = [];
  const response = await subscribeToBeehiiv(
    { email: 'trader@example.com', focus: 'Risk sizing calculators', path: '#checklist' },
    {
      BEEHIIV_API_KEY: 'secret-token',
      BEEHIIV_PUBLICATION_ID: 'pub_00000000-0000-0000-0000-000000000000',
    },
    async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify({ data: { id: 'sub_1', email: 'trader@example.com' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
  );

  assert.equal(response.id, 'sub_1');
  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    'https://api.beehiiv.com/v2/publications/pub_00000000-0000-0000-0000-000000000000/subscriptions'
  );
  assert.equal(calls[0].options.headers.Authorization, 'Bearer secret-token');
  assert.equal(JSON.parse(calls[0].options.body).utm_content, 'Risk sizing calculators');
});

test('posts subscription to MailerLite subscribers endpoint', async () => {
  const calls = [];
  const response = await subscribeToMailerLite(
    { email: 'trader@example.com', focus: 'Risk sizing calculators', path: '#checklist' },
    {
      MAILERLITE_API_KEY: 'ml-token',
      MAILERLITE_GROUP_ID: '189206662443173777',
    },
    async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify({ data: { id: 'sub_1', email: 'trader@example.com' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
  );

  assert.equal(response.id, 'sub_1');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://connect.mailerlite.com/api/subscribers');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer ml-token');
  const body = JSON.parse(calls[0].options.body);
  assert.deepEqual(body.groups, ['189206662443173777']);
  assert.equal(body.fields.trading_focus, 'Risk sizing calculators');
});

test('routes selected provider through EMAIL_PROVIDER', async () => {
  const calls = [];
  await subscribeLead(
    { email: 'trader@example.com', focus: 'NQ/MNQ prop firm challenges', path: '#checklist' },
    {
      EMAIL_PROVIDER: 'mailerlite',
      MAILERLITE_API_KEY: 'ml-token',
      MAILERLITE_GROUP_ID: '189206662443173777',
    },
    async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify({ data: { id: 'sub_1' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
  );

  assert.equal(calls[0].url, 'https://connect.mailerlite.com/api/subscribers');
});
