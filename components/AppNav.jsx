'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {onAuthStateChanged,signOut} from 'firebase/auth';
import {onDisconnect,ref,set,serverTimestamp} from 'firebase/database';
import {Globe2,Users,Crown,Settings,LogOut} from 'lucide-react';
import {firebaseClient} from '@/lib/firebase-client';
import PresenceManager from '@/components/PresenceManager';

export default function AppNav(){
  const path=usePathname();
  const [me,setMe]=useState(null);

  useEffect(()=>{
    const {auth,db}=firebaseClient();
    return onAuthStateChanged(auth,u=>{
      setMe(u);
      if(!u){
        document.documentElement.dataset.theme='neon';
        return;
      }
      const profileRef=ref(db,`users/${u.uid}`);
      import('firebase/database').then(({onValue})=>onValue(profileRef,s=>{
        const p=s.val()||{};
        document.documentElement.dataset.theme=p.theme||'neon';
      }));
    });
  },[]);

  async function logout(){
    const {auth,db}=firebaseClient();
    const user=auth.currentUser;
    if(user){
      const presenceRef=ref(db,`users/${user.uid}/presence`);
      try{
        await set(presenceRef,{online:false,lastSeen:serverTimestamp()});
        await onDisconnect(presenceRef).cancel();
      }catch{}
    }
    await signOut(auth);
    window.location.href='/login';
  }

  const items=[
    ['/world','World',Globe2],
    ['/people','People',Users],
    ['/premium','Premium',Crown],
    ['/settings','Settings',Settings]
  ];

  return <>
    <PresenceManager/>
    <header className="topnav">
      <div className="navin">
        <Link href="/app" className="brand">COBRA<span>•</span>SOCIAL</Link>
        <span className="muted">{me?.email||''}</span>
      </div>
    </header>
    <nav className="bottomnav">
      {items.map(([href,label,Icon])=><Link key={href} className={path===href?'active':''} href={href}><Icon size={22}/><span>{label}</span></Link>)}
      <button onClick={logout}><LogOut size={22}/><span>Logout</span></button>
    </nav>
  </>;
}
