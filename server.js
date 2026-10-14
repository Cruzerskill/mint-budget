const express=require('express'),webpush=require('web-push'),fs=require('fs'),path=require('path');
const F=process.env.DATA_FILE||path.join(__dirname,'data.json');
let D={keys:null,subs:{}};try{D=JSON.parse(fs.readFileSync(F,'utf8'))}catch(e){}
if(process.env.VAPID_PUBLIC&&process.env.VAPID_PRIVATE)D.keys={publicKey:process.env.VAPID_PUBLIC,privateKey:process.env.VAPID_PRIVATE};
else if(!D.keys){D.keys=webpush.generateVAPIDKeys();console.log('NEW VAPID KEYS - copy these into Render env vars:\nVAPID_PUBLIC='+D.keys.publicKey+'\nVAPID_PRIVATE='+D.keys.privateKey)}
webpush.setVapidDetails(process.env.VAPID_SUBJECT||'mailto:admin@example.com',D.keys.publicKey,D.keys.privateKey);
const save=()=>{try{fs.writeFileSync(F,JSON.stringify(D))}catch(e){console.error('save failed',e.message)}};
const app=express();app.use(express.json({limit:'300kb'}));app.use(express.static(path.join(__dirname,'public')));
const ok=s=>s&&s.endpoint&&s.keys&&s.keys.p256dh&&s.keys.auth;
app.get('/api/vapid',(q,s)=>s.json({key:D.keys.publicKey}));
app.post('/api/sync',(q,s)=>{const{sub,reminders}=q.body||{};if(!ok(sub)||!Array.isArray(reminders))return s.sendStatus(400);
 const old=D.subs[sub.endpoint],rem=reminders.slice(0,600).map(r=>({id:String(r.id).slice(0,80),at:new Date(r.at).getTime(),title:String(r.title).slice(0,80),body:String(r.body).slice(0,160)})).filter(r=>r.at>0);
 const keys=new Set(rem.map(r=>r.id+'@'+r.at));D.subs[sub.endpoint]={sub,reminders:rem,sent:(old?old.sent:[]).filter(k=>keys.has(k))};save();s.json({ok:true,count:rem.length})});
app.post('/api/test',async(q,s)=>{const sub=(q.body||{}).sub;if(!ok(sub))return s.sendStatus(400);
 try{await webpush.sendNotification(sub,JSON.stringify({title:'Mint Budget',body:'Notifications are working \u{1F33F}'}));s.json({ok:true})}catch(e){s.sendStatus(502)}});
async function tick(){const now=Date.now();let dirty=false;
 for(const[ep,u]of Object.entries(D.subs)){for(const r of u.reminders){const k=r.id+'@'+r.at;if(r.at>now||r.at<now-6*36e5||u.sent.includes(k))continue;
  try{await webpush.sendNotification(u.sub,JSON.stringify({title:r.title,body:r.body,tag:r.id}));u.sent.push(k);dirty=true}
  catch(e){if(e.statusCode===404||e.statusCode===410){delete D.subs[ep];dirty=true;break}console.error('push failed',e.statusCode||e.message)}}}
 if(dirty)save()}
setInterval(tick,30000);
app.listen(process.env.PORT||3000,()=>console.log('Mint Budget on port '+(process.env.PORT||3000)));
