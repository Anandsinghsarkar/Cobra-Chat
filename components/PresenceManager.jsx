'use client';

import {useEffect} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {onDisconnect,onValue,ref,set,serverTimestamp} from 'firebase/database';
import {firebaseClient} from '@/lib/firebase-client';

export default function PresenceManager(){
  useEffect(()=>{
    const {auth,db}=firebaseClient();
    let stopConnected=()=>{};
    let presenceRef=null;
    let currentUser=null;

    async function markDelivered(user){
      try{
        const token=await user.getIdToken();
        await fetch('/api/messages/receipt',{
          method:'POST',
          headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
          body:JSON.stringify({action:'delivered'})
        });
      }catch{}
    }

    async function setOnline(user){
      if(!presenceRef)return;
      try{
        await set(presenceRef,{online:true,lastSeen:serverTimestamp()});
        await markDelivered(user);
      }catch(err){
        console.error('Presence update failed:',err);
      }
    }

    function setOffline(){
      if(!presenceRef)return;
      set(presenceRef,{online:false,lastSeen:serverTimestamp()}).catch(()=>{});
    }

    const stopAuth=onAuthStateChanged(auth,user=>{
      currentUser=user;
      stopConnected();
      stopConnected=()=>{};
      presenceRef=null;
      if(!user)return;

      presenceRef=ref(db,`users/${user.uid}/presence`);
      const connectedRef=ref(db,'.info/connected');

      stopConnected=onValue(connectedRef,async snap=>{
        if(snap.val()!==true)return;
        try{
          await onDisconnect(presenceRef).set({online:false,lastSeen:serverTimestamp()});
          await setOnline(user);
        }catch(err){
          console.error('Presence connection failed:',err);
        }
      });
    });

    const onVisibility=()=>{
      if(document.visibilityState==='visible'&&currentUser)setOnline(currentUser);
    };
    const onPageHide=()=>setOffline();

    document.addEventListener('visibilitychange',onVisibility);
    window.addEventListener('pagehide',onPageHide);

    return()=>{
      stopAuth();
      stopConnected();
      document.removeEventListener('visibilitychange',onVisibility);
      window.removeEventListener('pagehide',onPageHide);
    };
  },[]);
  return null;
}
