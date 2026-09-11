from pathlib import Path
import argparse
import re

parser=argparse.ArgumentParser()
parser.add_argument('--root',default=None)
parser.add_argument('--out',default=None)
args=parser.parse_args()
root=Path(args.root).resolve() if args.root else Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
marker='<div id="app"></div><script>'
guard='<div id="app"></div><script src="prelude/autosave-bootstrap-guard.js"></script><script>'
if html.count(marker)!=1:
    raise SystemExit('base marker mismatch')
html=html.replace(marker,guard,1)

def vkey(path):
    m=re.search(r'ux-v(\d+)\.js$',path.name)
    return int(m.group(1)) if m else 10**9

for p in sorted(root.glob('ux-v*.js'),key=vkey):
    html=html.replace('</body>',f'<script src="{p.name}"></script></body>')
for p in sorted((root/'addons').glob('*.js')):
    rel=p.relative_to(root).as_posix()
    html=html.replace('</body>',f'<script src="{rel}"></script></body>')
out=Path(args.out).resolve() if args.out else root/'req145-assembled.html'
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(html,encoding='utf-8')
print(out)
