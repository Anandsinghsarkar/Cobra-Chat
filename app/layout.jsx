import './globals.css';
import PresenceManager from '@/components/PresenceManager';

export const metadata={title:'COBRA Social',description:'Social chat with levels, ranks, premium and admin'};

export default function RootLayout({children}){
  return <html lang="en"><body><PresenceManager/>{children}</body></html>
}
