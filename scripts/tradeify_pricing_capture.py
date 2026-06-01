from pywinauto import Desktop, keyboard
import time, subprocess, os
handle=int('0x20828',0)
w=Desktop(backend='uia').window(handle=handle)
w.set_focus()
subprocess.run(['powershell.exe','-NoProfile','-Command',"Set-Clipboard -Value 'https://tradeify.co/'"],check=True)
keyboard.send_keys('^l'); time.sleep(.1); keyboard.send_keys('^v'); keyboard.send_keys('{ENTER}'); time.sleep(5)
keyboard.send_keys('{PGDN}'); time.sleep(.5); keyboard.send_keys('{PGDN}'); time.sleep(.8)

def textdump():
    lines=[]; last=None
    for d in w.descendants():
        try:
            s=' '.join(d.window_text().strip().split())
        except: s=''
        if s and s!=last:
            lines.append(s); last=s
    return '\n'.join(lines)

out=[]
for account in ['Growth Funding in 1 day','Select Funding in 3 days','Lightning Instant Funding']:
    found=False
    for d in w.descendants():
        try:
            if d.element_info.control_type=='RadioButton' and d.window_text().strip()==account:
                d.invoke(); found=True; break
        except Exception: pass
    time.sleep(1.0)
    out.append('\n\n===== '+account+' =====\n'+textdump())

os.makedirs('research/tradeify-official',exist_ok=True)
open('research/tradeify-official/chrome-pricing-account-types.txt','w',encoding='utf-8').write('\n'.join(out))
print('wrote research/tradeify-official/chrome-pricing-account-types.txt')
print('\n'.join(out)[:5000])
