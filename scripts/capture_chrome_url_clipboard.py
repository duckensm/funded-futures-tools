from pywinauto import Desktop, keyboard
import sys, time, os, subprocess

url = sys.argv[1]
outfile = sys.argv[2]
handle = int(sys.argv[3], 0) if len(sys.argv) > 3 else None
w = Desktop(backend='uia').window(handle=handle) if handle else [x for x in Desktop(backend='uia').windows() if 'Chrome' in x.window_text()][0]
w.set_focus()
time.sleep(0.5)
# Use Windows clipboard paste so pywinauto send_keys does not mangle URLs.
subprocess.run(['powershell.exe','-NoProfile','-Command', f"Set-Clipboard -Value @'\n{url}\n'@"], check=True)
keyboard.send_keys('^l')
time.sleep(0.2)
keyboard.send_keys('^v')
time.sleep(0.2)
keyboard.send_keys('{ENTER}')
time.sleep(8)
chunks=[]
seen=set()
for i in range(10):
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
    time.sleep(1.1)
full='Source URL: '+url+'\nCaptured: 2026-05-31 via user Chrome UIA\nWindow: '+w.window_text()+'\n\n'+'\n\n'.join(chunks)
os.makedirs(os.path.dirname(outfile), exist_ok=True)
open(outfile,'w',encoding='utf-8').write(full)
print(outfile)
print('chars', len(full))
print(full[:3000])
