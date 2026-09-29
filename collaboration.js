/* Texas Master Systems OS v2 — optional network collaboration using Trystero 0.25.3 action-object API. */
const VERSION='0.25.3';
const STRATEGIES={
  nostr:`https://esm.sh/@trystero-p2p/nostr@${VERSION}`,
  mqtt:`https://esm.sh/@trystero-p2p/mqtt@${VERSION}`,
  torrent:`https://esm.sh/@trystero-p2p/torrent@${VERSION}`,
  ipfs:`https://esm.sh/@trystero-p2p/ipfs@${VERSION}`
};
export async function connectCommons({strategy='nostr',roomId,password='',turnUrl='',turnUser='',turnCredential='',role='',getSnapshot=()=>({schema:'tx-master-room-snapshot',version:1,records:{}}),onSnapshot=()=>{},onEvent=()=>{},onStatus=()=>{}}={}){
  if(!STRATEGIES[strategy])throw new Error('Unsupported discovery strategy');
  const {joinRoom,selfId}=await import(STRATEGIES[strategy]);
  const config={appId:'org.planetaryrestorationarchive.texas-master-os-v2'};
  if(password)config.password=password;
  if(turnUrl)config.turnConfig=[{urls:[turnUrl],...(turnUser?{username:turnUser}:{}),...(turnCredential?{credential:turnCredential}:{})}];
  const peers=new Set();
  const room=joinRoom(config,roomId,{onJoinError:details=>onStatus({peers:[...peers],message:`Join/WebRTC error${details?.peerId?' '+details.peerId.slice(0,6):''}: ${details?.error?.message||details?.error||'unknown error'}. TURN may be required on restrictive networks.`})});
  const eventAction=room.makeAction('commons-event');
  const presenceAction=room.makeAction('presence');
  const snapshotAction=room.makeAction('state-snapshot',{kind:'request',onRequest:()=>getSnapshot()});
  eventAction.onMessage=(data,{peerId})=>onEvent(data,{peerId});
  presenceAction.onMessage=(data,{peerId})=>onStatus({peers:[...peers],message:`Presence: ${data?.role||'peer'} (${peerId.slice(0,6)}). Role/identity unverified.`});
  async function requestOne(peerId){try{const snap=await snapshotAction.request({want:'coordination-state'}, {target:peerId,timeoutMs:5000});await onSnapshot(snap,{peerId})}catch(err){onStatus({peers:[...peers],message:`Snapshot from ${peerId.slice(0,6)} unavailable: ${err?.message||err}`})}}
  room.onPeerJoin=async peerId=>{peers.add(peerId);onStatus({peers:[...peers],message:`Peer joined: ${peerId.slice(0,6)} (identity unverified)`});try{await presenceAction.send({role,ts:new Date().toISOString()},{target:peerId})}catch{};requestOne(peerId)};
  room.onPeerLeave=peerId=>{peers.delete(peerId);onStatus({peers:[...peers],message:`Peer left: ${peerId.slice(0,6)}`})};
  // getPeers() can include peers already connected before handlers were assigned.
  for(const peerId of room.getPeers?.()||[]){peers.add(peerId);requestOne(peerId)}
  return {
    send:data=>eventAction.send(data),
    requestSnapshots:()=>Promise.allSettled([...peers].map(requestOne)),
    disconnect:()=>room.leave(),
    getPeers:()=>[...peers],
    selfId,strategy,roomId
  };
}
