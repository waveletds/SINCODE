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
  Award,
  Heart,
  Eye,
  Play,
  EyeOff,
  HelpCircle,
  MoreHorizontal,
  Users,
  Image as ImageIcon,
  List,
  Bookmark,
  UserPlus,
  LifeBuoy,
  FileText,
  Shield,
  UserCircle
} from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { cn, formatNaira } from '@/src/lib/utils';
import { initializePayment } from '@/src/lib/monnify';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Search, label: 'Search' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', icon: Bell, label: 'Alerts' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-2 py-3 flex justify-around items-center md:top-0 md:bottom-auto md:flex-col md:w-24 md:h-full md:border-r md:border-slate-100">
      <div className="hidden md:flex mb-12 items-center justify-center">
        <Heart size={32} className="text-blue-500 fill-blue-500" />
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
              isActive ? "text-blue-500 scale-110" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
    </nav>
  );
};

const Header = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="relative active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full border border-slate-200 p-0.5">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" className="w-full h-full rounded-full bg-slate-100" alt="User" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </button>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
         <Heart size={28} className="text-blue-500 fill-blue-500" strokeWidth={1.5} />
      </div>

      <div className="flex items-center gap-3">
        <button className="text-slate-400 p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
          <HelpCircle size={18} />
        </button>
        <div className="bg-slate-100 border border-slate-200 py-1.5 px-4 rounded-xl flex items-center gap-2 shadow-sm">
           <span className="text-[11px] font-black text-slate-600 tracking-tighter">$0</span>
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const FeedPage = () => {
  const [creators] = useState([
    { id: 1, name: 'TheLittleJui...', handle: 'thelittlejui...', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', active: true },
    { id: 2, name: 'Lagos Model', handle: 'ekofinesse', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', active: true },
    { id: 3, name: 'Studio Vibes', handle: 'studiovibes', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', active: false },
  ]);

  const handlePayment = (amount: number, description: string) => {
    initializePayment({
      amount,
      customerName: "Test Fan",
      customerEmail: "fan@sincode.ng",
      paymentReference: `SC-${Date.now()}`,
      paymentDescription: description,
      onComplete: (res: any) => {
        alert(`Payment successful! Reference: ${res.transactionReference}`);
      },
      onClose: () => {
        console.log("Payment window closed");
      }
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Pills Navigation */}
      <div className="px-4 pt-4 flex items-center justify-between overflow-hidden">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
           {['All', 'Subscribed', 'For You'].map((tab, i) => (
              <button 
                key={tab} 
                className={cn(
                  "px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all border",
                  i === 0 
                    ? "bg-blue-50 text-blue-600 border-blue-100" 
                    : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                )}
              >
                {tab}
              </button>
           ))}
           <button className="p-2 aspect-square rounded-full bg-slate-50 border border-slate-100 text-blue-500">
              <TrendingUp size={18} />
           </button>
           <button className="p-2 aspect-square rounded-full bg-slate-50 border border-slate-100 text-blue-500">
              <PlusSquare size={18} />
           </button>
        </div>
      </div>

      {/* Title Section */}
      <div className="px-6 mt-6 flex items-center justify-between">
         <h3 className="text-base font-bold text-slate-800">Made For You</h3>
         <button className="text-slate-900"><MoreHorizontal size={20} /></button>
      </div>

      {/* Stories Carousel */}
      <section className="px-4 mt-4">
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {creators.map((c) => (
            <div key={c.id} className="relative aspect-[2/3] w-32 rounded-2xl overflow-hidden shadow-sm shrink-0 group border border-slate-100">
              <img 
                src={c.image} 
                className={cn("w-full h-full object-cover", !c.active && "blur-2xl")} 
                alt={c.name} 
              />
              <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent h-1/2">
                 <p className="text-[10px] font-bold text-white leading-tight">{c.name}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 {c.active ? (
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white pl-0.5">
                       <Play size={18} fill="currentColor" />
                    </div>
                 ) : (
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                       <EyeOff size={18} />
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feed Filter Icon */}
      <div className="px-6 py-2 border-t border-slate-50 flex items-center justify-end">
         <Settings size={18} className="text-slate-400" />
      </div>

      {/* Feed Posts */}
      <section className="space-y-0">
        {[1].map((post) => (
          <div key={post} className="bg-white border-b border-slate-100 py-6 space-y-4">
            {/* Post Header */}
            <div className="px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=juice" className="w-full h-full object-cover bg-pink-100" alt="Avatar" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">TheLittleJui...</h3>
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                       <ShieldCheck size={10} className="text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">@Thelittlejui... • 6h</p>
                </div>
              </div>
              <button className="text-slate-400 p-2">
                 <MoreHorizontal size={20} />
              </button>
            </div>
            
            {/* Post Content */}
            <div className="px-4 space-y-4">
               <p className="text-sm text-slate-700 leading-relaxed">
                 Squirted again... This time it shot so far My pussy kept twitching and gushing nonstop, I couldn't stop cumming at all~ 💖💕🐳🐳🐳 #squirting #squirter #bigsquirt #pussysquirt #femalesquirt
               </p>
               
               <div className="relative aspect-video rounded-xl overflow-hidden group bg-slate-200">
                 <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" className="w-full h-full object-cover blur-3xl opacity-60 absolute scale-125" alt="Teaser" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-3">
                       <EyeOff size={28} />
                    </div>
                 </div>
               </div>
            </div>

            {/* Post Bottom Bar */}
            <div className="px-4 pt-2 flex items-center justify-between">
               <div className="flex items-center gap-6 text-slate-400">
                  <div className="flex items-center gap-1.5 p-1">
                     <Home size={22} className="text-blue-500" />
                  </div>
                  <div className="flex items-center gap-1.5 p-1">
                     <Search size={22} />
                  </div>
                  <div className="flex items-center gap-1.5 p-1">
                     <MessageCircle size={22} />
                  </div>
                  <div className="flex items-center gap-1.5 p-1">
                     <Bell size={22} />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

const AuthPage = ({ onLogin }: { onLogin: () => void }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [gender, setGender] = useState('');
  
  const teasers = [
    { id: 1, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', active: true, title: 'BTS: Lagos Fashion Week' },
    { id: 2, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', active: false, title: 'Private Studio Session' },
    { id: 3, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', active: true, title: 'Exclusive Interview' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
       {/* Top Section: Branding & Logo */}
       <div className={cn(
         "bg-navy-900 px-8 relative overflow-hidden flex flex-col items-center transition-all duration-500",
         isSigningUp ? "pt-8 pb-8" : "pt-12 pb-16"
       )}>
          <div className="absolute top-0 inset-x-0 h-full bg-linear-to-b from-blue-600/5 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="relative mb-6">
                <Heart size={isSigningUp ? 60 : 80} className="text-white fill-white transition-all" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
                      <Eye size={18} className="text-blue-400" strokeWidth={3} />
                   </div>
                </div>
             </div>
             <h1 className="text-5xl font-display font-black text-white tracking-tight uppercase italic mb-2">SINCODE</h1>
             <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Elite Nigerian Creator Hub</p>
          </div>

          {/* Featured Teasers Grid - Hide or shrink when signing up */}
          {!isSigningUp && (
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg mt-12 relative z-20">
               {teasers.map((t, i) => (
                  <div key={t.id} className={cn(
                     "relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group",
                     i === 1 ? "scale-105 z-10 -rotate-1" : "rotate-1 opacity-80"
                  )}>
                     <img src={t.image} className={cn("w-full h-full object-cover", !t.active && "blur-xl")} alt="Teaser" />
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        {t.active ? (
                           <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-white pl-1">
                              <Play size={20} fill="currentColor" />
                           </div>
                        ) : (
                           <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-white">
                              <EyeOff size={20} />
                           </div>
                        )}
                     </div>
                     {t.active && (
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 glass px-2 py-0.5 rounded-full scale-75 origin-top-left">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                           <span className="text-[9px] font-black uppercase text-white">Live</span>
                        </div>
                     )}
                  </div>
               ))}
            </div>
          )}
       </div>

       {/* Bottom Section: Actions */}
       <div className={cn(
         "flex-1 bg-black p-8 flex flex-col items-center rounded-t-[3rem] -mt-10 relative z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.8)] border-t border-white/5 overflow-y-auto scrollbar-hide",
         isSigningUp ? "justify-start" : "justify-center"
       )}>
          <div className="w-full max-w-sm space-y-4">
             {isSigningUp ? (
                <div className="space-y-4 py-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                      <input type="text" placeholder="e.g. Tunde Olamide" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Username</label>
                      <input type="text" placeholder="@tunde_vibes" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                      <input type="email" placeholder="tunde@example.com" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                      <div className="flex gap-2">
                        <div className="bg-navy-900 border border-white/5 rounded-xl px-4 py-4 text-slate-500 text-sm font-bold">+234</div>
                        <input type="tel" placeholder="801 234 5678" className="flex-1 bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Birth Date</label>
                         <input type="date" className="w-full bg-navy-900 border border-white/5 rounded-xl px-4 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 transition-colors [color-scheme:dark]" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                         <select 
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full bg-navy-900 border border-white/5 rounded-xl px-4 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 appearance-none transition-colors"
                         >
                            <option value="" disabled>Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="gay">Gay</option>
                            <option value="lesbian">Lesbian</option>
                            <option value="bisexual">Bisexual</option>
                            <option value="lgbtq">LGBTQ+</option>
                         </select>
                      </div>
                   </div>
                   
                   <button 
                      onClick={onLogin}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest mt-4"
                   >
                      Create Elite Account
                   </button>
                   
                   <button 
                      onClick={() => setIsSigningUp(false)}
                      className="w-full text-slate-500 font-black py-2 text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                   >
                      Already have an account? Login
                   </button>
                </div>
             ) : (
                <>
                   <button 
                      onClick={() => setIsSigningUp(true)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                   >
                      Sign up
                   </button>
                   <button 
                      onClick={onLogin}
                      className="w-full glass text-white/90 font-black py-5 rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest border-white/5 hover:bg-white/5"
                   >
                      Login
                   </button>
                   
                   <div className="pt-12 text-center opacity-40">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-4">Secure Gateway • Lagos, Nigeria</p>
                      <div className="flex justify-center gap-6 text-slate-500">
                         <Home size={18} />
                         <Search size={18} />
                         <MessageCircle size={18} />
                      </div>
                   </div>
                </>
             )}
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isLoggedIn) {
    return <AuthPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 md:pb-0 md:pl-24">
      <Header onOpenMenu={() => setIsMenuOpen(true)} />
      
      {/* Side Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 pb-6 flex flex-col items-center text-center border-b border-slate-100">
                 <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full border-2 border-blue-500 p-1">
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" className="w-full h-full rounded-full bg-slate-100" alt="User" />
                    </div>
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Tunde Olamide</h3>
                 <p className="text-slate-500 text-xs font-medium mt-1">@tunde_vibes</p>
                 
                 <div className="flex gap-10 mt-6">
                    <div className="text-center">
                       <p className="text-lg font-bold text-slate-900">0</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Likes</p>
                    </div>
                    <div className="text-center">
                       <p className="text-lg font-bold text-slate-900">0</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Followers</p>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                 <div className="px-2 space-y-1 text-slate-700">
                    {[
                      { icon: UserCircle, label: 'Profile' },
                      { icon: Users, label: 'Subscriptions' },
                      { icon: ImageIcon, label: 'Media Collection' },
                      { icon: List, label: 'Lists' },
                      { icon: Bookmark, label: 'Bookmarks' },
                      { icon: MessageCircle, label: 'Messages' },
                      { icon: Bell, label: 'Notifications' },
                      { icon: UserPlus, label: 'Referrals' },
                    ].map((item, i) => (
                       <button key={i} className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-all group rounded-xl">
                          <item.icon size={22} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                       </button>
                    ))}

                    <div className="my-4 border-t border-slate-100" />

                    {[
                      { icon: CreditCard, label: 'Add Payment Method' },
                      { icon: ShieldCheck, label: 'Become A Creator' },
                      { icon: HelpCircle, label: 'Contact Support' },
                      { icon: LifeBuoy, label: 'Help Center' },
                      { icon: FileText, label: 'Terms' },
                      { icon: Shield, label: 'Privacy Policy' },
                    ].map((item, i) => (
                       <button key={i} className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-all group rounded-xl">
                          <item.icon size={22} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                       </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-2xl mx-auto md:max-w-3xl lg:max-w-5xl">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
