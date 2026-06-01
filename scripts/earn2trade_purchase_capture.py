from pywinauto import Desktop, keyboard
import subprocess, time, os, re
handle=int('0x20828',0)
w=Desktop(backend='uia').window(handle=handle)
w.set_focus()
subprocess.run(['powershell.exe','-NoProfile','-Command',"Set-Clipboard -Value 'https://www.earn2trade.com/purchase'"],check=True)
keyboard.send_keys('^l'); time.sleep(.1); keyboard.send_keys('^v'); keyboard.send_keys('{ENTER}'); time.sleep(8)

def dump():
    lines=[]; last=None
    for d in w.descendants():
        try: s=' '.join(d.window_text().strip().split())
        except Exception: s=''
        if s and s!=last:
            lines.append(s); last=s
    return '\n'.join(lines)

def click_named(name, contains=False):
    for d in w.descendants():
        try:
            s=' '.join(d.window_text().strip().split())
            if (s==name or (contains and name in s)) and d.element_info.control_type in ('Button','TabItem','Hyperlink','Text'):
                try: d.invoke()
                except Exception: d.click_input()
                return True
        except Exception: pass
    return False

out=[]
# TCP buttons in side panel
for target in ['TCP25', 'TCP50', 'TCP100']:
    click_named('Trader Career Path®')
    time.sleep(.8)
    click_named(target, contains=True)
    time.sleep(1.5)
    out.append(f'\n\n===== Trader Career Path {target} =====\n'+dump())
# Gauntlet Mini then all visible account buttons
click_named('The Gauntlet Mini™')
time.sleep(2)
out.append('\n\n===== Gauntlet Mini initial =====\n'+dump())
# collect visible button names matching dollars/accounts after switching
names=[]
for d in w.descendants():
    try:
        s=' '.join(d.window_text().strip().split())
        if d.element_info.control_type=='Button' and re.search(r'\$|50|100|150|200|Mini', s) and s not in names:
            names.append(s)
    except Exception: pass
for name in names:
    if 'Start Now' in name or 'Gauntlet' in name or 'Career' in name: continue
    click_named(name)
    time.sleep(1.2)
    out.append(f'\n\n===== Gauntlet click {name} =====\n'+dump())

os.makedirs('research/earn2trade-official', exist_ok=True)
path='research/earn2trade-official/chrome-purchase-all-tabs.txt'
open(path,'w',encoding='utf-8').write('\n'.join(out))
print(path)
print('\n'.join(out)[:8000])
