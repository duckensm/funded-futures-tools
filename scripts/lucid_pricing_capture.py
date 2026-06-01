from pywinauto import Desktop, keyboard
import subprocess, time, os
handle=int('0x20828',0)
w=Desktop(backend='uia').window(handle=handle)
w.set_focus()
subprocess.run(['powershell.exe','-NoProfile','-Command',"Set-Clipboard -Value 'https://lucidtrading.com/'"],check=True)
keyboard.send_keys('^l'); time.sleep(.1); keyboard.send_keys('^v'); keyboard.send_keys('{ENTER}'); time.sleep(7)
# page down until pricing controls loaded in tree
keyboard.send_keys('{PGDN}'); time.sleep(.5); keyboard.send_keys('{PGDN}'); time.sleep(.5)

def dump():
    lines=[]; last=None
    for d in w.descendants():
        try: s=' '.join(d.window_text().strip().split())
        except: s=''
        if s and s!=last:
            lines.append(s); last=s
    return '\n'.join(lines)

out=[]
for tab in ['LucidPro','LucidFlex','LucidDirect']:
    clicked=False
    for d in w.descendants():
        try:
            if d.window_text().strip()==tab and d.element_info.control_type in ('TabItem','Button','Text'):
                try: d.invoke()
                except Exception: d.click_input()
                clicked=True; break
        except Exception: pass
    time.sleep(1.5)
    out.append('\n\n===== '+tab+' =====\n'+dump())
os.makedirs('research/lucid-official',exist_ok=True)
open('research/lucid-official/chrome-pricing-plan-tabs.txt','w',encoding='utf-8').write('\n'.join(out))
print('wrote research/lucid-official/chrome-pricing-plan-tabs.txt')
print('\n'.join(out)[:6000])
