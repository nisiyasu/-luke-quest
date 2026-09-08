from pathlib import Path
import argparse

parser=argparse.ArgumentParser()
parser.add_argument('--html',required=True)
parser.add_argument('--out-dir',required=True)
parser.add_argument('--label',required=True)
args=parser.parse_args()

src=Path(args.html).resolve()
out_dir=Path(args.out_dir).resolve()
out_dir.mkdir(parents=True,exist_ok=True)
html=src.read_text(encoding='utf-8')
if '<head>' not in html:
    raise SystemExit('missing head')
# Captures live under /.req145/. Keep repository-relative scripts/assets rooted
# at the served repository root so screenshots execute the actual assembled build.
html=html.replace('<head>','<head><base href="/">',1)

WORLD_BOOT="""<script>setTimeout(()=>{try{
localStorage.removeItem('lukeQuestV2');
s=structuredClone(DEFAULT);s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='up';s.wins=2;s.dialog=null;render();
document.body.dataset.req145Capture='town';
}catch(e){document.body.dataset.req145CaptureError=String(e&&e.message||e)}},250);</script>"""
DIALOGUE_BOOT="""<script>setTimeout(()=>{try{
localStorage.removeItem('lukeQuestV2');
s=structuredClone(DEFAULT);s.screen='world';s.map='town';s.x=4;s.y=7;s.dir='up';s.wins=2;s.dialog=null;render();action();
document.body.dataset.req145Capture='dialogue';
}catch(e){document.body.dataset.req145CaptureError=String(e&&e.message||e)}},250);</script>"""

FIELD_BOOT="""<script>setTimeout(()=>{try{
localStorage.removeItem('lukeQuestV2');
s=structuredClone(DEFAULT);s.screen='world';s.map='field';s.x=10;s.y=15;s.dir='up';s.wins=2;s.dialog=null;render();
document.body.dataset.req145Capture='field';
}catch(e){document.body.dataset.req145CaptureError=String(e&&e.message||e)}},250);</script>"""

FIELD_MOVE_BOOT="""<script>setTimeout(()=>{try{
localStorage.removeItem('lukeQuestV2');
s=structuredClone(DEFAULT);s.screen='world';s.map='field';s.x=10;s.y=15;s.dir='up';s.wins=2;s.dialog=null;encounterGrace=3;render();document.body.dataset.req145Capture='field-move';setTimeout(()=>{move('up');setTimeout(()=>{const motions=window.LQ_REQ145_GOLD_SLICE_TEST?.worldMotionPresentations?.()||0;document.body.dataset.req145WorldMotionPresented=String(motions>=1);document.body.dataset.req145WorldMotionClass=String(document.body.classList.contains('lq145WorldMoving'));},40)},5000);
}catch(e){document.body.dataset.req145CaptureError=String(e&&e.message||e)}},250);</script>"""

EVAC_BOOT="""<script>setTimeout(()=>{try{
localStorage.removeItem('lukeQuestV2');
s=structuredClone(DEFAULT);s.screen='world';s.map='evacRoute';s.x=14;s.y=22;s.dir='up';s.wins=2;s.dialog=null;s.flags.evacEntered=true;s.flags.glennSeen=true;s.flags.withdrawProofSeen=false;render();
document.body.dataset.req145Capture='evac';const g=document.querySelector('.questGuide.lqEvacObjective');document.body.dataset.req145CriticalWrap=String(!!g&&getComputedStyle(g).whiteSpace!=='nowrap');
}catch(e){document.body.dataset.req145CaptureError=String(e&&e.message||e)}},250);</script>"""

BATTLE_BOOT="""<script>setTimeout(()=>{try{
localStorage.removeItem('lukeQuestV2');
s=structuredClone(DEFAULT);s.screen='battle';s.map='field';s.lv=3;s.hp=51;s.mh=60;s.gold=38;s.wins=2;
s.enemy=ENEMIES[1];s.ehp=17;s.log=['ツノウサギが現れた！','ルークの攻撃！ 11ダメージ！','ツノウサギの攻撃！ 5ダメージ！'];render();
document.body.dataset.req145Capture='battle';
}catch(e){document.body.dataset.req145CaptureError=String(e&&e.message||e)}},250);</script>"""

BATTLE_HIT_BOOT="""<script>setTimeout(()=>{try{
localStorage.removeItem('lukeQuestV2');
s=structuredClone(DEFAULT);s.screen='battle';s.map='field';s.lv=3;s.hp=60;s.mh=60;s.gold=38;s.wins=2;s.atk=7;
s.enemy=ENEMIES[1];s.ehp=25;s.log=['ツノウサギが現れた！'];Math.random=()=>0;render();document.body.dataset.req145Capture='battle-hit';setTimeout(()=>{attack();document.body.dataset.req145CanonicalAttack=String(s.ehp<25);setTimeout(()=>{const impacts=window.LQ_REQ145_GOLD_SLICE_TEST?.impactPresentations?.()||0;const hurts=window.LQ_REQ145_GOLD_SLICE_TEST?.playerHurtPresentations?.()||0;document.body.dataset.req145ImpactPresented=String(impacts===1);document.body.dataset.req145ImpactCount=String(impacts);document.body.dataset.req145PlayerHurtPresented=String(hurts===1);document.body.dataset.req145PlayerHurtCount=String(hurts)},80)},4950);
}catch(e){document.body.dataset.req145CaptureError=String(e&&e.message||e)}},250);</script>"""

for scene,boot in [('town',WORLD_BOOT),('field',FIELD_BOOT),('field-move',FIELD_MOVE_BOOT),('evac',EVAC_BOOT),('dialogue',DIALOGUE_BOOT),('battle',BATTLE_BOOT),('battle-hit',BATTLE_HIT_BOOT)]:
    if '</body>' not in html:
        raise SystemExit('missing body close')
    out=out_dir/f'{args.label}-{scene}.html'
    out.write_text(html.replace('</body>',boot+'</body>',1),encoding='utf-8')
    print(out)
