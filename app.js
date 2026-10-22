'use strict';
const $=s=>document.querySelector(s),app=$('#app');
const DEF={stars:0,done:{},best:{},badges:[],sound:true,speech:true,level:'easy',len:20,look:true,voice:'starry',vname:'',sfx:'bells',music:'off'};
let S;try{S={...DEF,...JSON.parse(localStorage.getItem('lsa')||'{}')}}catch(e){S={...DEF}}
const save=()=>{try{localStorage.setItem('lsa',JSON.stringify(S))}catch(e){}};
const rnd=n=>Math.floor(Math.random()*n),shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]),pick=(a,n)=>shuf(a).slice(0,n);
const LV=()=>({easy:{max:5,n:3},medium:{max:10,n:3},hard:{max:20,n:4}})[S.level]||{max:5,n:3};
const opts=(c,pool)=>shuf([c,...pick([...new Set(pool)].filter(x=>x!==c),LV().n-1)]);
let cleanup=()=>{},ac;
function tone(f,d=.15,t=0,w='sine',v=.07){if(!S.sound)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),a=ac.currentTime+t;o.type=w;o.frequency.value=f;g.gain.setValueAtTime(v,a);g.gain.exponentialRampToValueAtTime(.0001,a+d);o.connect(g);g.connect(ac.destination);o.start(a);o.stop(a+d+.02)}catch(e){}}
function sweep(f1,f2,d,v){if(!S.sound)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),a=ac.currentTime;o.type='sawtooth';o.frequency.setValueAtTime(f1,a);o.frequency.exponentialRampToValueAtTime(f2,a+d);g.gain.setValueAtTime(v,a);g.gain.exponentialRampToValueAtTime(.0001,a+d);o.connect(g);g.connect(ac.destination);o.start(a);o.stop(a+d+.02)}catch(e){}}
const WV={bells:['sine',.08],xylo:['triangle',.1],chime:['square',.035],pop:['sawtooth',.04]};
function beep(f,d=.15,t=0){const[w,v]=WV[S.sfx]||WV.bells;tone(f,d,t,w,v)}
const TUNES={happy:{d:.28,w:'triangle',v:.05,s:[60,64,67,64,60,64,67,72,71,67,64,67,62,65,69,65,62,65,69,74,72,67,64,60]},twinkle:{d:.5,w:'sine',v:.07,s:[60,60,67,67,69,69,67,0,65,65,64,64,62,62,60,0,67,67,65,65,64,64,62,0,67,67,65,65,64,64,62,0,60,60,67,67,69,69,67,0,65,65,64,64,62,62,60,0]},calm:{d:.9,w:'sine',v:.05,s:[48,60,64,67,71,67,64,60,45,57,60,64,67,64,60,57]}};
let mt=null;const stopMusic=()=>{clearInterval(mt);mt=null};
function startMusic(){stopMusic();const T=TUNES[S.music];if(!T||!S.sound)return;let i=0;const tick=()=>{const m=T.s[i++%T.s.length];if(m)tone(440*2**((m-69)/12),T.d*1.6,0,T.w,T.v)};tick();mt=setInterval(tick,T.d*1000)}
const good=()=>[523,659,784].forEach((f,i)=>beep(f,.15,i*.1)),soft=()=>beep(220,.25);
const VP={starry:['⭐ Starry',null,1.2,.85],lady:['👩 Friendly lady','f',1.1,.9],man:['👨 Kind man','m',.9,.9],kid:['🧒 Little kid','f',1.8,.95],robot:['🤖 Silly robot',null,.5,.8]};
let VS=[];const loadV=()=>{try{VS=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang))}catch(e){}};try{loadV();speechSynthesis.onvoiceschanged=loadV}catch(e){}
const FEM=/female|zira|samantha|susan|karen|moira|tessa|fiona|victoria|hazel|aria|jenny|libby|sonia|catherine|emma|joanna|salli|kendra|ivy/i,MALE=/\bmale\b|david|mark|daniel|alex|george|guy|ryan|james|brian|matthew|joey|justin/i;
function voiceFor(){const P=VP[S.voice]||VP.starry;let v=S.vname&&VS.find(x=>x.voiceURI===S.vname);if(!v&&P[1])v=VS.find(x=>P[1]=='f'?FEM.test(x.name):MALE.test(x.name)&&!FEM.test(x.name));return[v,P[2],P[3]]}
function say(t){if(!S.sound||!S.speech||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/\p{Extended_Pictographic}/gu,'')),[v,p,r]=voiceFor();if(v)u.voice=v;u.pitch=p;u.rate=r;speechSynthesis.speak(u)}catch(e){}}
const upd=()=>{$('#starCount').textContent=S.stars;$('#soundBtn').textContent=S.sound?'🔊':'🔇'};
function burst(){for(let i=0;i<10;i++){const s=document.createElement('span');s.className='fx';s.textContent='⭐';s.style.left=5+rnd(85)+'%';s.style.animationDelay=i*40+'ms';document.body.appendChild(s);setTimeout(()=>s.remove(),1600)}}
const A=[['Cat','🐱','Meow'],['Dog','🐶','Woof'],['Cow','🐮','Moo'],['Lion','🦁','Roar'],['Elephant','🐘','Toot'],['Bird','🐦','Tweet'],['Duck','🦆','Quack'],['Sheep','🐑','Baa'],['Monkey','🐵','Ooh ooh'],['Horse','🐴','Neigh'],['Pig','🐷','Oink'],['Frog','🐸','Ribbit'],['Rooster','🐓','Cock-a-doodle-doo'],['Bee','🐝','Buzz'],['Snake','🐍','Hiss'],['Goat','🐐','Maa'],['Wolf','🐺','Howl'],['Owl','🦉','Hoot'],['Turkey','🦃','Gobble'],['Mouse','🐭','Squeak'],['Bear','🐻','Growl'],['Tiger','🐯','Grr'],['Chick','🐤','Cheep'],['Dolphin','🐬','Click click']];
const C=[['Red','#e63946','🍎','🍓'],['Blue','#1d6fe0','🐳','🫐'],['Yellow','#ffd60a','🍌','🌻'],['Green','#2eb872','🐸','🥦'],['Orange','#ff8c1a','🥕','🍊'],['Purple','#8e44ad','🍇','🔮'],['Pink','#ff7eb6','🐷','🌸'],['Brown','#8b5a2b','🐻','🍫'],['Black','#222','🖤','🐈‍⬛'],['White','#fff','🥛','🐑'],['Grey','#8d99ae','🐘','🐭'],['Gold','#d4a017','🏆','🥇']];
const L=[['Apple','🍎'],['Ball','⚽'],['Cat','🐱'],['Dog','🐶'],['Egg','🥚'],['Fish','🐟'],['Grapes','🍇'],['Hat','🎩'],['Ice cream','🍦'],['Juice','🧃'],['Kite','🪁'],['Lion','🦁'],['Moon','🌙'],['Nest','🪺'],['Orange','🍊'],['Pizza','🍕'],['Queen','👑'],['Rainbow','🌈'],['Sun','☀️'],['Tree','🌳'],['Umbrella','☂️'],['Van','🚐'],['Watch','⌚'],['X-ray','🩻'],['Yo-yo','🪀'],['Zebra','🦓']];
const K=[['🧸 Mia has a toy. A friend wants to play too.','Share the toy','Hide the toy','Take it away','Sharing makes play more fun!'],['🙏 Someone gives you a gift.','Say thank you','Say nothing','Throw it','Thank you makes people smile.'],['🍪 You want a cookie from the jar.','Ask, say please','Grab it fast','Cry loudly','Please is a kind magic word.'],['😢 Your friend fell down and is crying.','Ask if they are okay','Laugh','Walk away','Caring helps friends feel better.'],['🎠 Two kids want the same swing.','Take turns','Push each other','Shout','Taking turns is fair for everyone.'],['💥 You bumped into a friend by accident.','Say sorry','Run away','Blame them','Sorry shows you care.'],['🛒 You cannot find your grown-up at the shop.','Stay and ask a shop helper','Go with a stranger','Run outside','Helpers can find your grown-up.'],['🍬 A stranger offers sweets and says come with me.','Say no, tell a trusted adult','Go along','Take the sweets quietly','Never go with strangers. Tell a grown-up.'],['🔥 You see something hot on the stove.','Do not touch, tell an adult','Touch it','Pick it up','Hot things can hurt. Grown-ups can help.'],['🧹 Toys are all over the floor.','Help tidy up','Hide','Kick them','Helping keeps our home neat.'],['👵 Grandma carries heavy bags.','Offer to help','Ignore her','Run off','Helping family is kind.'],['👋 A new child is alone at school.','Invite them to play','Ignore them','Laugh at them','Being friendly makes new friends.'],['🦷 It is bedtime after a busy day.','Brush your teeth','Skip it','Eat sweets','Brushing keeps teeth strong.'],['🧼 Your hands are dirty before lunch.','Wash your hands','Wipe on clothes','Eat anyway','Clean hands keep you healthy.'],['🎨 Your friend made a drawing.','Say it is nice','Tear it','Laugh','Kind words make friends proud.'],
['🚪 Someone you do not know knocks on the door.','Tell a grown-up','Open the door','Shout at them','Always get a grown-up first.'],['🐶 A big dog you do not know is barking.','Stay calm, tell an adult','Run at it','Pull its tail','Ask a grown-up before touching animals.'],['🚸 You want to cross the road.','Hold a grown-up hand and look','Run across','Close your eyes','Holding hands keeps you safe.'],['🎒 You find a lost toy at the park.','Give it to a grown-up','Throw it','Keep it secretly','Returning things is kind.'],['😠 You feel very angry.','Take deep breaths','Hit someone','Break a toy','Breathing helps us calm down.'],['🤒 Your friend feels sick.','Tell a grown-up','Make fun of them','Ignore them','Grown-ups know how to help.'],['🍰 One slice is left for two kids.','Cut it in half to share','Eat it fast','Hide it','Sharing is fair.'],['🗣️ A friend is talking to you.','Listen quietly','Shout over them','Walk away','Listening shows respect.'],['🌳 You finished your snack outside.','Put the wrapper in the bin','Drop it on the ground','Hide it','Keeping nature clean is kind.'],['🛁 You played in the mud.','Take a bath','Jump on the bed','Wipe on the sofa','Baths keep us clean.'],['😔 A friend says nobody wants to play.','Say, come play with us','Say go away','Whisper about them','Including others is kind.'],['📱 Someone online asks where you live.','Do not answer, tell a grown-up','Tell them','Send a photo','Never share personal details.'],['🤝 You and a friend both want to go first.','Take turns','Push in front','Cry','Turns make games fair.'],['🙋 You do not understand something.','Ask for help','Give up','Hide it','Asking for help is brave.'],['🍽️ Dinner is ready.','Wash hands and sit down','Run around','Throw food','Eating together is nice.']];
const E5=['🍎','⭐','🐟','🎈','🍓','🐥'];
const G={
num(c){const m=LV().max,t=c!=null?c:rnd(6),pool=Array.from({length:m+3},(_,i)=>''+i),e=E5[rnd(6)],s=Math.min(m,10);
 if(t==0){const a=rnd(m+1);return{key:'r'+a,p:'Which number is this?',v:`<div class="big">${a}</div>`,a:''+a,o:opts(''+a,pool)}}
 if(t==1){const a=rnd(s)+1;return{key:'c'+a+e,p:'How many do you see?',v:e.repeat(a),a:''+a,o:opts(''+a,pool)}}
 if(t==2){const a=rnd(s-1)+1,b=rnd(s-a)+1;return{key:'p'+a+'+'+b,p:'How many altogether?',v:`${e.repeat(a)} ➕ ${e.repeat(b)}<div>${a} + ${b} = ?</div>`,a:''+(a+b),o:opts(''+(a+b),pool)}}
 if(t==4){const a=rnd(m);return{key:'n'+a,p:`What number comes after ${a}?`,v:`<div class="big">${a} ➡️ ❓</div>`,a:''+(a+1),o:opts(''+(a+1),pool)}}
 if(t==5){const a=rnd(m+1),b=(a+1+rnd(m))%(m+1);return{key:'g'+a+'-'+b,p:'Which number is bigger?',v:`<div class="big">${a} or ${b}</div>`,a:''+Math.max(a,b),o:shuf([''+a,''+b])}}
 const a=rnd(s)+1,b=rnd(a)+1;return{key:'s'+a+'-'+b,p:'How many are left?',v:`${e.repeat(a)}<div>${a} − ${b} = ?</div>`,a:''+(a-b),o:opts(''+(a-b),pool)}},
word(){const i=rnd(26),[w,e]=L[i],c=String.fromCharCode(65+i),lc=c.toLowerCase(),t=rnd(4),UP=L.map((_,k)=>String.fromCharCode(65+k));
 if(t==0)return{key:'a'+i,p:'What letter does this word start with?',v:`<div class="big">${e}</div>${w}`,a:c,o:opts(c,UP),say:`${w}. What letter does ${w} start with?`};
 if(t==1)return{key:'b'+i,p:`Find the picture that starts with ${c}`,v:`<div class="big">${c} ${lc}</div>`,a:e,o:opts(e,L.map(x=>x[1])),e:`${c} is for ${w}!`};
 if(t==2)return{key:'c'+i,p:`Which is the small letter for ${c}?`,v:`<div class="big">${c}</div>`,a:lc,o:opts(lc,UP.map(x=>x.toLowerCase()))};
 return{key:'d'+i,p:'What is this?',v:`<div class="big">${e}</div>`,a:w,o:opts(w,L.map(x=>x[0])),e:`${c} is for ${w}!`}},
col(){const i=rnd(12),[n,h,o1,o2]=C[i],t=rnd(3),names=C.map(c=>c[0]),ob=[o1,o2][rnd(2)];
 if(t==0)return{key:'s'+i,p:'What color is this?',v:`<div class="sw" style="background:${h}"></div>`,a:n,o:opts(n,names)};
 if(t==1)return{key:'o'+ob,p:'What color is this?',v:`<div class="big">${ob}</div>`,a:n,o:opts(n,names)};
 return{key:'f'+i+ob,p:`Can you find something ${n.toLowerCase()}?`,v:`<div class="sw" style="background:${h}"></div>`,a:ob,o:opts(ob,C.filter((_,k)=>k!=i).flatMap(c=>[c[2],c[3]])),e:`${n} like ${ob}!`}},
ani(){const i=rnd(A.length),[n,e,s]=A[i],t=rnd(3),lab=a=>a[1]+' '+a[0];
 if(t==0)return{key:'w'+i,p:`Which animal says ${s}?`,v:'',a:lab(A[i]),o:opts(lab(A[i]),A.map(lab))};
 if(t==1)return{key:'n'+i,p:'Who is this? Tap to hear!',v:`<button class="pic" data-say="${s}">${e}<small class="bub">Tap me</small></button>`,a:n,o:opts(n,A.map(a=>a[0])),say:'Who is this? Tap the animal to hear it.',e:`The ${n.toLowerCase()} says ${s}!`};
 return{key:'m'+i,p:`What does the ${n.toLowerCase()} say?`,v:`<div class="big">${e}</div>`,a:s,o:opts(s,A.map(a=>a[2]))}},
kind(){const i=rnd(K.length),k=K[i];return{key:'k'+i,p:k[0],v:'',a:k[1],o:shuf([k[1],k[2],k[3]]),e:k[4]}}};
const SH=[['Circle','<circle cx="30" cy="30" r="26"/>','#ff6b6b'],['Square','<rect x="6" y="6" width="48" height="48"/>','#4cc9f0'],['Triangle','<polygon points="30,5 56,54 4,54"/>','#ffd23f'],['Rectangle','<rect x="3" y="14" width="54" height="32"/>','#2ec4b6'],['Star','<polygon points="30,4 38,22 57,23 42,35 47,55 30,44 13,55 18,35 3,23 22,22"/>','#ff9f1c'],['Heart','<path d="M30 54C6 36 4 14 18 10c8-2 12 4 12 8 0-4 4-10 12-8 14 4 12 26-12 44z"/>','#ff7eb6'],['Diamond','<polygon points="30,3 55,30 30,57 5,30"/>','#7b5cff'],['Oval','<ellipse cx="30" cy="30" rx="27" ry="17"/>','#2eb872']];
const sv=(s,w=70)=>`<svg width="${w}" height="${w}" viewBox="0 0 60 60" fill="${s[2]}" stroke="#1b1840" stroke-width="3" role="img" aria-label="${s[0]}">${s[1]}</svg>`;
const OB=['⚽','🎁','🍕','🚪','🌟','❤️','💎','🥚'],SIDE={Triangle:3,Square:4,Rectangle:4,Diamond:4};
const F=[['Apple','🍎'],['Banana','🍌'],['Grapes','🍇'],['Strawberry','🍓'],['Orange','🍊'],['Watermelon','🍉'],['Pineapple','🍍'],['Cherries','🍒'],['Peach','🍑'],['Lemon','🍋'],['Pear','🍐'],['Mango','🥭'],['Carrot','🥕'],['Tomato','🍅'],['Corn','🌽'],['Broccoli','🥦'],['Potato','🥔'],['Cucumber','🥒'],['Bread','🍞'],['Egg','🥚'],['Milk','🥛'],['Rice','🍚'],['Cheese','🧀'],['Pizza','🍕']];
const B=[['Eye','👁️'],['Nose','👃'],['Ear','👂'],['Mouth','👄'],['Hand','✋'],['Foot','🦶'],['Tongue','👅'],['Tooth','🦷'],['Leg','🦵'],['Arm','💪']],SN=[['see','Eye'],['smell','Nose'],['hear','Ear'],['taste','Tongue'],['chew','Tooth'],['clap','Hand'],['walk','Foot'],['speak','Mouth']];
const OD=[['animals','🐶🐱🐮🐷🐑🐴'],['fruits','🍎🍌🍇🍓🍊🍉'],['vehicles','🚗🚌🚲✈️🚂🚢'],['weather','☀️🌧️❄️🌈⛈️💨'],['clothes','👕👖🧦🧢👗🧤'],['toys','⚽🧸🪁🎈🚀🎨']].map(([n,t])=>[n,[...t.matchAll(/\p{Extended_Pictographic}\uFE0F?/gu)].map(x=>x[0])]);
const PI=['🔴','🔵','🟡','🟢','🟣','🟠','⭐','🌙'];
Object.assign(G,{
abc(c){const i=rnd(26),X=k=>String.fromCharCode(65+k),c0=X(i),lc=c0.toLowerCase(),t=c!=null?c:rnd(6),U=[...Array(26)].map((_,k)=>X(k)),W=U.map(x=>x.toLowerCase()),big=x=>`<div class="big">${x}</div>`;
 if(t==0){const f=rnd(2)?c0:lc;return{key:'0'+f,p:'What letter is this?',v:big(f),a:f,o:opts(f,f==c0?U:W)}}
 if(t==1)return{key:'1'+i,p:`Which is the small letter for ${c0}?`,v:big(c0),a:lc,o:opts(lc,W)};
 if(t==2)return{key:'2'+i,p:`Which is the big letter for ${lc}?`,v:big(lc),a:c0,o:opts(c0,U)};
 if(t==3){const[w,e]=L[i];return{key:'3'+i,p:'What letter does this start with?',v:big(e)+w,a:c0,o:opts(c0,U),e:`${c0} is for ${w}!`}}
 const j=Math.min(i,t==4?23:24);if(t==4)return{key:'4'+j,p:'Which letter is missing?',v:big(`${X(j)} _ ${X(j+2)}`),a:X(j+1),o:opts(X(j+1),U)};
 return{key:'5'+j,p:`What letter comes after ${X(j)}?`,v:big(`${X(j)} ➡️ ❓`),a:X(j+1),o:opts(X(j+1),U)}},
shape(){const i=rnd(8),s=SH[i],n=s[0],t=rnd(4),N=SH.map(x=>x[0]);
 if(t==1)return{key:'sb'+i,p:`Find the ${n.toLowerCase()}`,v:'',a:sv(s),o:opts(sv(s),SH.map(x=>sv(x)))};
 if(t==2&&SIDE[n])return{key:'sc'+i,p:'How many sides?',v:sv(s,120),a:''+SIDE[n],o:opts(''+SIDE[n],['3','4','5','6','8'])};
 if(t==3)return{key:'sd'+i,p:'What shape is this?',v:`<div class="big">${OB[i]}</div>`,a:n,o:opts(n,N)};
 return{key:'sa'+i,p:'What shape is this?',v:sv(s,120),a:n,o:opts(n,N)}},
food(){const i=rnd(24),[n,e]=F[i],t=rnd(3);
 if(t==0)return{key:'fa'+i,p:'What is this?',v:`<div class="big">${e}</div>`,a:n,o:opts(n,F.map(x=>x[0]))};
 if(t==1)return{key:'fb'+i,p:`Find the ${n.toLowerCase()}`,v:'',a:e,o:opts(e,F.map(x=>x[1]))};
 const fr=F[rnd(12)][1];return{key:'fc'+fr,p:'Which one is a fruit?',v:'',a:fr,o:opts(fr,F.slice(12).map(x=>x[1])),e:'Fruits grow on trees and plants!'}},
body(){const t=rnd(3);if(t==2){const[v,a]=SN[rnd(8)];return{key:'s'+v,p:`What do we ${v} with?`,v:'',a,o:opts(a,B.map(x=>x[0]))}}
 const i=rnd(10),[n,e]=B[i];return t?{key:'bb'+i,p:`Find the ${n.toLowerCase()}`,v:'',a:e,o:opts(e,B.map(x=>x[1]))}:{key:'ba'+i,p:'What body part is this?',v:`<div class="big">${e}</div>`,a:n,o:opts(n,B.map(x=>x[0]))}},
odd(){const g=rnd(6),h=(g+1+rnd(5))%6,s=pick(OD[g][1],3),o=pick(OD[h][1],1)[0];return{key:'o'+s.join('')+o,p:'Which one is different?',v:'',a:o,o:shuf([...s,o]),e:`The others are ${OD[g][0]}.`}},
pat(){const U=pick(PI,3),k=[[0,1],[0,0,1],[0,1,2]][rnd(3)],u=k.map(x=>U[x]),q=[0,1,2,3,4,5].map(i=>u[i%u.length]),a=q[5];return{key:'p'+q.join(''),p:'What comes next?',v:q.slice(0,5).join(' ')+' ❓',a,o:opts(a,PI)}}});
function bubble(){let r=0,miss=0;const R=5,LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),NUM=Array.from({length:21},(_,i)=>''+i);
 const round=()=>{if(r>=R)return finish('bub',miss<=2?3:miss<=6?2:1,`You popped every bubble with ${miss} slips!`,bubble);r++;
  const pool=[LET,NUM.slice(0,LV().max+1),LET.map(x=>x.toLowerCase())][rnd(3)],T=pool[rnd(pool.length)],k=3+rnd(3);let left=k;
  const items=shuf([...Array(k).fill(T),...pick(pool.filter(x=>x!==T),12-k)]);
  app.innerHTML=`<section class="play"><p class="cnt">Round ${r} of ${R} · Left: <b id="lf">${k}</b></p><h2>Pop every <b id="tg">${T}</b> bubble!</h2><div class="bgrid">${items.map(x=>`<button class="bb" data-v="${x}" aria-label="Bubble ${x}">${x}</button>`).join('')}</div></section>`;say(`Pop every ${T}`);
  app.querySelectorAll('.bb').forEach(b=>b.onclick=()=>{if(b.classList.contains('pop'))return;
   if(b.dataset.v===T){b.classList.add('pop');left--;S.stars++;good();save();upd();$('#lf').textContent=left;if(!left)setTimeout(round,700)}
   else{miss++;soft();b.classList.add('sh');setTimeout(()=>b.classList.remove('sh'),400)}})};
 round()}
function catMenu(g){const sl=g.gen=='slash';app.innerHTML=`<section class="play"><h2>${g.ic} ${g.n}</h2><p>Pick what to play:</p><div class="opts">${g.cats.map((c,i)=>`<button class="opt c${i%4}" data-c="${i}">${c[0]}</button>`).join('')}${sl?'':'<button class="opt c3" data-c="-1">🎲 Mix everything</button>'}</div></section>`;
 app.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const i=+b.dataset.c,cv=i<0?null:g.cats[i][1];nav(()=>sl?slash(cv):quiz(g.id,G[g.gen],cv))})}
Object.assign(G,{math(c){const t=c!=null?c:rnd(7),m=LV().max,NW=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'],R=n=>Array.from({length:n},(_,i)=>''+i),big=x=>`<div class="big">${x}</div>`;
 if(t==0){const a=rnd(9)+1;return{key:'b'+a,p:`${a} + ? = 10`,v:big(`${a} + ❓ = 10`),a:''+(10-a),o:opts(''+(10-a),R(11)),e:`${a} and ${10-a} make 10!`}}
 if(t==1){const st=[2,5,10][rnd(3)],a0=rnd(3)*st,a=a0+3*st;return{key:'k'+st+a0,p:'Count on! What comes next?',v:big(`${a0}, ${a0+st}, ${a0+2*st}, ❓`),a:''+a,o:opts(''+a,[a-st,a+st,a+1,a-1,a+2].filter(x=>x>=0).map(String))}}
 if(t==2){const a=rnd(10)+1;return{key:'d'+a,p:`What is double ${a}?`,v:big(`${a} + ${a} = ❓`),a:''+2*a,o:opts(''+2*a,[2*a-1,2*a+1,2*a+2,2*a-2,a].map(String))}}
 if(t==3){const a=rnd(21);return rnd(2)?{key:'w'+a,p:'Which number is this word?',v:big(NW[a]),a:''+a,o:opts(''+a,R(21))}:{key:'x'+a,p:`How do we write ${a}?`,v:big(a),a:NW[a],o:opts(NW[a],NW)}}
 if(t==4){const a=2*(rnd(6)+1);return{key:'h'+a,p:`What is half of ${a}?`,v:'🍪'.repeat(a),a:''+a/2,o:opts(''+a/2,R(13)),e:`Half of ${a} is ${a/2}!`}}
 if(t==5){const x=rnd(6)+1,y=(x+rnd(5))%6+1,e=E5[rnd(6)],mo=rnd(2);return{key:'m'+x+y+mo,p:`Which group has ${mo?'MORE':'FEWER'}?`,v:`<div>${e.repeat(x)}</div><div>${e.repeat(y)}</div>`,a:(x>y)==!!mo?'Top group':'Bottom group',o:['Top group','Bottom group']}}
 const h=rnd(12)+1,an=h*Math.PI/6,tx=(n,X,Y)=>`<text x="${X}" y="${Y}" text-anchor="middle" font-size="12" font-weight="800" fill="#1b1840">${n}</text>`;
 return{key:'c'+h,p:'What time is it?',v:`<svg width="140" height="140" viewBox="0 0 100 100" role="img" aria-label="Clock"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#1b1840" stroke-width="4"/>${tx(12,50,18)+tx(3,86,54)+tx(6,50,92)+tx(9,14,54)}<line x1="50" y1="50" x2="${50+26*Math.sin(an)}" y2="${50-26*Math.cos(an)}" stroke="#e63946" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="50" x2="50" y2="14" stroke="#1b1840" stroke-width="3" stroke-linecap="round"/></svg>`,a:`${h} o'clock`,o:opts(`${h} o'clock`,Array.from({length:12},(_,i)=>`${i+1} o'clock`))}}});
function slash(mode){mode=mode||'fruit';const W=640,H=420,FR=['🍎','🍌','🍉','🍓','🍊','🍍','🍑','🍐','🥭','🍇'],EF='56px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif',COL=['#ffd23f','#7be0d4','#ffa8c4','#b9a6ff'],M=mode=='math';
 app.innerHTML=`<section class="play"><h2 id="sq">${M?'Get ready…':'Slice the fruit!'}</h2><p class="cnt">Score: <b id="sc">0</b> · <span id="sub"></span></p><canvas id="cv" width="${W}" height="${H}" aria-label="Slicing game: swipe a finger or mouse across the objects"></canvas><p class="note">Swipe your finger or mouse across the ${M?'right number':'fruit'}, or just tap it!</p></section>`;
 const cv=$('#cv'),x=cv.getContext('2d');let O=[],P=[],T=[],sc=0,lx=null,ly=null,lastSw=0,spawn=0,q=null,qn=0,wait=0,live=true,raf=0,end=false;const t0=performance.now(),N=8;let last=t0;
 cleanup=()=>{live=false;cancelAnimationFrame(raf)};
 const launch=(e,n,i=0)=>{const sx=60+rnd(W-120);O.push({x:sx,y:H+40,vx:(W/2-sx)*.35+rnd(120)-60,vy:-(560+rnd(120)),e,n,r:n?38:34,a:0,va:rnd(6)-3,col:COL[i%4]})};
 const juice=(o,c)=>{for(let i=0;i<10;i++)P.push({x:o.x,y:o.y,vx:rnd(300)-150,vy:rnd(300)-200,l:.6,c,r:4+rnd(5)})};
 const wave=()=>[q.a,...pick(Array.from({length:Math.min(LV().max,10)+3},(_,i)=>''+i).filter(v=>v!==q.a),3)].sort(()=>Math.random()-.5).forEach((v,i)=>setTimeout(()=>live&&launch(v,1,i),i*220));
 const nextQ=()=>{if(qn>=N){end=true;return finish('slash',sc>=7?3:sc>=4?2:1,`You sliced ${sc} right numbers out of ${N}!`,()=>slash(mode))}
  const m=Math.min(LV().max,10),add=rnd(2);let a,b,r,tx;if(add){a=rnd(m-1)+1;b=rnd(m-a)+1;r=a+b;tx=`${a} + ${b}`}else{a=rnd(m)+1;b=rnd(a);r=a-b;tx=`${a} − ${b}`}
  q={a:''+r};qn++;O=[];$('#sq').textContent=`What is ${tx}? Slice it!`;say(`What is ${tx}?`);wave()};
 const hit=o=>{if(o.dead)return;if(!M){o.dead=1;sc++;$('#sc').textContent=sc;tone(250+rnd(200),.1,0,'sawtooth',.06);tone(800,.08,.04,'triangle',.06);P.push({half:1,e:o.e,x:o.x,y:o.y,vx:-130,vy:-90,a:o.a,va:-4,l:1,s:-1},{half:1,e:o.e,x:o.x,y:o.y,vx:130,vy:-90,a:o.a,va:4,l:1,s:1});juice(o,'#ff6b6b');if(sc%5==0){S.stars++;save();upd();good()}}
  else if(o.e===q.a&&!wait){o.dead=1;sc++;S.stars++;save();upd();$('#sc').textContent=sc;good();juice(o,'#2ec4b6');say('Yes!');wait=.9}
  else if(o.e!==q.a){o.dead=1;soft();juice(o,'#999')}};
 const seg=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/l));return Math.hypot(px-ax-t*dx,py-ay-t*dy)};
 const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]};
 cv.style.touchAction='none';
 cv.onpointerdown=e=>{const[px,py]=pt(e);lx=px;ly=py;O.forEach(o=>Math.hypot(o.x-px,o.y-py)<o.r+8&&hit(o))};
 cv.onpointermove=e=>{const[px,py]=pt(e),now=performance.now();T.push([px,py,now]);if(lx!=null){if(Math.hypot(px-lx,py-ly)>18&&now-lastSw>140){lastSw=now;sweep(900,300,.12,.03)}O.forEach(o=>!o.dead&&seg(o.x,o.y,lx,ly,px,py)<o.r+6&&hit(o))}lx=px;ly=py};
 cv.onpointerup=cv.onpointerleave=()=>{lx=null};
 const draw=()=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#4cc9f0');g.addColorStop(1,'#b9fbc0');x.fillStyle=g;x.fillRect(0,0,W,H);x.textAlign='center';x.textBaseline='middle';
  for(const o of O){x.save();x.translate(o.x,o.y);x.rotate(o.a);if(o.n){x.fillStyle=o.col;x.beginPath();x.arc(0,0,o.r,0,7);x.fill();x.lineWidth=4;x.strokeStyle='#1b1840';x.stroke();x.fillStyle='#1b1840';x.font='800 38px sans-serif';x.fillText(o.e,0,2)}else{x.font=EF;x.fillText(o.e,0,4)}x.restore()}
  for(const p of P){x.save();x.globalAlpha=Math.max(p.l,0);if(p.half){x.translate(p.x,p.y);x.rotate(p.a);x.beginPath();x.rect(p.s<0?-40:0,-40,40,80);x.clip();x.font=EF;x.fillText(p.e,0,4)}else{x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}x.restore()}
  if(T.length>1){x.strokeStyle='#fff';x.lineWidth=6;x.lineCap='round';x.beginPath();T.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke()}};
 const step=now=>{if(!live||end)return;const dt=Math.min((now-last)/1000,.05);last=now;
  for(const o of O){o.vy+=560*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.a+=o.va*dt}
  for(const p of P){p.vy+=500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt*1.2;if(p.half)p.a+=p.va*dt}
  O=O.filter(o=>!o.dead&&(o.vy<0||o.y<H+60));P=P.filter(p=>p.l>0);T=T.filter(p=>now-p[2]<160);
  if(!M){const left=Math.ceil(45-(now-t0)/1000);$('#sub').textContent=`Time: ${Math.max(left,0)}s`;spawn-=dt;if(spawn<=0){for(let i=rnd(3)+1;i>0;i--)launch(FR[rnd(FR.length)],0);spawn=.9+Math.random()*.6}
   if(left<=0){end=true;return finish('slash',sc>=25?3:sc>=12?2:1,`You sliced ${sc} fruits!`,()=>slash(mode))}}
  else{$('#sub').textContent=`Question ${Math.min(qn,N)} of ${N}`;if(wait>0){wait-=dt;if(wait<=0){wait=0;nextQ();if(end)return}}else if(q&&!O.length&&!wait)wave()}
  draw();raf=requestAnimationFrame(step)};
 if(M)nextQ();raf=requestAnimationFrame(step)}
function quiz(id,gen,cat){let n=0,ok=0,rec=[];const N=S.len||20;
 const step=()=>{if(n>=N)return finish(id,ok>=N*.9?3:ok>=N*.6?2:1,`You got ${ok} out of ${N} right!`,()=>quiz(id,gen,cat));
  let q,t=0;do{q=gen(cat);t++}while(rec.includes(q.key)&&t<30);rec=[...rec,q.key].slice(-8);n++;
  app.innerHTML=`<section class="play"><div class="prog"><i style="width:${(n-1)/N*100}%"></i></div><p class="cnt">Question ${n} of ${N}</p><h2>${q.p}</h2><div class="vis">${q.v}</div><button class="hear" id="hear">🔊 Hear it</button><div class="opts">${q.o.map((x,i)=>`<button class="opt c${i}" data-i="${i}"><span aria-hidden="true">${'▲●■◆'[i]}</span> ${x}</button>`).join('')}</div><div class="fb" id="fb" aria-live="polite"></div></section>`;
  $('#hear').onclick=()=>say(q.say||q.p);say(q.say||q.p);
  app.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>{say(b.dataset.say);b.querySelector('.bub').textContent=b.dataset.say+'!';beep(600,.1)});
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const r=q.o[b.dataset.i]===q.a;
   app.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(q.o[x.dataset.i]===q.a)x.classList.add('right')});
   if(r){ok++;S.stars++;good();burst();$('#fb').innerHTML='🌟 Great job! '+(q.e||'')}else{b.classList.add('miss');soft();$('#fb').innerHTML=`💛 Nice try! The answer is <b>${q.a}</b>. ${q.e||''}`}
   say(r?'Great job!':'Nice try! '+q.a);save();upd();$('#fb').insertAdjacentHTML('beforeend',`<br><button class="go" id="nx">${n>=N?'Finish':'Next'} ➜</button>`);$('#nx').onclick=step;$('#nx').focus()})};
 step()}
function memory(){const P={easy:4,medium:6,hard:8}[S.level]||4,sel=pick([...new Set([...A.map(a=>a[1]),'🍎','🍌','🍓','🍇','🍊','🍉','🚗','⭐'])],P),cards=shuf([...sel,...sel]);let first=-1,lock=false,moves=0,found=0,sec=0;
 app.innerHTML=`<section class="play"><h2>Find the matching pairs!</h2><p class="cnt">Moves: <b id="mv">0</b> · Pairs: <b id="pr">0</b>/${P} · Time: <b id="tm">0</b>s</p><div class="mgrid">${cards.map((c,i)=>`<button class="card" aria-label="Card ${i+1}, face down"><div class="in"><div class="f">❓</div><div class="b">${c}</div></div></button>`).join('')}</div></section>`;
 const tmr=setInterval(()=>{sec++;$('#tm').textContent=sec},1000);cleanup=()=>clearInterval(tmr);
 const els=[...app.querySelectorAll('.card')];
 els.forEach((el,i)=>el.onclick=()=>{if(lock||el.classList.contains('up'))return;el.classList.add('up');el.setAttribute('aria-label',`Card ${i+1}: ${cards[i]}`);beep(440,.08);
  if(first<0){first=i;return}
  const j=first;first=-1;moves++;$('#mv').textContent=moves;
  if(cards[i]===cards[j]){found++;$('#pr').textContent=found;els[i].classList.add('ok');els[j].classList.add('ok');good();
   if(found==P){cleanup();setTimeout(()=>finish('mem',moves<=P+2?3:moves<=P*2?2:1,`You matched all ${P} pairs in ${moves} moves and ${sec} seconds!`,memory),700)}}
  else{lock=true;soft();setTimeout(()=>{els[i].classList.remove('up');els[j].classList.remove('up');lock=false},900)}})}
const GAMES=[['mem','Memory Match','🃏','#ff6b6b'],['num','Number Ninja','🥷','#4cc9f0','num',[['👁️ Know numbers',0],['🍎 Count',1],['➕ Add',2],['➖ Take away',3],['➡️ What comes next',4],['⚖️ Bigger or smaller',5]]],['math','Math Magic','🧮','#ff595e','math',[['🤝 Make 10',0],['🦘 Skip counting',1],['✌️ Doubles',2],['🔤 Number words',3],['🍪 Half',4],['⚖️ More or fewer',5],['🕒 Read the clock',6]]],['slash','Fruit Slash','🍉','#2dc653','slash',[['🍉 Slice the fruit!','fruit'],['🔢 Math Slash','math']]],['abc','ABC Letters','🔤','#7b5cff','abc',[['🔤 Which letter is this?',0],['🔡 Small letter',1],['🔠 Big letter',2],['🍎 First letter of a picture',3],['🕳️ Missing letter',4],['➡️ What comes next?',5]]],['word','Word Wizard','🧙','#9b5de5','word'],['col','Color Quest','🎨','#ff9f1c','col'],['ani','Animal Sounds','🦁','#2ec4b6','ani'],['shape','Shape Safari','🔷','#4361ee','shape'],['food','Fruit Garden','🍓','#e63946','food'],['body','My Body','🖐️','#f77f00','body'],['odd','Odd One Out','🧩','#06a77d','odd'],['pat','Pattern Play','🔁','#b5179e','pat'],['bub','Bubble Pop','🫧','#3a86ff'],['kind','Kindness Quest','💛','#ff7eb6','kind']].map(([id,n,ic,c,gen,cats])=>({id,n,ic,c,gen,cats})).concat(typeof EXTRA!=='undefined'?EXTRA:[]);
const BG=[['first','First Game','🎈',()=>Object.keys(S.done).length>=1],['s25','25 Stars','🌟',()=>S.stars>=25],['s100','100 Stars','🌠',()=>S.stars>=100],['three','Three-Star Hero','🏅',()=>Object.values(S.best).includes(3)],['all','Explorer: every game','🧭',()=>GAMES.every(g=>S.done[g.id])],['s250','250 Stars','👑',()=>S.stars>=250]];
function finish(id,stars,msg,again){S.done[id]=(S.done[id]||0)+1;S.best[id]=Math.max(S.best[id]||0,stars);S.stars+=stars;
 const nb=BG.filter(b=>!S.badges.includes(b[0])&&b[3]());S.badges.push(...nb.map(b=>b[0]));save();upd();good();burst();say('Hooray! You did it!');
 app.innerHTML=`<section class="play"><h2>🎉 Hooray!</h2><p class="big">${'⭐'.repeat(stars)}</p><p>${msg}</p>${nb.map(b=>`<p class="badge">${b[2]} New badge: ${b[1]}</p>`).join('')}<button class="go" id="again">↻ Play again</button><button class="go alt" id="hm">🏠 Home</button></section>`;
 $('#again').onclick=again;$('#hm').onclick=()=>nav(home)}
let cur=null,stack=[];
const run=f=>{cleanup();cleanup=()=>{};try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}f();$('#backBtn').hidden=!stack.length;window.scrollTo(0,0)};
const nav=f=>{if(f===home)stack=[];else if(cur&&cur!==f)stack.push(cur);cur=f;run(f)};
const back=()=>{cur=stack.pop()||home;run(cur)};
const start=g=>nav(g.fn?g.fn:g.id=='mem'?memory:g.id=='bub'?bubble:()=>g.cats?catMenu(g):quiz(g.id,G[g.gen]));
const MAS=`<svg class="mas" viewBox="0 0 120 120" role="img" aria-label="Starry the star"><path d="M60 8l14 34 37 3-28 24 9 36-32-19-32 19 9-36L9 45l37-3z" fill="#ffd23f" stroke="#f4a000" stroke-width="4" stroke-linejoin="round"/><circle cx="48" cy="58" r="6" fill="#222"/><circle cx="72" cy="58" r="6" fill="#222"/><circle cx="50" cy="56" r="2" fill="#fff"/><circle cx="74" cy="56" r="2" fill="#fff"/><path d="M48 72q12 11 24 0" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="40" cy="70" r="5" fill="#ff9aa2"/><circle cx="80" cy="70" r="5" fill="#ff9aa2"/></svg>`;
function home(){app.innerHTML=`<section><div class="hero">${MAS}<div><h1>Welcome to Kofix Little Stars!</h1><p>Pick a game and collect stars!</p><p class="by">Created &amp; Sponsored by <b>MR. KOFIX</b></p><button class="go" id="lp">⭐ Let's Play!</button></div></div><div class="grid">${GAMES.map(g=>`<button class="gc" style="--c:${g.c}" data-g="${g.id}"><span class="ic">${g.ic}</span><b>${g.n}</b><small>${'⭐'.repeat(S.best[g.id]||0)||'New!'}</small></button>`).join('')}<button class="gc" style="--c:#ffd23f" id="prg"><span class="ic">🏆</span><b>My Stars</b><small>${S.badges.length} badges</small></button></div></section>`;
 app.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>start(GAMES.find(g=>g.id==b.dataset.g)));
 $('#lp').onclick=()=>start(GAMES[rnd(GAMES.length)]);$('#prg').onclick=()=>nav(progress)}
function progress(){app.innerHTML=`<section class="play"><h2>🏆 My Stars</h2><p class="big">⭐ ${S.stars}</p>${GAMES.map(g=>`<p>${g.ic} ${g.n}: played ${S.done[g.id]||0} times · best ${'⭐'.repeat(S.best[g.id]||0)||'–'}</p>`).join('')}<h2>Badges</h2>${BG.map(b=>`<p class="badge ${S.badges.includes(b[0])?'':'locked'}">${b[2]} ${b[1]} ${S.badges.includes(b[0])?'✔ Earned':'🔒 Not yet'}</p>`).join('')}<button class="go" id="hm">🏠 Home</button></section>`;$('#hm').onclick=()=>nav(home)}
const FR={banana:'yellow',apple:'red',strawberry:'red',grapes:'purple',lemon:'yellow',kiwi:'green',carrot:'orange'};
function helper(q){q=q.toLowerCase();let m;
 if(/\b(kill|die|dead|blood|gun|sex|naked|hate|hurt|stranger|address|password)\b/.test(q))return'That is a question for a grown-up. Please ask a parent or a trusted adult. 💛';
 if(m=q.match(/(\d+)\s*([+-])\s*(\d+)/)){const a=+m[1],b=+m[3];return`${a} ${m[2]} ${b} = ${m[2]=='+'?a+b:a-b}. Try counting on your fingers! ✋`}
 if(m=q.match(/(after|before) (\d+)/))return m[1]=='after'?`After ${m[2]} comes ${+m[2]+1}.`:`Before ${m[2]} comes ${Math.max(0,m[2]-1)}.`;
 if(m=q.match(/letter ([a-z])\b|starts? with ([a-z])\b|\b([a-z]) for\b/)){const c=(m[1]||m[2]||m[3]).toUpperCase(),[w,e]=L[c.charCodeAt(0)-65];return`${c} is for ${w} ${e}. Big ${c}, small ${c.toLowerCase()}!`}
 for(const k in FR)if(q.includes(k))return`A ${k} is ${FR[k]}! 🌈`;
 const c=C.find(x=>new RegExp('\\b'+x[0].toLowerCase()+'\\b').test(q));if(c)return`${c[0]} things: ${c[2]} ${c[3]}`;
 const a=A.find(x=>new RegExp('\\b'+x[0].toLowerCase()+'\\b').test(q));if(a)return`${a[1]} The ${a[0].toLowerCase()} says ${a[2]}!`;
 if(/^(hi|hello|hey)/.test(q))return'Hello, little star! ⭐ Ask me about letters, numbers, colors or animals.';
 return null}
const BAD=/\b(kill|killed|die|dies|died|dead|death|blood|gun|guns|sex|sexual|naked|nude|porn|hate|hurt|stranger|address|password|drug|drugs|suicide|murder|weapon|bomb|terror|war|violence|alcohol|beer|cigarette|abuse)\b/i;
async function lookup(q){try{const t=q.replace(/[?!.]/g,'').replace(/^(please\s+)?(tell me\s+)?(about\s+)?(what|who|where|why|how|when)\s+(is|are|was|were|does|do|did|can)?\s*(a|an|the)?\s*/i,'').trim()||q,ctl=new AbortController();setTimeout(()=>ctl.abort(),6000);
 const j=await(await fetch('https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(t)+'&gsrlimit=1&prop=extracts&exintro=1&explaintext=1&exsentences=2&format=json&origin=*',{signal:ctl.signal})).json(),p=Object.values(j.query.pages)[0],x=(p.extract||'').trim();
 if(!x||BAD.test(x)||BAD.test(p.title))return'That one is best for a grown-up to explain. Ask a parent or a trusted adult! 💛';
 return x.slice(0,320)+' 📖 (from Wikipedia)'}catch(e){return'I could not find that. Check the internet, or ask a grown-up! Try: What is a rainbow?'}}
function chat(){const c=$('#chat');c.hidden=!c.hidden;if(c.hidden||c.innerHTML)return;
 c.innerHTML=`<div id="log" aria-live="polite"></div><form><input id="ci" aria-label="Ask Starry a question" placeholder="Ask me anything..." autocomplete="off"><button class="go alt" type="button" id="mic" aria-label="Speak your question">🎤</button><button class="go" type="submit">Send</button></form>`;
 const add=(t,k)=>{const d=document.createElement('div');d.className='m '+k;d.textContent=t;$('#log').appendChild(d);$('#log').scrollTop=1e5;return d};
 add('Hi! I am Starry, a helper (not a live AI). Ask me anything! I know letters, numbers, colors and animals, and I can look other things up. ⭐','bot');
 c.querySelector('form').onsubmit=async e=>{e.preventDefault();const v=$('#ci').value.trim();if(!v)return;add(v,'me');$('#ci').value='';let r=helper(v),d;
  if(!r){d=add(S.look!==false?'Looking that up… 🔎':'','bot');r=S.look!==false?await lookup(v):'I only know letters, numbers, colors and animals right now. Try: What does a cow say?'}
  else d=add('','bot');d.textContent=r;say(r.replace(/📖.*$/,''))};
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition,mic=$('#mic'),fm=c.querySelector('form');
 mic.onclick=()=>{if(!SR){add('Voice does not work in this browser. Please type your question!','bot');return}try{const r=new SR();r.lang='en-US';r.interimResults=false;r.onstart=()=>mic.classList.add('rec');r.onend=()=>mic.classList.remove('rec');r.onresult=e=>{$('#ci').value=e.results[0][0].transcript;fm.dispatchEvent(new Event('submit',{cancelable:true}))};r.onerror=()=>add('I could not hear you. Try again or type!','bot');r.start()}catch(e){add('The microphone is not available.','bot')}};
 $('#ci').focus()}
let sheet=null;
const SFXN={bells:'🔔 Bells',xylo:'🎹 Xylophone',chime:'✨ Chimes',pop:'🫧 Pops'},MUS={off:'🔇 No music',happy:'😀 Happy bounce',twinkle:'🌟 Twinkle lullaby',calm:'🌙 Calm night'};
const choice=(o,cur,attr)=>`<div class="opts">${Object.keys(o).map((k,i)=>`<button class="opt c${i%4} ${cur==k?'right':''}" data-${attr}="${k}">${Array.isArray(o[k])?o[k][0]:o[k]}</button>`).join('')}</div>`;
const soundHTML=()=>`<h2>🔊 Sounds &amp; voices</h2><label><input type="checkbox" id="so2" ${S.sound?'checked':''}> Sound on</label><label><input type="checkbox" id="sp2" ${S.speech?'checked':''}> Read aloud</label><h3>Voice</h3>${choice(VP,S.voice,'v')}<label>Device voice <select id="dv"><option value="">Automatic</option>${VS.map(v=>`<option value="${v.voiceURI}" ${S.vname==v.voiceURI?'selected':''}>${v.name}</option>`).join('')}</select></label><button class="hear" id="ht">🔊 Hear this voice</button><h3>Sound effects</h3>${choice(SFXN,S.sfx,'s')}<h3>Music</h3>${choice(MUS,S.music,'m')}`;
function soundWire(){const q=a=>$('#sheet').querySelectorAll(a);
 $('#so2').onchange=e=>{S.sound=e.target.checked;if(!S.sound){stopMusic();try{speechSynthesis.cancel()}catch(x){}}else if(S.music!=='off')startMusic();save();upd()};
 $('#sp2').onchange=e=>{S.speech=e.target.checked;save()};
 q('[data-v]').forEach(b=>b.onclick=()=>{S.voice=b.dataset.v;save();drawSheet();say('Hi! I am your helper.')});
 $('#dv').onchange=e=>{S.vname=e.target.value;save();say('Hi! This is my voice.')};
 $('#ht').onclick=()=>say('Hello! Welcome to Kofix Little Stars!');
 q('[data-s]').forEach(b=>b.onclick=()=>{S.sfx=b.dataset.s;save();drawSheet();good()});
 q('[data-m]').forEach(b=>b.onclick=()=>{S.music=b.dataset.m;save();drawSheet();S.music=='off'?stopMusic():startMusic()})}
const setHTML=()=>{const LB={easy:'Easy (ages 2–3)',medium:'Medium (ages 4–5)',hard:'Hard (ages 6–7)'};return`<h2>⚙️ Settings (grown-ups)</h2><label>Level <select id="lv">${Object.keys(LB).map(k=>`<option value="${k}" ${S.level==k?'selected':''}>${LB[k]}</option>`).join('')}</select></label><label>Questions per round <select id="ln">${[10,20,30].map(k=>`<option ${S.len==k?'selected':''}>${k}</option>`).join('')}</select></label><label><input type="checkbox" id="lk" ${S.look!==false?'checked':''}> Starry may look things up on Wikipedia</label><p class="note">Typed questions go to Wikipedia. The microphone button uses your browser's speech service. Saved only in this browser: stars, badges, games played and settings. No names or personal details are collected.</p><button class="go alt" id="rs">Reset progress</button><div id="rc"></div><p class="note">📸 Kofix Photography Studio · Created &amp; Sponsored by MR. KOFIX</p>`};
function setWire(){$('#lv').onchange=e=>{S.level=e.target.value;save()};$('#ln').onchange=e=>{S.len=+e.target.value;save()};$('#lk').onchange=e=>{S.look=e.target.checked;save()};
 $('#rs').onclick=()=>{$('#rc').innerHTML=`<p>Erase all stars and badges?</p><button class="go" id="y">Yes, reset</button><button class="go alt" id="n">No</button>`;$('#y').onclick=()=>{const k={sound:S.sound,speech:S.speech,level:S.level,len:S.len,look:S.look,voice:S.voice,vname:S.vname,sfx:S.sfx,music:S.music};S={...DEF,...k};save();upd();drawSheet()};$('#n').onclick=()=>{$('#rc').innerHTML=''}}}
function drawSheet(){const s=$('#sheet');s.hidden=false;s.innerHTML=`<div class="sh2" role="dialog" aria-label="${sheet=='set'?'Settings':'Sounds and voices'}"><button class="go alt" id="sx">✖ Close</button>${sheet=='set'?setHTML():soundHTML()}</div>`;$('#sx').onclick=()=>toggleSheet(sheet);(sheet=='set'?setWire:soundWire)()}
function toggleSheet(k){if(!k||sheet===k){sheet=null;$('#sheet').hidden=true;return}sheet=k;drawSheet()}
$('#homeBtn').onclick=()=>{toggleSheet(null);nav(home)};$('#backBtn').onclick=()=>{toggleSheet(null);back()};
$('#setBtn').onclick=()=>toggleSheet('set');$('#soundBtn').onclick=()=>toggleSheet('sound');
$('#sheet').onclick=e=>{if(e.target.id==='sheet')toggleSheet(null)};addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet)toggleSheet(null)});
addEventListener('pointerdown',()=>{if(S.music!=='off'&&!mt)startMusic()},{once:true});
upd();nav(home);

if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
$('#chatFab').onclick=chat;
