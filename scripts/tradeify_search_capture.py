from pywinauto import Desktop, keyboard
import sys, time, os, subprocess

query = sys.argv[1]
match = sys.argv[2]
outfile = sys.argv[3]
handle = int(sys.argv[4], 0)

w = Desktop(backend='uia').window(handle=handle)
w.set_focus()
url = 'https://help.tradeify.co/en/?q=' + query.replace(' ', '%20')
subprocess.run(['powershell.exe','-NoProfile','-Command', f"Set-Clipboard -Value @'\n{url}\n'@"], check=True)
keyboard.send_keys('^l')
time.sleep(0.2)
keyboard.send_keys('^v')
time.sleep(0.2)
keyboard.send_keys('{ENTER}')
time.sleep(6)

found=None
for d in w.descendants():
    try:
        name=d.window_text().strip()
        ct=d.element_info.control_type
        if ct=='Hyperlink' and match.lower() in name.lower():
            found=d; print('invoke', name[:180]); break
    except Exception:
        pass
if not found:
    raise SystemExit('No hyperlink found matching '+match)
found.invoke()
time.sleep(7)

chunks=[]; seen=set()
for i in range(12):
    try:
        text='\n'.join(d.window_text().strip() for d in w.descendants() if d.window_text().strip())
    except Exception as e:
        text=f'[descendants error {e}]'
    lines=[]; last=None
    for line in text.splitlines():
        line=' '.join(line.split())
        if line and line != last:
            lines.append(line); last=line
    chunk='\n'.join(lines)
    if chunk not in seen:
        chunks.append(f'--- VIEWPORT {i+1} ---\n'+chunk); seen.add(chunk)
    keyboard.send_keys('{PGDN}')
    time.sleep(1.0)
full='Search query: '+query+'\nClicked match: '+match+'\nCaptured: 2026-05-31 via user Chrome UIA\nWindow: '+w.window_text()+'\n\n'+'\n\n'.join(chunks)
os.makedirs(os.path.dirname(outfile), exist_ok=True)
open(outfile,'w',encoding='utf-8').write(full)
print(outfile)
print('chars', len(full))
print(full[:3000])
