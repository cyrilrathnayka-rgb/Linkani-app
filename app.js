/* LinkAni - modular prototype. Add a screen: registerScreen('name', () => html). */
const CATS=['Manga','Webnovel','Manhwa','Anime','Webcomic'];
const mk=(id,title,type,author,date,rating,views,rank,desc)=>({id,title,type,author,date,rating,views,rank,desc});
const TITLES=[
 mk(1,'Crimson Gate','Manga','K. Tanaka','2024-03-12',4.8,'1.2M',1,'A gatekeeper guards the border between two worlds and breaks the one rule she was given.'),
 mk(2,'Moonlit Ledger','Webnovel','R. Silva','2023-11-02',4.6,'860K',2,'An accountant inherits a ledger that records debts owed to the dead.'),
 mk(3,'Tower of Ash','Manhwa','J. Park','2025-01-20',4.9,'2.1M',3,'Every floor of the tower erases a memory. Climb anyway.'),
 mk(4,'Skyline Drifters','Anime','Studio Nova','2025-06-05',4.5,'3.4M',4,'Three couriers race across a floating city before the storm season closes the routes.'),
 mk(5,'Paper Lanterns','Webcomic','M. Costa','2022-08-15',4.4,'430K',5,'Short stories about a night market that appears only when it rains.'),
 mk(6,'Iron Orchard','Manga','H. Sato','2024-09-09',4.3,'540K',6,'A farmer builds an orchard from scrap metal and the town wants it gone.'),
 mk(7,'Echo Archive','Webnovel','L. Wong','2024-02-27',4.7,'990K',7,'A librarian can hear the last words written in every book she shelves.'),
 mk(8,'Neon Shrine','Anime','Studio Kite','2026-01-14',4.6,'1.8M',8,'A shrine maiden streams exorcisms to pay off the shrine mortgage.')
];
TITLES.forEach(t=>{t.chapters=Array.from({length:t.type==='Anime'?12:20},(_,i)=>({n:i+1,name:(t.type==='Anime'?'Episode ':'Chapter ')+(i+1)}))});

/* ---- state (saved in this browser; swap for an API later) ---- */
const load=()=>{try{return JSON.parse(localStorage.getItem('linkani'))}catch(e){return null}};
const S=Object.assign({fav:[],priv:{},hist:[],covers:{},coins:1000,read:{},daily:'',cat:'Manga',chat:['Welcome to the group chat!'],
 tx:[{d:'2026-11-01',t:'Welcome bonus',a:1000}]},load()||{});
const save=()=>{try{localStorage.setItem('linkani',JSON.stringify(S))}catch(e){}};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hue=id=>`linear-gradient(160deg,hsl(${id*47%360} 60% 22%),#000)`;
const coverStyle=t=>S.covers[t.id]?`background-image:url(${S.covers[t.id]})`:`background-image:${hue(t.id)}`;

const earn=(a,t)=>{S.coins+=a;S.tx.unshift({d:new Date().toISOString().slice(0,10),t,a});save()};
/* ---- components ---- */
const JP={Manga:'マンガ',Webnovel:'ウェブ小説',Manhwa:'マンファ',Anime:'アニメ',Webcomic:'ウェブコミック'};
const Card=t=>`<button class="card" data-open="${t.id}"><div class="cover" style="${coverStyle(t)}"><em class="rk">#${t.rank}</em>${S.covers[t.id]?'':esc(t.title[0])}</div><b>${esc(t.title)}</b><span>★ ${t.rating} · ${t.type}</span></button>`;
const Row=(th,title,sub,right='')=>`<div class="row"><div class="th">${th}</div><div class="t">${title}<small>${sub}</small></div>${right}</div>`;
const Header=()=>{$('#top').innerHTML=`<div class="logo" aria-label="LinkAni logo">L</div><h1>LINK<em>ANI</em></h1><div class="r"><button class="icon" data-go="search" aria-label="Search">🔍</button></div>`};
const NAV=[['studio','🎬','Studio'],['search','🔍','Search'],['home','🏠','Home'],['chat','💬','Groups'],['fav','🔖','Saved']];
const Nav=cur=>{$('#nav').innerHTML=NAV.map(([k,i,l])=>`<button data-go="${k}" class="${k===cur?'on':''}${k==='home'?' hm':''}" aria-label="${l}"><span>${k==='home'?'<b>'+i+'</b>':i}</span>${l}</button>`).join('')};

/* ---- screens ---- */
const screens={};
const registerScreen=(name,fn)=>screens[name]=fn;

registerScreen('home',()=>{
 const pop=TITLES.filter(t=>t.type===S.cat).concat(TITLES.filter(t=>t.type!==S.cat));
 return `<h2 style="margin-top:0">Create your roll</h2>
 <div class="roll" id="roll">${CATS.map((c,n)=>`<button data-cat="${c}" class="${c===S.cat?'on':''}"><i>0${n+1}</i><span class="jp">${JP[c]}</span>${c}<small>${TITLES.filter(t=>t.type===c).length} titles</small></button>`).join('')}</div>
 <button class="btn block" data-go="results">Browse ${S.cat}</button>
 <button class="btn block live" data-live><i></i> Watch live streams</button>
 <h2>Top popular</h2><div class="hscroll">${pop.map(Card).join('')}</div>`});
registerScreen('results',()=>`<h2 style="margin-top:0">${S.cat}</h2><div class="grid">${TITLES.filter(t=>t.type===S.cat).map(Card).join('')}</div>`);
registerScreen('search',()=>`<input type="search" id="q" placeholder="Search title or author" aria-label="Search"><div id="res" class="grid">${TITLES.map(Card).join('')}</div>`);
registerScreen('fav',()=>{const l=TITLES.filter(t=>S.fav.includes(t.id));return `<h2 style="margin-top:0">Saved</h2>`+(l.length?`<div class="grid">${l.map(Card).join('')}</div>`:`<div class="empty">Nothing saved yet. Open a title and tap Save.</div>`)});
registerScreen('chat',()=>`<h2 style="margin-top:0">Chat groups</h2><div id="msgs">${S.chat.map((m,i)=>`<div class="msg ${i&&'me'}">${esc(m)}</div>`).join('')}</div><input type="text" id="msgin" placeholder="Write a message" maxlength="300"><button class="btn block" data-send>Send</button>`);
registerScreen('studio',()=>{
 const h=S.hist.map(id=>TITLES.find(t=>t.id===id)).filter(Boolean);
 return `<div class="profile"><div class="avatar">A</div><div><b style="font-size:18px">AniFan</b><span class="badge">✔ Verified</span><div class="dim" style="font-size:13px">Reader · Creator</div></div></div>
 <button class="btn ghost wallet" data-tx><div><small class="dim">Wallet</small><br><b>${S.coins.toFixed(2)} coins</b></div><span>History ›</span></button>
 <div style="display:flex;gap:10px"><button class="btn block" data-buy>Buy coins</button><button class="btn block ghost" data-daily>Daily +20</button></div><h2>History</h2>`+(h.length?h.map(t=>Row(esc(t.title[0]),esc(t.title),t.type,`<button class="btn ghost" data-open="${t.id}">Open</button>`)).join(''):`<div class="empty">Titles you watch or read appear here.</div>`)});
registerScreen('detail',id=>{
 const t=TITLES.find(x=>x.id==id);if(!t)return screens.home();
 const saved=S.fav.includes(t.id);
 return `<div class="banner" style="${coverStyle(t)}"><label>📷 Upload cover<input type="file" accept="image/*" data-cover="${t.id}" hidden></label></div>
 <div class="stats"><div><b>${t.views}</b>Views</div><div><b>#${t.rank}</b>Rank</div><div><b>★ ${t.rating}</b>Rating</div></div>
 <h2 style="margin:0">${esc(t.title)}</h2><p class="dim" style="font-size:13px;margin:4px 0 12px">${esc(t.author)} · ${t.date} · ${t.type}</p>
 <div class="glass">${esc(t.desc)}</div>
 <button class="btn block ghost" data-save="${t.id}">${saved?'Remove from saved':'Save to favorites'}</button>
 <h2>${t.type==='Anime'?'Episodes':'Chapters'}</h2>
 ${t.chapters.map(c=>{const k=t.id+'-'+c.n,p=!!S.priv[k];return Row(c.n,esc(c.name),p?'Private':'Public',
  `<div class="seg"><button data-vis="${k}|0" class="${p?'':'on'}">Public</button><button data-vis="${k}|1" class="${p?'on':''}">Private</button></div><button class="btn" data-read="${t.id}|${c.n}">${t.type==='Anime'?'Play':'Read'}</button>`)}).join('')}`});

/* ---- router ---- */
let cur='home',arg=null;
function go(name,a){$('#screen').classList.toggle('still',!!go.still);go.still=false;cur=name;arg=a;Header();$('#screen').innerHTML=screens[name](a);$('#screen').scrollTop=0;Nav(name==='detail'||name==='results'?'home':name);
 if(name==='search')$('#q').oninput=e=>{const q=e.target.value.toLowerCase();$('#res').innerHTML=TITLES.filter(t=>(t.title+t.author).toLowerCase().includes(q)).map(Card).join('')||'<div class="empty">No matches.</div>'}}
function sheet(html){const s=$('#sheet');s.innerHTML=`<div>${html}<button class="btn block" data-close>Close</button></div>`;s.hidden=false}

document.addEventListener('click',e=>{
 const d=e.target.closest('[data-go],[data-open],[data-cat],[data-save],[data-vis],[data-read],[data-tx],[data-buy],[data-daily],[data-live],[data-send],[data-pay],[data-close]');if(!d)return;
 const D=d.dataset;
 if(D.go)return go(D.go);
 if(D.open)return go('detail',D.open);
 if(D.cat){S.cat=D.cat;save();document.querySelectorAll('#roll button').forEach(b=>b.classList.toggle('on',b===d));d.scrollIntoView({inline:'center',block:'nearest'});return;}
 if(D.save){const i=+D.save;S.fav=S.fav.includes(i)?S.fav.filter(x=>x!==i):S.fav.concat(i);save();go.still=true;return go('detail',i)}
 if(D.vis){const[k,v]=D.vis.split('|');if(v==='1')S.priv[k]=true;else delete S.priv[k];save();const y=$('#screen').scrollTop;go.still=true;go('detail',arg);$('#screen').scrollTop=y;return}
 if(D.read){const[i,n]=D.read.split('|'),t=TITLES.find(x=>x.id==i);if(S.priv[i+'-'+n])return sheet('<h2>Private</h2><p class="dim">This one is set to Private. Switch it to Public to open it.</p>');
  if(!S.read[i+'-'+n]){S.read[i+'-'+n]=1;earn(5,'Reading reward')}
  S.hist=[t.id].concat(S.hist.filter(x=>x!==t.id)).slice(0,30);save();return sheet(`<h2>${esc(t.title)} · ${esc(t.chapters[n-1].name)}</h2><p class="dim">Reader placeholder. Connect your pages, text or video source here.</p>`)}
 if('daily' in D){const d=new Date().toISOString().slice(0,10);if(S.daily===d)return sheet('<h2>Already claimed</h2><p class="dim">Come back tomorrow for more coins.</p>');S.daily=d;earn(20,'Daily check-in');return go('studio')}
 if('buy' in D)return sheet('<h2>Buy coins</h2><p class="dim">Demo only. Connect a payment provider to make this real.</p>'+[[100,'$0.99'],[500,'$3.99'],[1200,'$7.99']].map(([c,p])=>Row('🪙',c+' coins',p,`<button class="btn" data-pay="${c}">Buy</button>`)).join(''));
 if(D.pay){earn(+D.pay,'Coin purchase (demo)');$('#sheet').hidden=true;return go('studio')}
 if('tx' in D)return sheet('<h2>Transactions</h2>'+S.tx.map(x=>Row('🪙',esc(x.t),x.d,`<b>${x.a>0?'+':''}${x.a}</b>`)).join(''));
 if('live' in D)return sheet('<h2>Live streams</h2><div class="empty">No streams are live right now. Creators in Studio will appear here.</div>');
 if('send' in D){const i=$('#msgin'),v=i.value.trim();if(v){S.chat.push(v);save();go('chat')}return}
 if('close' in D)$('#sheet').hidden=true});
document.addEventListener('change',e=>{const f=e.target.dataset.cover;if(!f||!e.target.files[0])return;
 const r=new FileReader();r.onload=()=>{S.covers[f]=r.result;try{save()}catch(x){}go('detail',f)};r.readAsDataURL(e.target.files[0])});
go('home');
