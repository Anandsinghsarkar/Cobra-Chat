import {NextResponse} from 'next/server';
import {requireUser} from '@/lib/server-auth';
import {firebaseAdmin} from '@/lib/firebase-admin';

function collectReceipts(chats,uid,action,onlyChatId){
  const now=Date.now();
  const updates={};
  let changed=0;
  for(const [chatId,chat] of Object.entries(chats||{})){
    if(onlyChatId&&chatId!==onlyChatId)continue;
    if(!chat?.members?.[uid])continue;
    for(const [messageId,message] of Object.entries(chat.messages||{})){
      if(message?.senderId===uid||message?.unsent)continue;
      const base=`privateChats/${chatId}/messages/${messageId}`;
      if(!message?.deliveredAt){updates[base+'/deliveredAt']=now;changed++}
      if(action==='seen'&&!message?.seenAt){updates[base+'/seenAt']=now;changed++}
      if(changed>=1200)return {updates,changed};
    }
  }
  return {updates,changed};
}

export async function POST(req){
  try{
    const decoded=await requireUser(req);
    const body=await req.json().catch(()=>({}));
    const action=body.action==='seen'?'seen':'delivered';
    const chatId=typeof body.chatId==='string'?body.chatId.slice(0,200):'';
    const {db}=firebaseAdmin();

    if(action==='seen'){
      if(!chatId)return NextResponse.json({error:'chatId required'},{status:400});
      const snap=await db.ref('privateChats/'+chatId).once('value');
      const chat=snap.val();
      if(!chat?.members?.[decoded.uid])return NextResponse.json({error:'Not a chat member'},{status:403});
      const {updates,changed}=collectReceipts({[chatId]:chat},decoded.uid,'seen',chatId);
      if(changed)await db.ref().update(updates);
      return NextResponse.json({ok:true,changed});
    }

    const snap=await db.ref('privateChats').once('value');
    const {updates,changed}=collectReceipts(snap.val()||{},decoded.uid,'delivered','');
    if(changed)await db.ref().update(updates);
    return NextResponse.json({ok:true,changed});
  }catch(e){
    return NextResponse.json({error:e.message},{status:e.message==='AUTH_REQUIRED'?401:400});
  }
}
