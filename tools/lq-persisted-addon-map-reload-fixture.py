from pathlib import Path
import argparse

parser = argparse.ArgumentParser(description="Build a pre-boot persisted late-addon-map reload fixture from an assembled LUKE QUEST page.")
parser.add_argument("--html", required=True)
parser.add_argument("--out", required=True)
args = parser.parse_args()

src = Path(args.html)
out = Path(args.out)
html = src.read_text(encoding="utf-8")
anchor = '<script src="prelude/autosave-bootstrap-guard.js"></script><script>'
if html.count(anchor) != 1:
    raise SystemExit(f"expected exactly one assembled bootstrap anchor, found {html.count(anchor)}")

# northCliffRoad is intentionally defined by a late addon, not the base MAPS object.
# Before REQ-127 v1.5 the base script called render() before addon scripts were parsed,
# so a valid persisted save on this map could throw during boot and leave a black page.
seed = """<script>
localStorage.setItem('lukeQuestV2', JSON.stringify({
  screen:'world', map:'northCliffRoad', x:10, y:20, dir:'up',
  lv:6, hp:70, mh:70, atk:18, xp:3, nx:50, gold:80, potions:2, wins:9,
  flags:{}
}));
</script>"""
html = html.replace(anchor, '<script src="prelude/autosave-bootstrap-guard.js"></script>' + seed + '<script>', 1)
out.write_text(html, encoding="utf-8")
print(out)
