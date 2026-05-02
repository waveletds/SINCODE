/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  PlusSquare, 
  MessageCircle, 
  User, 
  Bell,
  Settings,
  ShieldCheck,
  CreditCard,
  LogOut,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { cn, formatNaira } from '@/src/lib/utils';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Feed' },
    { id: 'discover', icon: Search, label: 'Explore' },
    { id: 'create', icon: PlusSquare, label: 'Post' },
    { id: 'messages', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Me' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t-0 px-2 py-3 flex justify-around items-center md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-full md:border-r md:border-white/5">
      <div className="hidden md:flex mb-8 items-center justify-center">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 font-bold text-xl tracking-tighter">
          SC
        </div>
      </div>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium md:hidden">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const Header = () => {
  return (
    <header className="sticky top-0 z-40 glass border-b-0 border-x-0 border-t-0 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black tracking-tighter text-white">SINCODE</span>
        <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
          PRO
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-1.5 text-slate-400 hover:text-emerald-400 transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
        </button>
        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-emerald-500 to-cyan-500 overflow-hidden border-2 border-white/10 shadow-lg">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" />
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const FeedPage = () => {
  const [creators] = useState([
    { id: 1, name: 'Tems Angel', handle: 'tems_vibes', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80', active: true },
    { id: 2, name: 'Burna Fan', handle: 'odogwu_queen', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', active: false },
    { id: 3, name: 'Lagos Model', handle: 'ekofinesse', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', active: true },
  ]);

  return (
    <div className="space-y-6 pb-20">
      {/* Stories/Top Creators */}
      <section className="px-4 py-4">
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
          {creators.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={cn(
                "w-16 h-16 rounded-[1.25rem] p-0.5 border-2",
                c.active ? "border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : "border-slate-800"
              )}>
                <img src={c.image} className="w-full h-full rounded-[1.1rem] object-cover" alt={c.name} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate w-16 text-center">@{c.handle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className="px-4">
        <div className="relative h-56 glass rounded-[2rem] overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1520127871002-144c75fe4e0d?w=800&q=80" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
            alt="Feature" 
          />
          <div className="absolute inset-0 p-8 flex flex-col justify-end bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent">
            <h2 className="text-3xl font-black text-white mb-2 leading-none uppercase tracking-tighter italic">Naija's #1 Creator Economy.</h2>
            <p className="text-emerald-400/80 text-xs font-bold mb-6 tracking-widest uppercase">Fast payouts • 75% Creator Split Protected</p>
            <button className="bg-white text-slate-950 font-black py-3 px-8 rounded-2xl text-[11px] uppercase w-fit active:scale-95 transition-all shadow-xl shadow-white/5 tracking-widest">
              Join the Hub
            </button>
          </div>
        </div>
      </section>

      {/* Feed Posts */}
      <section className="space-y-8 px-4">
        {[1, 2].map((post) => (
          <div key={post} className="glass rounded-[2rem] overflow-hidden shadow-xl border-white/5">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl glass p-0.5 overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=${post}`} className="w-full h-full object-cover rounded-[0.9rem]" alt="Avatar" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight uppercase">Chioma_Lux_{post}</h3>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Verified Portfolio</p>
                </div>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                 <Settings size={20} />
              </button>
            </div>
            
            <div className="relative aspect-[4/5] bg-slate-900 flex items-center justify-center mx-1 rounded-[1.5rem] overflow-hidden mb-1">
              <img src={`https://images.unsplash.com/photo-${post === 1 ? '1583121274602-3e2820c69888' : '1503342217505-b0a15ec3261c'}?w=800&q=80`} className="w-full h-full object-cover blur-3xl opacity-30 absolute" alt="Teaser" />
              <div className="z-10 text-center px-10">
                 <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
                   <ShieldCheck size={32} />
                 </div>
                 <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Locked Content</h4>
                 <p className="text-xs text-slate-400 mb-8 font-medium">Exclusively for my top fans. Behind the scenes from Lagos Fashion Week. 🇳🇬</p>
                 <button className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 uppercase text-xs tracking-widest">
                    Unlock for {formatNaira(1500)}
                 </button>
              </div>
            </div>

            <div className="p-5 flex items-center justify-between bg-slate-900/40">
               <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-slate-300">
                     <span className="text-xs font-bold italic">❤️ 1.2k</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                     <span className="text-xs font-bold italic">💬 48</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest naira-glow">Tips: ₦45k</span>
               </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

const AuthPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
       <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-slate-950 font-black text-4xl tracking-tighter mb-8 shadow-2xl shadow-emerald-500/20 rotate-3">
          SC
       </div>
       <h1 className="text-5xl font-black mb-2 tracking-tighter text-white uppercase">SINCODE</h1>
       <p className="text-emerald-400 mb-10 max-w-xs font-bold tracking-widest text-[10px] uppercase">Monetize Your Talent, Keep More in Naija</p>
       
       <div className="w-full max-w-sm space-y-4">
          <button 
             onClick={onLogin}
             className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-5 rounded-2xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all text-lg"
          >
             Continue with Creator Hub
          </button>
          <button 
             onClick={onLogin}
             className="w-full glass text-white font-bold py-5 rounded-2xl active:scale-95 transition-all text-lg"
          >
             Fan Login
          </button>
          <div className="pt-8">
             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Secure Verification Powered by NDPR Compliance</p>
          </div>
       </div>
    </div>
  );
};

const CreatorDashboard = () => {
  return (
    <div className="p-4 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Creator Hub</h2>
        <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">Verified</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-[2rem] shadow-xl">
           <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest leading-none">Total Payouts</p>
           <p className="text-2xl font-black naira-glow text-white tracking-tighter">{formatNaira(450500)}</p>
        </div>
        <div className="glass p-6 rounded-[2rem] shadow-xl">
           <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest leading-none">Active Subs</p>
           <p className="text-2xl font-black text-white tracking-tighter">128</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Recent Activity</h3>
        {[1, 2, 3].map(i => (
           <div key={i} className="glass p-5 rounded-[1.5rem] flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                    <TrendingUp size={24} />
                 </div>
                 <div>
                    <p className="text-sm font-black text-white italic">New Subscription</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">@{['wiz_kid', 'davido_fan', 'tiwa_wa'][i-1]} • Level 1</p>
                 </div>
              </div>
              <p className="text-sm font-black text-emerald-400 naira-glow">+{formatNaira(3500)}</p>
           </div>
        ))}
      </section>

      <button className="w-full bg-emerald-500 text-slate-950 font-black py-5 rounded-[1.5rem] shadow-2xl flex items-center justify-center gap-3 uppercase text-sm tracking-widest active:scale-[0.98] transition-all">
         <PlusSquare size={24} />
         Create New Content
      </button>

      <div className="glass rounded-[2.5rem] p-8 text-white overflow-hidden relative shadow-2xl border-white/5">
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
               <h3 className="font-black text-xl italic tracking-tight uppercase">Quick Withdrawal</h3>
               <span className="text-[9px] bg-slate-800 px-2 py-1 rounded text-slate-300 font-black uppercase tracking-widest">Instant Pay</span>
            </div>
            <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-white shadow-lg">UBA</div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-white">United Bank for Africa</p>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">**** 5821 • SAVINGS</p>
                </div>
            </div>
            <button className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-100 transition-all">Send ₦45,000 to Bank</button>
         </div>
         <CreditCard size={160} className="absolute -bottom-12 -right-12 text-white/5 rotate-12 pointer-events-none" />
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  if (!isLoggedIn) {
    return <AuthPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20 md:pb-0 md:pl-20">
      <Header />
      
      <main className="max-w-xl mx-auto md:max-w-2xl lg:max-w-4xl pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FeedPage />
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CreatorDashboard />
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
             <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 space-y-10"
            >
              {/* Profile Header */}
              <div className="glass rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                 <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-emerald-500/10 to-transparent blur-3xl opacity-30"></div>
                 <div className="w-24 h-24 rounded-2xl glass p-1 shadow-2xl overflow-hidden relative z-10 mb-6 group cursor-pointer hover:scale-105 active:scale-95 transition-all">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" className="w-full h-full object-cover rounded-[1.2rem]" alt="User" />
                 </div>
                 <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Tunde Olamide</h2>
                 <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">@tunde_vibes • Established 2024</p>
                 
                 <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-slate-900/50 border border-white/5 p-5 rounded-[1.5rem]">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-2 tracking-[0.2em]">Wallet Balance</p>
                       <p className="text-xl font-black text-white naira-glow tracking-tighter">{formatNaira(12450)}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 p-5 rounded-[1.5rem]">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-2 tracking-[0.2em]">Connections</p>
                       <p className="text-xl font-black text-white tracking-tighter">24 Creators</p>
                    </div>
                 </div>
              </div>

              {/* Menu Options */}
              <div className="glass rounded-[2rem] overflow-hidden shadow-2xl">
                 {[
                   { icon: ShieldCheck, label: 'Creator Verification', sub: 'Unlock full earnings & premium features', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                   { icon: CreditCard, label: 'Wallet & Payouts', sub: 'Instant Naira withdrawals to local banks', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                   { icon: Bell, label: 'In-app Notifications', sub: 'New tips, subs, and creator alerts', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                   { icon: Settings, label: 'Advanced Settings', sub: 'Privacy mode, NDPR controls, security', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                 ].map((item, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                       <div className="flex items-center gap-5 text-left">
                          <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", item.bg, item.color)}>
                             <item.icon size={22} />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-white uppercase tracking-tight italic">{item.label}</h4>
                             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">{item.sub}</p>
                          </div>
                       </div>
                       <ChevronRight size={18} className="text-slate-700 group-hover:text-emerald-400 transition-colors" />
                    </button>
                 ))}
              </div>

              <button className="w-full glass text-slate-400 font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 active:bg-red-500/10 active:text-red-400 transition-all uppercase tracking-widest text-xs mb-10">
                 <LogOut size={20} />
                 Sign Out from SINCODE
              </button>
            </motion.div>
          )}

          {/* Fallback for other tabs */}
          {['discover', 'messages'].includes(activeTab) && (
            <div className="h-[70vh] flex flex-col items-center justify-center p-8 text-center">
               <div className="w-24 h-24 glass rounded-[2rem] flex items-center justify-center mb-8 text-emerald-500 shadow-2xl animate-pulse">
                  <TrendingUp size={48} />
               </div>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Syncing Hub...</h3>
               <p className="text-slate-500 max-w-[15rem] mx-auto text-xs font-bold uppercase tracking-widest leading-relaxed">We're finalizing the {activeTab.toUpperCase()} infrastructure for the next wave of Nigerian talent.</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
