'use strict';
const EXTRA=(()=>{
const css=document.createElement('style');css.textContent='.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:420px;margin:14px auto}.g3 button{aspect-ratio:1;border-radius:24px;border:5px solid var(--ink);background:#fff;font:inherit;font-size:clamp(34px,11vw,60px);color:var(--ink);cursor:pointer;padding:0}.g3 .gone{opacity:.35}.lt{width:150px;height:150px;border-radius:50%;margin:14px auto;border:6px solid var(--ink);display:block;cursor:pointer}';document.head.appendChild(css);
let tm=[];const to=(f,ms)=>{tm.push(setTimeout(f,ms))},stop=()=>{tm.forEach(clearTimeout);tm=[]};
const sec=(h,x)=>{stop();cleanup=stop;app.innerHTML=`<section class="play"><h2>${h}</h2>${x}</section>`};
const win=(id,s,m,again)=>finish(id,s,m,again);
const ok1=()=>{S.stars++;good();save();upd()};

function whack(){const R={easy:10,medium:14,hard:18}[S.level]||10,ms={easy:1100,medium:900,hard:700}[S.level]||1100;let n=0,hit=0,cur=-1,on=false;
sec('⭐ Whack-a-Star',`<p class="cnt">Stars tapped: <b id="h">0</b>/${R}</p><p>Tap the star when it shows up!</p><div class="g3">${'<button></button>'.repeat(9)}</div>`);say('Tap the star!');
const b=[...app.querySelectorAll('.g3 button')];
const next=()=>{if(cur>=0)b[cur].textContent='';if(n>=R)return win('whk',hit>=R*.8?3:hit>=R*.5?2:1,`You tapped ${hit} of ${R} stars!`,whack);n++;let c;do c=rnd(9);while(c==cur);cur=c;b[c].textContent='⭐';on=true;to(next,ms)};
b.forEach((x,i)=>x.onclick=()=>{if(on&&i==cur){on=false;hit++;ok1();$('#h').textContent=hit;x.textContent='✨'}else soft()});
to(next,700)}

function simon(){const N={easy:4,medium:6,hard:8}[S.level]||4,CL=['#ff595e','#ffd23f','#2ec4b6','#7b5cff'],NT=[262,330,392,523];let seq=[],pos=0,lock=true;
sec('🎵 Copy the Colors',`<p class="cnt" id="sm">Watch...</p><div class="g3" style="grid-template-columns:repeat(2,1fr);max-width:320px">${CL.map((c,i)=>`<button data-i="${i}" style="background:${c};opacity:.55" aria-label="Color ${i+1}"></button>`).join('')}</div>`);
const b=[...app.querySelectorAll('.g3 button')],lit=i=>{b[i].style.opacity=1;beep(NT[i],.3);to(()=>b[i].style.opacity=.55,350)};
const play=()=>{lock=true;pos=0;seq.push(rnd(4));$('#sm').textContent=`Watch... (${seq.length} of ${N})`;seq.forEach((s,k)=>to(()=>lit(s),700+k*650));to(()=>{lock=false;$('#sm').textContent='Your turn! Copy it.'},700+seq.length*650)};
b.forEach((x,i)=>x.onclick=()=>{if(lock)return;lit(i);
 if(i!=seq[pos]){lock=true;soft();const d=seq.length-1;return to(()=>win('sim',d>=N/2?2:1,`You remembered ${d} colors!`,simon),600)}
 pos++;if(pos==seq.length){lock=true;ok1();if(seq.length>=N)return to(()=>win('sim',3,`You remembered all ${N} colors!`,simon),600);to(play,900)}});
to(play,500)}

function spot(){const R=8,P=[['🐶','🐱'],['🍎','🍅'],['😀','😃'],['🌞','⭐'],['🚗','🚕'],['🐻','🐼'],['🌸','🌼']];let r=0,ok=0;
const round=()=>{if(r>=R)return win('spt',ok>=7?3:ok>=5?2:1,`You found ${ok} of ${R}!`,spot);r++;
 const[a,d]=shuf(pick(P,1)[0]),k=rnd(9);let done=false;
 sec('🔍 Spot the Different',`<p class="cnt">Round ${r} of ${R}</p><p>Tap the one that is different!</p><div class="g3">${Array.from({length:9},(_,i)=>`<button data-i="${i}">${i==k?d:a}</button>`).join('')}</div>`);say('Which one is different?');
 app.querySelectorAll('.g3 button').forEach((x,i)=>x.onclick=()=>{if(done)return;done=true;if(i==k){ok++;ok1();burst()}else{soft();app.querySelectorAll('.g3 button')[k].style.background='#c8f7d4'}to(round,900)})};
round()}

function order(){const N={easy:5,medium:7,hard:9}[S.level]||5;let nx=1,miss=0;const pos=shuf(Array.from({length:12},(_,i)=>i)).slice(0,N);
sec('🔢 Tap in Order',`<p class="cnt">Find number <b id="nx">1</b> next!</p><div class="g3" style="grid-template-columns:repeat(4,1fr);max-width:480px">${Array.from({length:12},(_,i)=>{const k=pos.indexOf(i);return k<0?'<span></span>':`<button data-n="${k+1}" style="background:#7be0d4">${k+1}</button>`}).join('')}</div>`);say('Tap the numbers in order!');
app.querySelectorAll('.g3 button').forEach(x=>x.onclick=()=>{if(x.classList.contains('gone'))return;
 if(+x.dataset.n==nx){x.classList.add('gone');ok1();nx++;if(nx>N)return to(()=>win('ord',miss<=1?3:miss<=4?2:1,`You tapped 1 to ${N} with ${miss} slips!`,order),600);$('#nx').textContent=nx}
 else{miss++;soft()}})}

function xo(){const B=Array(9).fill(''),W=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],won=p=>W.some(w=>w.every(i=>B[i]==p)),full=()=>B.every(x=>x);let over=false;
const draw=m=>{sec('⭕ Tic-Tac-Toe',`<p class="cnt">${m}</p><p>You are ❌. Get three in a row!</p><div class="g3">${B.map((v,i)=>`<button data-i="${i}">${v}</button>`).join('')}</div>`);app.querySelectorAll('.g3 button').forEach(b=>b.onclick=()=>tap(+b.dataset.i))};
const end=(s,m)=>{over=true;to(()=>win('xo',s,m,xo),800)};
const mv=()=>{const e=B.map((v,i)=>v?-1:i).filter(i=>i>=0),f=p=>e.find(i=>{B[i]=p;const w=won(p);B[i]='';return w});return S.level=='easy'?e[rnd(e.length)]:[f('⭕'),f('❌'),B[4]?undefined:4].find(x=>x!=null)??e[rnd(e.length)]};
const tap=i=>{if(over||B[i])return;B[i]='❌';beep(500,.1);ok1();
 if(won('❌')){draw('You win! 🎉');return end(3,'You won the game!')}
 if(full()){draw('A draw!');return end(2,'It was a draw. Well played!')}
 B[mv()]='⭕';
 if(won('⭕')){draw('The computer wins!');return end(1,'The computer won this time. Try again!')}
 if(full()){draw('A draw!');return end(2,'It was a draw. Well played!')}
 draw('Your turn!')};
draw('Your turn!')}

function light(){const R=6;let r=0,ok=0,state=0;
const round=()=>{if(r>=R)return win('lgt',ok>=5?3:ok>=3?2:1,`You got ${ok} of ${R} lights right!`,light);r++;state=0;let g,over=false;
 sec('🚦 Green Light',`<p class="cnt">Round ${r} of ${R}</p><p id="lm">Get ready...</p><button class="lt" id="lt" style="background:#bbb" aria-label="Traffic light"></button><p class="note">Tap on GREEN. Do not tap on RED!</p>`);
 const end=w=>{if(over)return;over=true;state=2;if(w){ok++;ok1();$('#lm').textContent='Well done! 🌟'}else{soft();$('#lm').textContent='Oops! Try the next one. 💛'}to(round,1000)};
 to(()=>{g=Math.random()<.6;$('#lt').style.background=g?'#2ec4b6':'#e63946';$('#lm').textContent=g?'GREEN! Tap now!':'RED! Do not tap!';say(g?'Go!':'Stop!');state=1;to(()=>end(!g),g?2000:1600)},1000+rnd(1500));
 $('#lt').onclick=()=>{if(state==1)end(g);else if(state==0)soft()}};
round()}

return[['whk','Whack-a-Star','🔨','#ffbe0b',whack],['sim','Copy the Colors','🎵','#fb5607',simon],['spt','Spot the Different','🔍','#8338ec',spot],['ord','Tap in Order','🔢','#06d6a0',order],['xo','Tic-Tac-Toe','⭕','#3a86ff',xo],['lgt','Green Light','🚦','#ef476f',light]].map(([id,n,ic,c,fn])=>({id,n,ic,c,fn}));
})();
