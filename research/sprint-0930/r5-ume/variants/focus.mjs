import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const V='/home/user/gates_of_babylon/.claude/worktrees/agent-afc1751b96b60e1d0/research/sprint-0930/r5-ume/variants/';
const b=await pkg.chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1920,height:1080}});
const shots=[['v2-train',3,'train3'],['v2-train',8,'train8']];
for (const [sc,bt,tag] of shots) for (const mode of ['ellipse','band']) {
  await p.goto(`http://localhost:5220/date-beta.html?seed=1&scene=${sc}&beat=${bt}`,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
  await p.evaluate((mode)=>{
    const s=document.querySelector('.scene'), n=document.querySelector('.db-nanda').getBoundingClientRect();
    const fx=n.x+n.width/2, fy=n.bottom-8; // her feet
    const c=s.cloneNode(true); c.style.filter='brightness(0.9)'; c.style.pointerEvents='none';
    const m = mode==='ellipse'
      ? `radial-gradient(ellipse 560px 210px at ${fx}px ${fy}px, #000 55%, transparent 100%)`
      : `linear-gradient(to bottom, transparent ${fy-190}px, #000 ${fy-70}px, #000 ${fy+50}px, transparent ${fy+170}px)`;
    c.style.webkitMaskImage=m; c.style.maskImage=m;
    s.after(c);
  },mode);
  await p.waitForTimeout(300);
  await p.screenshot({path:`${V}focus-${mode==='ellipse'?'V1-ellipse':'V2-band'}-${tag}.png`});
}
await b.close();
