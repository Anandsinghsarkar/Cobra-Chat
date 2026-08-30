'use client';

import {useEffect} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {onDisconnect,onValue,ref,set,serverTimestamp} from 'firebase/database';
import {firebaseClient} from '@/lib/firebase-client';

export default function PresenceManager(){
  useEffect(()=>{
    const {auth,db}=firebaseClient();
    let stopConnected=()=>{};
    let activePresenceRef=null;

    const stopAuth=onAuthStateChanged(auth,user=>{
      stopConnected();
      stopConnected=()=>{};
      activePresenceRef=null;
      if(!user)return;

      const presenceRef=ref(db,`users/${user.uid}/presence`);
      activePresenceRef=presenceRef;
      const connectedRef=ref(db,'.info/connected');

      stopConnected=onValue(connectedRef,async snap=>{
        if(snap.val()!==true)return;
        try{
          const disconnect=onDisconnect(presenceRef);
          await disconnect.set({online:false,lastSeen:serverTimestamp()});
          await set(presenceRef,{online:true,lastSeen:serverTimestamp()});
        }catch(err){
          console.error('Presence update failed:',err);
        }
      });
    });

    return()=>{
      stopAuth();
      stopConnected();
      if(activePresenceRef){
        set(activePresenceRef,{online:false,lastSeen:serverTimestamp()}).catch(()=>{});
      }
    };
  },[]);
  return null;
}
