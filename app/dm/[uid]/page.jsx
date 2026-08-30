'use client';
import {useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {onAuthStateChanged} from 'firebase/auth';
import {onValue,push,ref,set,query,limitToLast,update,remove,serverTimestamp} from 'firebase/database';
import {firebaseClient} from '@/lib/firebase-client';
import AppNav from '@/components/AppNav';
import AuthGate from '@/components/AuthGate';

export default function DM({params}){
  const router=useRouter();
  const [me,setMe]=useState(null),[them,setThem]=useState(null),[ms,setMs]=useState([]),[text,setText]=useState(''),[deletedAt,setDeletedAt]=useState(0);
  const id=useMemo(()=>me?[me.uid,params.uid].sort().join('_'):null,[me,params.uid]);

  useEffect(()=>{
    const db=firebaseClient().db;
    const stopProfile=onValue(ref(db,'users/'+params.uid),s=>setThem(s.val()));
    const stopAuth=onAuthStateChanged(firebaseClient().auth,setMe);
    return()=>{stopProfile();stopAuth()};
  },[params.uid]);

  useEffect(()=>{
    if(!id||!me)return;
    const db=firebaseClient().db;
    const o1=onValue(ref(db,'users/'+me.uid+'/deletedChats/'+id),s=>setDeletedAt(Number(s.val()||0)));
    const o2=onValue(query(ref(db,'privateChats/'+id+'/messages'),limitToLast(300)),s=>{
      const v=s.val()||{};
      setMs(Object.entries(v).map(([k,x])=>({id:k,...x})).sort((a,b)=>a.createdAt-b.createdAt));
    });
    return()=>{o1();o2()};
  },[id,me]);

  async function receipt(action){
    if(!me||!id)return;
    try{
      const token=await me.getIdToken();
      await fetch('/api/messages/receipt',{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
        body:JSON.stringify({action,chatId:id})
      });
    }catch{}
  }

  useEffect(()=>{
    if(!me||!id||document.visibilityState!=='visible')return;
    const unseen=ms.some(x=>x.senderId!==me.uid&&!x.unsent&&!x.seenAt);
    if(unseen)receipt('seen');
  },[ms,me?.uid,id]);

  useEffect(()=>{
    const visible=()=>{
      if(document.visibilityState==='visible')receipt('seen');
    };
    document.addEventListener('visibilitychange',visible);
    window.addEventListener('focus',visible);
    return()=>{
      document.removeEventListener('visibilitychange',visible);
      window.removeEventListener('focus',visible);
    };
  },[me?.uid,id]);

  async function send(e){
    e.preventDefault();
    if(!text.trim()||!id||!me)return;
    const db=firebaseClient().db;
    await set(ref(db,'privateChats/'+id+'/members'),{[me.uid]:true,[params.uid]:true});
    const x=push(ref(db,'privateChats/'+id+'/messages'));
    const now=Date.now();
    const message={senderId:me.uid,text:text.trim().slice(0,2000),createdAt:now};
    if(them?.presence?.online)message.deliveredAt=now;
    await set(x,message);
    setText('');
  }

  async function edit(x){
    const v=prompt('Edit message',x.text||'');
    if(v===null||!v.trim())return;
    await update(ref(firebaseClient().db,'privateChats/'+id+'/messages/'+x.id),{text:v.trim().slice(0,2000),editedAt:Date.now(),unsent:false});
  }
  async function unsend(x){
    if(confirm('Unsend for everyone?'))await update(ref(firebaseClient().db,'privateChats/'+id+'/messages/'+x.id),{text:'',unsent:true,editedAt:Date.now()});
  }
  async function del(x){
    if(confirm('Delete this message permanently?'))await remove(ref(firebaseClient().db,'privateChats/'+id+'/messages/'+x.id));
  }
  async function deleteChat(){
    if(!confirm('Delete this chat from your account? Old messages will be hidden for you.'))return;
    await set(ref(firebaseClient().db,'users/'+me.uid+'/deletedChats/'+id),serverTimestamp());
    setMs([]);router.push('/people');
  }

  const shown=ms.filter(x=>Number(x.createdAt||0)>deletedAt);
  const online=!!them?.presence?.online;
  const last=Number(them?.presence?.lastSeen||0);

  function receiptView(x){
    if(x.seenAt)return <div className="receiptrow"><span className="ticks seen">✓✓</span><span className="seenlabel">Seen {new Date(x.seenAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div>;
    if(x.deliveredAt)return <div className="receiptrow"><span className="ticks delivered">✓✓</span><span>Delivered</span></div>;
    return <div className="receiptrow"><span className="ticks sent">✓</span><span>Sent</span></div>;
  }

  return <AuthGate><AppNav/><main className="container">
    <div className="chatheader">
      <Link href={'/profile/'+params.uid} className="row">
        <div className="avatarwrap"><img className="avatar" src={them?.photoURL||'/avatar.svg'}/><i className={online?'online-dot':'offline-dot'}/></div>
        <div><h2 style={{margin:0}}>{them?.name||'Private Chat'}</h2><div className="presence">{online?<b className="online-text">● Online</b>:<>Last seen {last?new Date(last).toLocaleString():'unknown'}</>}</div></div>
      </Link>
      <button className="btn danger smallbtn" onClick={deleteChat}>Delete Chat</button>
    </div>

    <div className="messages" style={{marginTop:12}}>{shown.map(x=>{
      const own=x.senderId===me?.uid;
      return <div className={'msg '+(own?'mine':'')} key={x.id}><div className="msgbody">
        <div className="muted">{own?'You':them?.name} • {new Date(x.createdAt).toLocaleString()}</div>
        <div className={x.unsent?'unsent':'msgtext'}>{x.unsent?'Message unsent':x.text} {x.editedAt&&!x.unsent?<small className="muted">(edited)</small>:null}</div>
        {own&&!x.unsent?receiptView(x):null}
        {own&&!x.unsent?<div className="msgactions"><button onClick={()=>edit(x)}>Edit</button><button onClick={()=>unsend(x)}>Unsend</button><button onClick={()=>del(x)}>Delete</button></div>:null}
      </div></div>
    })}</div>

    <form className="chatbox" onSubmit={send}><input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Private message…"/><button className="btn">Send</button></form>
  </main></AuthGate>;
}
