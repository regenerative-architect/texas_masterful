// OPTIONAL LEGACY ADAPTER. Not required for Trystero/WebRTC operation.
// Simple room-scoped WebSocket event relay for controlled deployments / migration support.
import {WebSocketServer} from 'ws';
const port=Number(process.env.PORT||8787); const wss=new WebSocketServer({port});
const rooms=new Map();
const clean=v=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,4000);
function leave(ws){if(!ws.room)return;const set=rooms.get(ws.room);set?.delete(ws);if(set&&!set.size)rooms.delete(ws.room)}
wss.on('connection',ws=>{ws.on('message',raw=>{let m;try{m=JSON.parse(String(raw))}catch{return}if(m.type==='join'){leave(ws);ws.room=clean(m.room).slice(0,120);if(!ws.room)return;const set=rooms.get(ws.room)||new Set();set.add(ws);rooms.set(ws.room,set);ws.send(JSON.stringify({type:'joined',room:ws.room,legacy:true}));return}if(!ws.room)return;const envelope={type:'event',room:ws.room,ts:new Date().toISOString(),payload:{type:clean(m?.payload?.type||'message',40),text:clean(m?.payload?.text||'',1000)}};for(const peer of rooms.get(ws.room)||[])if(peer!==ws&&peer.readyState===1)peer.send(JSON.stringify(envelope))});ws.on('close',()=>leave(ws))});
console.log(`Optional legacy Texas Master WS adapter listening on :${port}`);
