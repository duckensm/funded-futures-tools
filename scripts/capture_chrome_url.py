from pywinauto import Desktop, keyboard
import sys, time, os, re

url = sys.argv[1]
outfile = sys.argv[2]
handle = int(sys.argv[3], 0) if len(sys.argv) > 3 else None

wins = Desktop(backend='uia').windows()
if handle is None:
    chrome_wins = [w for w in wins if 'Chrome' in w.window_text()]
    if not chrome_wins:
        raise SystemExit('No Chrome windows found')
    w = chrome_wins[0]
else:
    w = Desktop(backend='uia').window(handle=handle)

w.set_focus()
time.sleep(0.5)
keyboard.send_keys('^l')
time.sleep(0.2)
keyboard.send_keys(url)
time.sleep(0.2)
keyboard.send_keys('{ENTER}')
time.sleep(8)

chunks=[]
seen=set()
for i in range(12):
    try:
        text='\n'.join(d.window_text().strip() for d in w.descendants() if d.window_text().strip())
    except Exception as e:
        text=f'[descendants error {e}]'
    # reduce consecutive duplicate lines while preserving page order
    lines=[]
    last=None
    for line in text.splitlines():
        line=' '.join(line.split())
        if line and line != last:
            lines.append(line)
            last=line
    chunk='\n'.join(lines)
    if chunk not in seen:
        chunks.append(f'--- VIEWPORT {i+1} ---\n'+chunk)
        seen.add(chunk)
    keyboard.send_keys('{PGDN}')
    time.sleep(1.2)

full = 'Source URL: '+url+'\nCaptured: 2026-05-31 via user Chrome UIA\nWindow: '+w.window_text()+'\n\n'+'\n\n'.join(chunks)
os.makedirs(os.path.dirname(outfile), exist_ok=True)
with open(outfile,'w',encoding='utf-8') as f:
    f.write(full)
print(outfile)
print('chars', len(full))
print(full[:3000])
