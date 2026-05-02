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
import { initializePayment } from '@/src/lib/monnify';

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t-0 px-2 py-3 flex justify-around items-center md:top-0 md:bottom-auto md:flex-col md:w-24 md:h-full md:border-r md:border-white/5 bg-navy-950/80">
      <div className="hidden md:flex mb-12 items-center justify-center">
        <div className="group w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center text-blue-500 font-display font-black text-2xl tracking-tighter shadow-2xl border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer">
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
              "flex flex-col items-center gap-1.5 transition-all duration-300",
              isActive ? "text-blue-400 scale-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-widest md:hidden">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const Header = () => {
  return (
    <header className="sticky top-0 z-40 glass border-b-0 border-x-0 border-t-0 px-6 py-5 flex items-center justify-between bg-black/40">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-display font-black tracking-tighter text-white italic">SINCODE</span>
        <div className="bg-blue-600/10 text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.2em] border border-blue-500/20">
          ELITE
        </div>
      </div>
      <div className="flex items-center gap-5">
        <button className="relative p-2 text-slate-400 hover:text-blue-400 transition-colors">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black"></span>
        </button>
        <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-navy-800 overflow-hidden border border-white/10 shadow-xl p-0.5">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" className="w-full h-full rounded-[0.8rem]" alt="User" />
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

  const handlePayment = (amount: number, description: string) => {
    initializePayment({
      amount,
      customerName: "Test Fan",
      customerEmail: "fan@sincode.ng",
      paymentReference: `SC-${Date.now()}`,
      paymentDescription: description,
      onComplete: (res) => {
        alert(`Payment successful! Reference: ${res.transactionReference}`);
      },
      onClose: () => {
        console.log("Payment window closed");
      }
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Stories/Top Creators */}
      <section className="px-6 py-6 overflow-hidden">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 pl-1">Elite Subscriptions</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {creators.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-2.5 shrink-0 group cursor-pointer">
              <div className={cn(
                "w-20 h-20 rounded-3xl p-0.5 border-2 transition-all duration-300 group-hover:scale-105",
                c.active ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]" : "border-navy-800"
              )}>
                <img src={c.image} className="w-full h-full rounded-[1.4rem] object-cover" alt={c.name} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate w-20 text-center group-hover:text-blue-400">@{c.handle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className="px-6">
        <div className="relative h-64 premium-card overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1520127871002-144c75fe4e0d?w=800&q=80" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay scale-110" 
            alt="Feature" 
          />
          <div className="absolute inset-0 p-10 flex flex-col justify-end bg-linear-to-t from-black via-navy-900/40 to-transparent">
            <h2 className="text-4xl font-display font-black text-white mb-3 leading-[0.9] uppercase tracking-tighter italic">Lagos Hub:<br/>Now Streaming.</h2>
            <p className="text-blue-400/80 text-xs font-black mb-8 tracking-[0.2em] uppercase">142 Creators currently live • 0% Deposit Fee</p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-[11px] uppercase w-fit active:scale-95 transition-all shadow-2xl shadow-blue-600/20 tracking-[0.2em]">
              Enter the Hub
            </button>
          </div>
        </div>
      </section>

      {/* Feed Posts */}
      <section className="space-y-12 px-6">
        {[1, 2].map((post) => (
          <div key={post} className="glass rounded-[3rem] overflow-hidden border-white/5 group">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl glass p-0.5 overflow-hidden border-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                   <img src={`https://i.pravatar.cc/150?u=${post}`} className="w-full h-full object-cover rounded-[0.9rem]" alt="Avatar" />
                </div>
                <div>
                  <h3 className="text-base font-display font-black text-white tracking-tight uppercase italic underline decoration-blue-500/30 underline-offset-4">Influencer_NG_{post}</h3>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mt-1">Platinum Verified</p>
                </div>
              </div>
              <button className="p-2 glass rounded-xl text-slate-500 hover:text-white transition-all active:scale-90">
                 <Settings size={22} />
              </button>
            </div>
            
            <div className="relative aspect-[4/5] bg-navy-950 flex items-center justify-center mx-1 rounded-[2.5rem] overflow-hidden mb-1">
              <img src={`https://images.unsplash.com/photo-${post === 1 ? '1583121274602-3e2820c69888' : '1503342217505-b0a15ec3261c'}?w=800&q=80`} className="w-full h-full object-cover blur-3xl opacity-20 absolute scale-125" alt="Teaser" />
              <div className="z-10 text-center px-12">
                 <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                   <ShieldCheck size={40} />
                 </div>
                 <h4 className="text-2xl font-display font-black text-white mb-3 uppercase tracking-tight italic">Elite Access</h4>
                 <p className="text-xs text-slate-400 mb-10 font-medium leading-relaxed max-w-xs mx-auto">This catalog is restricted to members. Exclusive BTS from Lagos Fashion Week 2024.</p>
                 <button 
                  onClick={() => handlePayment(1500, `Unlock post by Creator_${post}`)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-2xl shadow-blue-600/30 uppercase text-xs tracking-widest"
                 >
                    Get Access for {formatNaira(1500)}
                 </button>
              </div>
            </div>

            <div className="p-6 flex items-center justify-between bg-black/40 border-t border-white/5">
               <div className="flex gap-8">
                  <div className="flex items-center gap-2 text-slate-300">
                     <span className="text-[13px] font-black italic tracking-tighter">❤️ 1.2k</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                     <span className="text-[13px] font-black italic tracking-tighter">💬 48</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest naira-glow">TIPS: ₦45k</span>
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full"></div>
       <div className="absolute bottom-0 -right-20 w-96 h-96 bg-navy-800/20 blur-[120px] pointer-events-none rounded-full"></div>

       <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white font-display font-black text-5xl tracking-tighter mb-10 shadow-2xl shadow-blue-500/20 rotate-6 border-4 border-white/10 group hover:rotate-0 transition-transform cursor-pointer">
          SC
       </div>
       <h1 className="text-6xl font-display font-black mb-3 tracking-tighter text-white uppercase italic scale-y-110">SINCODE</h1>
       <p className="text-blue-400/80 mb-14 max-w-xs font-black tracking-[0.3em] text-[10px] uppercase">Monetize Your Talent, Keep More in Naija</p>
       
       <div className="w-full max-w-sm space-y-5 relative z-10">
          <button 
             onClick={onLogin}
             className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl shadow-2xl shadow-blue-600/10 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
             Creator Login
          </button>
          <button 
             onClick={onLogin}
             className="w-full glass text-white/90 font-black py-6 rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest border-white/5 hover:bg-white/5"
          >
             Fan Entrance
          </button>
          <div className="pt-12">
             <div className="flex items-center gap-4 justify-center opacity-40">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">75% Creator Split Protected • Secure via NDPR</p>
             </div>
          </div>
       </div>
    </div>
  );
};

const CreatorDashboard = () => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch("/api/monnify/banks");
        const data = await res.json();
        if (data.requestSuccessful) {
          setBanks(data.responseBody);
        }
      } catch (e) {
        console.error("Failed to load banks");
      }
    };
    fetchBanks();
  }, []);

  const handleWithdrawal = async () => {
    setIsWithdrawing(true);
    try {
      const response = await fetch("/api/monnify/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 45000,
          destinationBankCode: "058", // GTB for demo
          destinationAccountNumber: "0123456789",
          narration: "SINCODE Creator Payout",
        }),
      });
      const data = await response.json();
      if (data.requestSuccessful) {
        alert("Withdrawal successful! Funds are on the way.");
      } else {
        alert(`Withdrawal failed: ${data.responseMessage || "Unknown error"}`);
      }
    } catch (error) {
      alert("Network error occurred during withdrawal.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="p-6 space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-display font-black uppercase tracking-tighter italic">Creator Hub</h2>
        <div className="bg-blue-600/10 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-blue-500/20">Elite Verified</div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="premium-card !p-6 shadow-[0_0_40px_rgba(59,130,246,0.05)]">
           <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-[0.2em] leading-none">Total Payouts</p>
           <p className="text-2xl font-black text-white tracking-tighter naira-glow">{formatNaira(450500)}</p>
        </div>
        <div className="premium-card !p-6 shadow-[0_0_40px_rgba(59,130,246,0.05)]">
           <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-[0.2em] leading-none">Elite Subs</p>
           <p className="text-2xl font-black text-white tracking-tighter">128</p>
        </div>
      </div>

      <section className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] pl-1">Recent Activity</h3>
        {[1, 2, 3].map(i => (
           <div key={i} className="glass p-6 rounded-[2rem] flex items-center justify-between hover:bg-navy-800 transition-all cursor-pointer group border-white/5">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <TrendingUp size={28} />
                 </div>
                 <div>
                    <p className="text-base font-display font-black text-white italic tracking-tight">New Subscription</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">@{['wiz_kid', 'davido_fan', 'tiwa_wa'][i-1]} • Level 1</p>
                 </div>
              </div>
              <p className="text-md font-black text-blue-400 naira-glow">+{formatNaira(3500)}</p>
           </div>
        ))}
      </section>

      <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-4 uppercase text-xs tracking-[0.3em] active:scale-[0.98] transition-all">
         <PlusSquare size={28} />
         Drop New Content
      </button>

      <div className="premium-card !p-10 relative overflow-hidden group shadow-blue-600/5">
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-black text-2xl italic tracking-tighter uppercase text-white scale-y-110">Withdrawal</h3>
               <span className="text-[9px] glass px-3 py-1.5 rounded-lg text-blue-400 font-black uppercase tracking-[0.25em] border-blue-500/20">Instant Pay</span>
            </div>
            
            <div className="bg-black/60 p-6 rounded-[1.5rem] border border-white/5 mb-10 flex items-center gap-5 group-hover:bg-black transition-colors">
                <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center font-black italic text-white shadow-xl">UBA</div>
                <div className="flex-1">
                    <p className="text-md font-bold text-white tracking-tight uppercase italic">United Bank for Africa</p>
                    <p className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase mt-1">**** 5821 • ELITE SAVINGS</p>
                </div>
            </div>

            <button 
              onClick={handleWithdrawal}
              disabled={isWithdrawing}
              className="w-full bg-white hover:bg-blue-50 text-slate-950 font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all disabled:opacity-50 active:scale-95"
            >
              {isWithdrawing ? "SYNCING FUNDS..." : "Send ₦45,000 to Bank"}
            </button>
         </div>
         <CreditCard size={180} className="absolute -bottom-16 -right-16 text-white/5 rotate-12 pointer-events-none group-hover:text-blue-500/10 transition-colors duration-700" />
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
    <div className="min-h-screen bg-black font-sans text-slate-200 pb-20 md:pb-0 md:pl-24">
      <Header />
      
      <main className="max-w-2xl mx-auto md:max-w-3xl lg:max-w-5xl pt-4">
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
              <div className="premium-card !p-10 flex flex-col items-center text-center relative overflow-hidden group">
                 <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-blue-600/10 to-transparent blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                 <div className="w-28 h-28 rounded-3xl glass p-1 shadow-2xl overflow-hidden relative z-10 mb-8 transition-transform group-hover:scale-[1.02]">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" className="w-full h-full object-cover rounded-[1.4rem]" alt="User" />
                 </div>
                 <h2 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter">Tunde Olamide</h2>
                 <p className="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] mb-10">@tunde_vibes • Established 2024</p>
                 
                 <div className="grid grid-cols-2 gap-6 w-full">
                    <div className="bg-black/60 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md">
                       <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-[0.3em]">Wallet</p>
                       <p className="text-2xl font-black text-white naira-glow tracking-tighter">{formatNaira(12450)}</p>
                    </div>
                    <div className="bg-black/60 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md">
                       <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-[0.3em]">Network</p>
                       <p className="text-2xl font-black text-white tracking-tighter">24 Creators</p>
                    </div>
                 </div>
              </div>

              {/* Menu Options */}
              <div className="glass rounded-[2.5rem] overflow-hidden shadow-2xl border-white/5">
                 {[
                   { icon: ShieldCheck, label: 'Elite Verification', sub: 'Unlock worldwide earnings & private perks', color: 'text-blue-400', bg: 'bg-blue-600/10' },
                   { icon: CreditCard, label: 'Wallet & Payouts', sub: 'Instant Naira withdrawals to local banks', color: 'text-blue-400', bg: 'bg-blue-600/10' },
                   { icon: Bell, label: 'Elite Alerts', sub: 'New tips, subs, and creator syncs', color: 'text-blue-400', bg: 'bg-blue-600/10' },
                   { icon: Settings, label: 'Advanced Controls', sub: 'Privacy mode, NDPR vaults, security', color: 'text-blue-400', bg: 'bg-blue-600/10' },
                 ].map((item, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                       <div className="flex items-center gap-6 text-left">
                          <div className={cn("p-4 rounded-[1.2rem] transition-all group-hover:scale-110 shadow-xl", item.bg, item.color)}>
                             <item.icon size={26} />
                          </div>
                          <div>
                             <h4 className="text-base font-display font-black text-white uppercase tracking-tight italic">{item.label}</h4>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1.5">{item.sub}</p>
                          </div>
                       </div>
                       <ChevronRight size={20} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                    </button>
                 ))}
              </div>

              <button className="w-full glass text-slate-500 hover:text-red-400 font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 active:bg-red-500/10 transition-all uppercase tracking-[0.4em] text-[10px] mb-10 border-white/5">
                 <LogOut size={22} />
                 Disconnect Sessions
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
