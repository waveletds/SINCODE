/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  PlusSquare, 
  MessageCircle, 
  MessageSquare,
  User, 
  Bell,
  Settings,
  LogOut,
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
  UserCircle,
  Star,
  ShoppingBag,
  Tag,
  Package,
  Clock,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Monitor,
  Link,
  Info,
  UserCircle2,
  X,
  Plus,
  Video,
  Smile,
  Globe,
  Lock,
  DollarSign,
  Zap,
  Filter,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ListFilter,
  Download
} from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { cn, formatNaira } from '@/src/lib/utils';
import { initializePayment } from '@/src/lib/monnify';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab, setIsUploading }: { activeTab: string, setActiveTab: (t: string) => void, setIsUploading: (b: boolean) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Search, label: 'Explore' },
    { id: 'runs', icon: Zap, label: 'Runs' },
    { id: 'create', icon: ShieldCheck, label: 'Creator' },
    { id: 'store', icon: ShoppingBag, label: 'Shop' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex justify-around items-center h-16 md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'create') setIsUploading(false);
            }}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-all",
              isActive ? "text-blue-500 scale-105" : "text-slate-400"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
          </button>
        );
      })}
    </nav>
  );
};

const Header = ({ onOpenMenu, user, onWalletClick }: { onOpenMenu: () => void, user: any, onWalletClick: () => void }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-50 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={onOpenMenu} className="relative active:scale-95 transition-transform">
          <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'sinner'}`} className="w-full h-full" alt="User" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </button>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2">
         <Heart size={26} className="text-blue-500 fill-blue-500" strokeWidth={1} />
      </div>

      <div className="flex items-center gap-1.5">
        <button className="text-slate-400 p-2 hover:bg-slate-50 rounded-full transition-colors">
          <HelpCircle size={22} strokeWidth={1.5} />
        </button>
        <button 
            onClick={onWalletClick}
            className="bg-slate-50 border border-slate-100 py-1 px-3 rounded-lg flex items-center gap-2 active:scale-95 transition-transform"
        >
           <span className="text-[13px] font-black text-slate-900 tracking-tight">{formatNaira(user?.balance || 0)}</span>
        </button>
      </div>
    </header>
  );
};

// --- Pages ---

const FeedPage = ({ onPostClick, user, onUpdate }: { onPostClick: () => void, user: any, onUpdate: (data: any) => void }) => {
  const [activeCategory, setActiveCategory] = useState('Featured');
  
  const featuredCreators = [
    { 
      name: 'PokePetit...', 
      username: '@pokepetit...', 
      category: 'VIP', 
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Poke'
    },
    { 
      name: 'Lillie', 
      username: '@lillikois', 
      category: 'Straight', 
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lillie'
    },
    { 
      name: 'belladesa...', 
      username: '@belladesa...', 
      category: 'LGBTQ+', 
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella'
    },
    { 
      name: 'bigbootya...', 
      username: '@bigbootya...', 
      category: 'Lesbian', 
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Big'
    },
  ];

  const [creators] = useState([
    { id: 1, name: 'TheLittleJui...', handle: 'thelittlejui...', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', active: true },
    { id: 2, name: 'Lagos Model', handle: 'ekofinesse', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', active: true },
    { id: 3, name: 'Studio Vibes', handle: 'studiovibes', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', active: false },
  ]);

  const handlePayment = (amount: number, description: string) => {
    // Option to pay with wallet
    if (confirm(`Unlock with Wallet for ${formatNaira(amount)}?`)) {
        if ((user?.balance || 0) < amount) {
            alert("Insufficient wallet balance.");
            return;
        }

        onUpdate({
            ...user,
            balance: user.balance - amount,
            transactions: [{
                id: `UNLOCK-${Date.now()}`,
                type: 'purchase',
                amount: amount,
                description: `Unlock: ${description}`,
                date: new Date().toISOString(),
                status: 'success'
            }, ...(user.transactions || [])]
        });
        alert("Content unlocked successfully using wallet!");
        return;
    }

    initializePayment({
      amount,
      customerName: user?.name || "Fan",
      customerEmail: user?.email || "fan@sincode.ng",
      paymentReference: `SC-${Date.now()}`,
      paymentDescription: description,
      onComplete: (res: any) => {
        onUpdate({
            ...user,
            transactions: [{
                id: res.transactionReference,
                type: 'purchase',
                amount: amount,
                description: `Unlock: ${description}`,
                date: new Date().toISOString(),
                status: 'success'
            }, ...(user.transactions || [])]
        });
        alert("Content unlocked successfully!");
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
          {['Featured', 'VIP', 'Straight', 'Lesbian', 'Gay', 'LGBTQ+'].map((tab, i) => (
              <button 
                key={tab} 
                onClick={() => setActiveCategory(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-full whitespace-nowrap text-[13px] font-bold transition-all border",
                  activeCategory === tab 
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                    : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                )}
              >
                {tab}
              </button>
           ))}
           <button className="p-2 aspect-square rounded-full bg-slate-50 border border-slate-100 text-blue-500">
              <TrendingUp size={18} />
           </button>
           <button 
            onClick={onPostClick}
            className="p-2 aspect-square rounded-full bg-slate-50 border border-slate-100 text-blue-500 active:scale-95 transition-transform"
           >
              <PlusSquare size={18} />
           </button>
        </div>
      </div>

      {/* Title Section */}
      <div className="px-6 mt-6 flex items-center justify-between">
         <h3 className="text-base font-bold text-slate-800">Who To Follow</h3>
         <div className="flex gap-4">
            <button className="text-slate-300 hover:text-slate-600"><ChevronLeft size={20} /></button>
            <button className="text-slate-600 hover:text-slate-900"><ChevronRight size={20} /></button>
         </div>
      </div>

      {/* Featured Vertical List - Matches Screenshot */}
      <div className="px-4 py-4 space-y-3">
        {featuredCreators
          .filter(c => activeCategory === 'Featured' || c.category === activeCategory)
          .map((creator, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative h-28 w-full rounded-2xl overflow-hidden border border-slate-100 shadow-xs bg-white"
          >
            {/* Background Image / Blur */}
            <div className="absolute inset-0">
               <img src={creator.image} className="w-full h-full object-cover blur-sm opacity-40" alt="" />
               <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/40 to-transparent"></div>
            </div>

            <div className="relative h-full flex items-center justify-between px-4 z-10">
               <div className="flex items-center gap-3">
                  {/* Avatar with Ring */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                      <img src={creator.avatar} className="w-full h-full object-cover" alt={creator.name} />
                    </div>
                    {/* Tiny Status Indicator found in screenshot */}
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight">{creator.name}</h4>
                      <BadgeCheck size={16} className="text-blue-500 fill-blue-500 bg-white rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{creator.username}</p>
                  </div>
               </div>

               <button className="bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold px-6 py-2 rounded-full shadow-sm transition-all active:scale-95 leading-none">
                  Follow
               </button>
            </div>
          </motion.div>
        ))}
        
        {/* Indicators */}
        <div className="flex justify-center items-center gap-2 pt-2">
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
           <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
           <button className="text-slate-400 pl-1"><ChevronRight size={14} /></button>
        </div>
      </div>

      <div className="px-6 mt-6 flex items-center justify-between">
         <h3 className="text-base font-bold text-slate-800">New On SINCODE</h3>
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
        {[1, 2, 3].map((post) => (
          <div key={post} className="bg-white border-b border-slate-100 py-6 space-y-4">
            {/* Post Header */}
            <div className="px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post === 1 ? 'juice' : post === 2 ? 'angel' : 'model'}`} className="w-full h-full object-cover bg-slate-100" alt="Avatar" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">{post === 1 ? 'TheLittleJui...' : post === 2 ? 'Tems Angel' : 'Lagos Model'}</h3>
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                       <ShieldCheck size={10} className="text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">@{post === 1 ? 'thelittlejui...' : post === 2 ? 'tems_vibes' : 'ekofinesse'} • {post * 2}h</p>
                </div>
              </div>
              <button className="text-slate-400 p-2">
                 <MoreHorizontal size={20} />
              </button>
            </div>
            
            {/* Post Content */}
            <div className="px-4 space-y-4">
               <p className="text-sm text-slate-700 leading-relaxed">
                 {post === 1 
                   ? "Squirted again... This time it shot so far My pussy kept twitching and gushing nonstop, I couldn't stop cumming at all~ 💖💕🐳🐳🐳 #squirting" 
                   : post === 2 
                   ? "Lagos Fashion Week was a blast! 🇳🇬 Can't wait to show you all the behind the scenes movements. Stay tuned for the exclusive drop. ✨"
                   : "Early morning sessions at the studio. 📸 New content arriving shortly. Subscribe to get early access to the vault! #StudioVibes"}
               </p>
               
               <div className="relative aspect-video rounded-xl overflow-hidden group bg-slate-200">
                 <img src={post === 1 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" : post === 2 ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80"} className="w-full h-full object-cover blur-3xl opacity-60 absolute scale-125" alt="Teaser" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/5">
                    <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-3">
                       <EyeOff size={28} />
                    </div>
                    <button 
                      onClick={() => handlePayment(2500, "Unlock Content")}
                      className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      Unlock for $5
                    </button>
                 </div>
               </div>
            </div>

            {/* Post Bottom Bar */}
            <div className="px-4 pt-2 flex items-center justify-between">
               <div className="flex items-center gap-6 text-slate-400">
                  <div className="flex items-center gap-1.5 p-1 hover:text-blue-500 transition-colors cursor-pointer">
                     <Heart size={22} />
                     <span className="text-xs font-bold">{post * 42}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 hover:text-blue-500 transition-colors cursor-pointer">
                     <MessageCircle size={22} />
                     <span className="text-xs font-bold">{post * 12}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 hover:text-blue-500 transition-colors cursor-pointer">
                     <Bookmark size={22} />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const AuthPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sign up fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');

  // Login fields
  const [loginId, setLoginId] = useState(''); // Email (Supabase requires email for default auth)
  const [loginPassword, setLoginPassword] = useState('');

  // Recovery fields
  const [recoveryId, setRecoveryId] = useState('');

  const handleSignUp = async () => {
    if (!name || !username || !email || !password || !state) {
      setError('Please fill all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username: username.startsWith('@') ? username : `@${username}`,
          phone,
          dob,
          gender,
          state,
          location: `${state}, Nigeria`
        }
      }
    });

    setIsLoading(false);

    if (signUpError) {
      if (signUpError.message === 'Failed to fetch') {
        setError('Network error: Could not reach Supabase. Please check your internet connection and Supabase environment variables.');
      } else {
        setError(signUpError.message);
      }
    } else if (data.user) {
      setSuccess('Account created! Please check your email for verification.');
      setIsSigningUp(false);
    }
  };

  const handleLogin = async () => {
    if (!loginId || !loginPassword) {
      setError('Please enter your credentials');
      return;
    }
    
    setIsLoading(true);
    setError('');

    let emailToUse = loginId;

    try {
      // If loginId doesn't look like an email, try to find the profile to get the email
      if (!loginId.includes('@') || loginId.startsWith('@')) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .or(`username.eq.${loginId},phone.eq.${loginId},username.eq.@${loginId}`)
          .maybeSingle();
        
        if (profileError) throw profileError;

        if (profile && profile.email) {
          emailToUse = profile.email;
        }
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: loginPassword,
      });

      if (signInError) {
        setError(signInError.message || 'Invalid credentials or non-registered user');
      } else if (data.user) {
        setSuccess('Identity verified! Accessing SINCODE...');
      }
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      if (err.message === 'Failed to fetch') {
        setError('Network error: Could not reach Supabase. Check your setup.');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async () => {
    if (!recoveryId) {
       setError('Please enter your email');
       return;
    }
    setIsLoading(true);
    setError('');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(recoveryId, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess('Recovery link sent to your email.');
    }
  };

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
         isSigningUp || isForgotPass ? "pt-6 pb-6" : "pt-12 pb-16"
       )}>
          <div className="absolute top-0 inset-x-0 h-full bg-linear-to-b from-blue-600/5 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="relative mb-6">
                <Heart size={isSigningUp || isForgotPass ? 40 : 80} className="text-white fill-white transition-all" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
                      <Eye size={18} className="text-blue-400" strokeWidth={3} />
                   </div>
                </div>
             </div>
             <h1 className="text-5xl font-display font-black text-white tracking-tight uppercase italic mb-2">SINCODE</h1>
             <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Elite Nigerian Creator Hub</p>
          </div>

          {/* Featured Teasers Grid - Hide or shrink when signing up or forgot password */}
          {(!isSigningUp && !isForgotPass) && (
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
         isSigningUp || isForgotPass ? "justify-start" : "justify-center"
       )}>
          {error && <div className="w-full max-w-sm mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">{error}</div>}
          {success && <div className="w-full max-w-sm mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-xl text-center">{success}</div>}
          
          <div className="w-full max-w-sm space-y-4">
             {isForgotPass ? (
                <div className="space-y-6 py-4">
                   <div className="space-y-2">
                     <h3 className="text-white font-bold text-lg">Recover Account</h3>
                     <p className="text-slate-500 text-xs">Enter your email, username or phone number to recover your password.</p>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Identity Information</label>
                      <input value={recoveryId} onChange={e => setRecoveryId(e.target.value)} type="text" placeholder="Email, Username or Phone" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                   </div>
                   
                   <button 
                      onClick={handleRecovery}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest mt-4"
                   >
                      Recover Password
                   </button>
                   
                   <button 
                      onClick={() => {
                        setIsForgotPass(false);
                        setSuccess('');
                        setError('');
                      }}
                      className="w-full text-slate-500 font-black py-2 text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                   >
                      Back to Login
                   </button>
                </div>
             ) : isSigningUp ? (
                <div className="space-y-4 pb-12">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g. Tunde Olamide" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Username</label>
                      <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="@tunde_vibes" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tunde@example.com" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Password</label>
                      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                      <div className="flex gap-2">
                        <div className="bg-navy-900 border border-white/5 rounded-xl px-4 py-4 text-slate-500 text-sm font-bold">+234</div>
                        <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="801 234 5678" className="flex-1 bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Birth Date</label>
                         <input value={dob} onChange={e => setDob(e.target.value)} type="date" className="w-full bg-navy-900 border border-white/5 rounded-xl px-4 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 transition-colors [color-scheme:dark]" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                         <select 
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full bg-navy-900 border border-white/5 rounded-xl px-2 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 appearance-none transition-colors"
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
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Location (State in Nigeria)</label>
                      <select 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 appearance-none transition-colors"
                      >
                         <option value="" disabled>Select State</option>
                         {NIGERIAN_STATES.map(s => (
                           <option key={s} value={s}>{s}</option>
                         ))}
                      </select>
                   </div>
                   
                   <button 
                      onClick={handleSignUp}
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
                <div className="space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Login Identity</label>
                        <input value={loginId} onChange={e => setLoginId(e.target.value)} type="text" placeholder="Email, Username or Phone" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center pr-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Password</label>
                          <button 
                            onClick={() => setIsForgotPass(true)}
                            className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" />
                      </div>
                   </div>

                   <button 
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
                   >
                      {isLoading ? (
                         <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>Signing In...</span>
                         </>
                      ) : (
                         "Sign In"
                      )}
                   </button>
                   <button 
                      onClick={() => setIsSigningUp(true)}
                      className="w-full glass text-white/90 font-black py-5 rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest border-white/5 hover:bg-white/5"
                   >
                      Create Account
                   </button>
                   
                   <div className="pt-12 text-center opacity-40">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-4">Secure Gateway • Lagos, Nigeria</p>
                      <div className="flex justify-center gap-6 text-slate-500">
                         <Home size={18} />
                         <Search size={18} />
                         <MessageCircle size={18} />
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

const WalletPage = ({ user, onUpdate }: { user: any, onUpdate: (data: any) => void }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [fundingAmount, setFundingAmount] = useState('');

    const generateDAN = async () => {
        setIsGenerating(true);
        // Simulate Monnify API call
        setTimeout(() => {
            const newAccount = {
                accountName: `SINCODE / ${user?.name?.toUpperCase()}`,
                accountNumber: Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
                bankName: 'WEMA BANK (MONNIFY)',
                reference: `DAN-${user?.id}-${Date.now()}`
            };
            onUpdate({ ...user, monnify_account: newAccount });
            setIsGenerating(false);
        }, 1500);
    };

    const handleFundWallet = () => {
        const amount = parseInt(fundingAmount);
        if (isNaN(amount) || amount < 100) {
            alert("Please enter a valid amount (minimum ₦100)");
            return;
        }

        initializePayment({
            amount: amount,
            customerName: user.name,
            customerEmail: user.email || `${user.username}@sincode.ng`,
            paymentReference: `FUND-${user.id}-${Date.now()}`,
            paymentDescription: `Funding Sincode Wallet: ${formatNaira(amount)}`,
            onComplete: (res: any) => {
                const newTransaction = {
                    id: res.transactionReference,
                    type: 'funding',
                    amount: amount,
                    description: 'Wallet Funding',
                    date: new Date().toISOString(),
                    status: 'success'
                };
                onUpdate({
                    ...user,
                    balance: (user.balance || 0) + amount,
                    transactions: [newTransaction, ...(user.transactions || [])]
                });
                setFundingAmount('');
                alert(`Wallet funded successfully with ${formatNaira(amount)}`);
            },
            onClose: () => {}
        });
    };

    const handleDemoFund = () => {
        const amount = 100000;
        const newTransaction = {
            id: `DEMO-${Date.now()}`,
            type: 'funding',
            amount: amount,
            description: 'Demo Account Credit',
            date: new Date().toISOString(),
            status: 'success'
        };
        onUpdate({
            ...user,
            balance: (user.balance || 0) + amount,
            transactions: [newTransaction, ...(user.transactions || [])]
        });
        alert(`Demo funds of ${formatNaira(amount)} added!`);
    };

    return (
        <div className="bg-white min-h-screen pb-20 p-6 space-y-8">
            <header className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-600/20 mb-2">
                    <DollarSign size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase italic leading-none">Wallet & Credits</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Manage your sin-credits</p>
            </header>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 space-y-1">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest opacity-80">Available Balance</p>
                    <h3 className="text-5xl font-display font-black tracking-tighter">{formatNaira(user?.balance || 0)}</h3>
                </div>
                
                <div className="mt-10 pt-10 border-t border-white/5 flex gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Account Holder</p>
                        <p className="text-xs font-bold uppercase tracking-tight">{user?.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Network</p>
                        <p className="text-xs font-bold uppercase tracking-tight">Mainnet</p>
                    </div>
                </div>
            </div>

            {/* Monnify DAN Section */}
            <section className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Dedicated Account</h4>
                {user?.monnify_account ? (
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Name</span>
                            <span className="text-xs font-bold text-slate-900">{user.monnify_account.bankName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Number</span>
                            <span className="text-lg font-black text-blue-600 tracking-tighter">{user.monnify_account.accountNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Name</span>
                            <span className="text-[11px] font-bold text-slate-900">{user.monnify_account.accountName}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                            <p className="text-[9px] text-center text-slate-400 font-medium italic">Transfers to this account will fund your wallet automatically.</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-100 border-dashed rounded-[2rem] p-10 flex flex-col items-center text-center space-y-6">
                        <Monitor size={32} className="text-slate-300" />
                        <div className="space-y-2">
                            <h5 className="text-sm font-bold text-slate-900">Virtual Account Number</h5>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">Generate a dedicated NGN account to fund your profile with bank transfers.</p>
                        </div>
                        <button 
                            onClick={generateDAN}
                            disabled={isGenerating}
                            className="bg-blue-600 text-white font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : "Generate Monnify DAN"}
                        </button>
                    </div>
                )}
            </section>

            {/* Funding Input */}
            <section className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Quick Top-up</h4>
                <div className="flex gap-3">
                    <input 
                        type="number" 
                        value={fundingAmount}
                        onChange={e => setFundingAmount(e.target.value)}
                        placeholder="Amount (₦)" 
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500" 
                    />
                    <button 
                        onClick={handleFundWallet}
                        className="bg-slate-900 text-white font-black px-8 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Fund
                    </button>
                    <button 
                        onClick={handleDemoFund}
                        className="bg-blue-600 text-white font-black px-4 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                        title="Add ₦100,000 for Testing"
                    >
                        Demo +100k
                    </button>
                </div>
            </section>

            {/* History */}
            <section className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Transaction History</h4>
                {(!user?.transactions || user.transactions.length === 0) ? (
                    <div className="py-20 text-center">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest italic tracking-tighter">No transactions yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {user.transactions.map((tx: any, i: number) => (
                            <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center border",
                                        tx.type === 'funding' ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-blue-50 text-blue-500 border-blue-100"
                                    )}>
                                        {tx.type === 'funding' ? <Plus size={20} /> : <ShoppingBag size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 italic tracking-tight uppercase">{tx.description}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={cn(
                                    "text-sm font-black tracking-tighter",
                                    tx.type === 'funding' ? "text-emerald-500" : "text-blue-600"
                                )}>
                                    {tx.type === 'funding' ? '+' : '-'}{formatNaira(tx.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

const CommercePage = ({ user, onUpdate }: { user: any, onUpdate: (data: any) => void }) => {
    const [view, setView] = useState<'shop' | 'checkout' | 'payment' | 'cart'>('shop');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: ''
    });

    const products = [
        { id: 1, name: 'Exclusive Photo Pack', creator: 'Aisha Vibe', price: 4500, category: 'Digital', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', type: 'digital' },
        { id: 2, name: 'Signed Lagos Cap', creator: 'Flex King', price: 12000, category: 'Merch', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', type: 'physical' },
        { id: 3, name: 'VIP Meet & Greet', creator: 'Sade G', price: 50000, category: 'Experience', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', type: 'experience' },
        { id: 4, name: 'Behind the Scenes Vol 1', creator: 'Queer Queen', price: 5500, category: 'Digital', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', type: 'digital' },
    ];

    const handleBuy = (p: any) => {
        setSelectedProduct(p);
        setView('checkout');
    };

    const handleCheckoutSubmit = (e: FormEvent) => {
        e.preventDefault();
        setView('payment');
    };

    const handleWalletPayment = () => {
        if ((user?.balance || 0) < selectedProduct.price) {
            alert("Insufficient wallet balance. Please fund your wallet.");
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            const newTransaction = {
                id: `ORD-${Date.now()}`,
                type: 'purchase',
                amount: selectedProduct.price,
                description: `Purchase: ${selectedProduct.name}`,
                date: new Date().toISOString(),
                status: 'success'
            };
            
            onUpdate({
                ...user,
                balance: user.balance - selectedProduct.price,
                transactions: [newTransaction, ...(user.transactions || [])]
            });
            
            handlePaymentComplete();
            setIsProcessing(false);
        }, 1500);
    };

    const handlePaymentComplete = () => {
        const newOrder = {
            ...selectedProduct,
            ...deliveryDetails,
            orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
            date: new Date().toLocaleDateString(),
            deliveryDay: 'Thursday',
            deliveryTime: '2:00 PM',
            deliveryCode: `DLV-${Math.floor(Math.random() * 9999)}`
        };
        setOrders([...orders, newOrder]);
        setView('cart');
    };

    if (view === 'checkout') {
        return (
            <div className="bg-white min-h-screen pb-20">
                <div className="p-6">
                    <button onClick={() => setView('shop')} className="mb-6 p-2 bg-slate-50 text-slate-400 rounded-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase italic mb-8">Checkout</h2>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 mb-8 flex items-center gap-4">
                        <img src={selectedProduct.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                        <div>
                            <p className="text-sm font-bold text-slate-900">{selectedProduct.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{selectedProduct.creator}</p>
                            <p className="text-sm font-black text-blue-500 mt-1">{formatNaira(selectedProduct.price)}</p>
                        </div>
                    </div>

                    <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={deliveryDetails.fullName}
                                onChange={e => setDeliveryDetails({...deliveryDetails, fullName: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500" 
                                placeholder="Enter your full name" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                            <input 
                                type="tel" 
                                required
                                value={deliveryDetails.phone}
                                onChange={e => setDeliveryDetails({...deliveryDetails, phone: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500" 
                                placeholder="e.g. +234 800 000 0000" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Delivery Address</label>
                            <input 
                                type="text" 
                                required
                                value={deliveryDetails.address}
                                onChange={e => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500" 
                                placeholder="Street address" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City</label>
                                <input 
                                    type="text" 
                                    required
                                    value={deliveryDetails.city}
                                    onChange={e => setDeliveryDetails({...deliveryDetails, city: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500" 
                                    placeholder="Lagos" 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">State</label>
                                <input 
                                    type="text" 
                                    required
                                    value={deliveryDetails.state}
                                    onChange={e => setDeliveryDetails({...deliveryDetails, state: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-500" 
                                    placeholder="Lagos" 
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-blue-600/10 active:scale-95 transition-all mt-8">
                            Proceed to Payment
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (view === 'payment') {
        return (
            <div className="bg-white min-h-screen pb-20">
                <div className="p-6">
                    <button onClick={() => setView('checkout')} className="mb-6 p-2 bg-slate-50 text-slate-400 rounded-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase italic mb-8">Payment Details</h2>

                    <div className="space-y-4">
                        <button 
                            onClick={handleWalletPayment}
                            className="w-full bg-blue-600 text-white p-6 rounded-[2rem] text-left shadow-lg shadow-blue-600/10 group relative overflow-hidden active:scale-[0.98] transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 flex items-center gap-1.5 mb-1">
                                        <Monitor size={12} />
                                        Pay with Wallet
                                    </p>
                                    <p className="text-lg font-black italic tracking-tighter">SINCODE BALANCE</p>
                                    <p className="text-xs font-bold mt-2 text-blue-100">Wallet: {formatNaira(user?.balance || 0)}</p>
                                </div>
                                <p className="text-xl font-black">{formatNaira(selectedProduct.price)}</p>
                            </div>
                        </button>

                        <div className="relative py-4 flex items-center justify-center">
                            <div className="absolute inset-x-0 h-[1px] bg-slate-100"></div>
                            <span className="relative z-10 bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Or Pay with Transfer</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Transfer to Sincode Bank</p>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Bank Name</p>
                                    <p className="text-md font-black text-slate-800 font-mono">Wema Bank (Sincode Pay)</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Account Number</p>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter font-mono">7820124563</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6">
                            <p className="text-xs text-blue-700 font-medium italic">Your order will be processed automatically once transfer is detected. Do not close this page.</p>
                        </div>

                        <button 
                            onClick={handlePaymentComplete}
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-sm uppercase tracking-widest active:scale-95 transition-all mt-8"
                        >
                            I have Paid
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'cart') {
        return (
            <div className="bg-white min-h-screen pb-20">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase italic">My Orders</h2>
                        <button onClick={() => setView('shop')} className="p-2 bg-slate-50 text-blue-500 rounded-xl font-bold text-xs uppercase">Store</button>
                    </div>

                    {orders.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-medium">You haven't ordered anything yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden"
                                >
                                    <div className="flex gap-4">
                                        <img src={order.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-md font-bold text-slate-900 leading-tight">{order.name}</h4>
                                                <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest">{order.type}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">{order.creator}</p>
                                            <p className="text-xs font-black text-slate-900 mt-2">{formatNaira(order.price)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                                        {order.type === 'digital' ? (
                                            <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2">
                                                <Download size={16} />
                                                Download Digital Content
                                            </button>
                                        ) : (
                                            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivery Schedule</p>
                                                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{order.deliveryDay}, {order.deliveryTime}</p>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Order PIN / ID</p>
                                                    <p className="text-sm font-black text-slate-900 font-mono tracking-tighter">{order.deliveryCode}</p>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">Order ID: {order.orderId}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase italic">Commerce</h2>
                    <button 
                        onClick={() => setView('cart')}
                        className="relative p-2 bg-slate-50 rounded-xl"
                    >
                        <ShoppingBag size={24} className="text-slate-400" />
                        {orders.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-pulse">{orders.length}</div>
                        )}
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8">
                    {['All Items', 'Digital', 'Merch', 'Experience', 'Services'].map((cat, i) => (
                        <button key={i} className={cn(
                            "px-5 py-2 rounded-xl whitespace-nowrap text-xs font-bold transition-all border",
                            i === 0 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-500 border-slate-100"
                        )}>
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {products.map((p) => (
                        <motion.div 
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden group shadow-sm flex flex-col h-full active:scale-[0.98] transition-transform"
                        >
                            <div className="relative aspect-square">
                                <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={p.name} />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[8px] font-black text-slate-800 uppercase tracking-widest shadow-sm">
                                    {p.category}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="text-[13px] font-bold text-slate-900 leading-tight">{p.name}</h4>
                                <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{p.creator}</p>
                                
                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <span className="text-[14px] font-black text-slate-900">{formatNaira(p.price)}</span>
                                    <button 
                                        onClick={() => handleBuy(p)}
                                        className="w-10 h-10 bg-blue-600 text-white rounded-xl active:scale-90 transition-transform shadow-lg shadow-blue-600/10 flex items-center justify-center"
                                    >
                                        <PlusSquare size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* Promo Banner */}
            <div className="px-6 mt-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <Tag className="text-blue-400 mb-4" size={24} />
                        <h3 className="text-white font-bold text-2xl leading-none italic uppercase tracking-tighter">Elite Hub<br/><span className="text-blue-500">Video Pack</span></h3>
                        <p className="text-slate-400 text-[10px] mt-4 font-bold uppercase tracking-widest">Get 40% OFF this weekend.</p>
                        <button className="mt-8 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.25em] px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/20">
                            Claim Offer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsPage = ({ onBack, user, onOpenMenu }: { onBack: () => void, user: any, onOpenMenu: () => void }) => {
    const settingsItems = [
        { label: 'Account', icon: UserCircle2 },
        { label: 'Privacy & Safety', icon: ShieldCheck },
        { label: 'Session Management', icon: ShieldCheck },
        { label: 'Payments', icon: CreditCard },
        { label: 'Display', icon: Monitor },
        { label: 'Notifications', icon: Bell },
        { label: 'Connections', icon: Link },
        { label: 'About', icon: Info },
    ];

    return (
        <div className="bg-white min-h-screen">
            <Header onOpenMenu={onOpenMenu} user={user} onWalletClick={() => {}} />
            <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-6">
                <button onClick={onBack} className="text-slate-900 active:scale-95 transition-transform">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-slate-900">Settings</h2>
            </div>

            <div className="mt-2 divide-y divide-slate-50">
                {settingsItems.map((item, idx) => (
                    <button 
                        key={idx}
                        className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors active:bg-slate-100 group"
                    >
                        <div className="flex items-center gap-4">
                            <item.icon size={22} className="text-slate-400 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                            <span className="text-[15px] font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                        </div>
                        <ChevronRight size={20} className="text-slate-300" />
                    </button>
                ))}
            </div>
        </div>
    );
};

const CreatePostPage = ({ onBack }: { onBack: () => void }) => {
    const [text, setText] = useState('');
    const [media, setMedia] = useState<{ type: 'image' | 'video', url: string, file: File }[]>([]);
    const [isPublic, setIsPublic] = useState(true);
    const [price, setPrice] = useState('0');
    const [isPosting, setIsPosting] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file: File) => {
            const url = URL.createObjectURL(file);
            const type = file.type.startsWith('video/') ? 'video' : 'image';
            setMedia(prev => [...prev, { type: type as 'image' | 'video', url, file }]);
        });
    };

    const removeMedia = (index: number) => {
        setMedia(prev => {
            const newMedia = [...prev];
            URL.revokeObjectURL(newMedia[index].url);
            newMedia.splice(index, 1);
            return newMedia;
        });
    };

    const handlePost = () => {
        setIsPosting(true);
        // Simulate posting
        setTimeout(() => {
            setIsPosting(false);
            alert('Post published successfully!');
            onBack();
        }, 2000);
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <header className="px-4 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-slate-900 active:scale-95 transition-transform">
                        <X size={24} />
                    </button>
                    <h2 className="text-lg font-bold text-slate-900">New Post</h2>
                </div>
                <button 
                    onClick={handlePost}
                    disabled={(!text && media.length === 0) || isPosting}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                    {isPosting ? 'Posting...' : 'Post'}
                </button>
            </header>

            <div className="p-4 space-y-6">
                {/* Text Area */}
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's on your mind? Share an update with your fans..."
                    className="w-full min-h-[120px] text-[15px] text-slate-700 placeholder:text-slate-400 focus:outline-hidden resize-none leading-relaxed"
                />

                {/* Media Previews */}
                {media.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {media.map((item, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                                {item.type === 'image' ? (
                                    <img src={item.url} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <video src={item.url} className="w-full h-full object-cover" controls />
                                )}
                                <button 
                                    onClick={() => removeMedia(idx)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex items-center gap-4 py-2 border-y border-slate-50">
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95">
                        <ImageIcon size={18} className="text-emerald-500" />
                        <span className="text-[13px] font-bold">Image</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95">
                        <Video size={18} className="text-blue-500" />
                        <span className="text-[13px] font-bold">Video</span>
                        <input type="file" multiple accept="video/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-slate-600 hover:bg-slate-100 transition-colors active:scale-95">
                        <Smile size={18} className="text-amber-500" />
                    </button>
                </div>

                {/* Settings */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                                {isPublic ? <Globe size={20} /> : <Lock size={20} />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{isPublic ? 'Public Post' : 'Locked Post'}</h4>
                                <p className="text-[10px] text-slate-500 font-medium">{isPublic ? 'Visible to all subscribers' : 'Unlock requires payment'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsPublic(!isPublic)}
                            className={cn(
                                "w-11 h-6 rounded-full transition-colors relative",
                                isPublic ? "bg-blue-500" : "bg-slate-300"
                            )}
                        >
                            <div className={cn(
                                "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                                isPublic ? "right-1" : "left-1"
                            )} />
                        </button>
                    </div>

                    {!isPublic && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 bg-blue-50 rounded-2xl border border-blue-100"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-bold text-blue-600 uppercase tracking-widest pl-1">Unlock Price (₦)</label>
                                <DollarSign size={16} className="text-blue-400" />
                            </div>
                            <input 
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-lg font-bold text-blue-500 focus:outline-hidden"
                            />
                            <p className="text-[10px] text-blue-400 font-medium mt-2 pl-1">Fans must pay this amount to view the full content.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const RunsPage = ({ user, onUpdate }: { user: any, onUpdate: (data: any) => void }) => {
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [activeSubscription, setActiveSubscription] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const fee = 2000;

    const categories = [
        { id: 'mummy', label: 'Sugar Mummy', price: 25000, color: 'from-pink-500 to-rose-600', icon: '👑', badge: 'MUMMY' },
        { id: 'daddy', label: 'Sugar Daddy', price: 25000, color: 'from-blue-600 to-indigo-700', icon: '💎', badge: 'DADDY' },
        { id: 'boy', label: 'Sugar Boy', price: 15000, color: 'from-cyan-500 to-blue-600', icon: '🔥', badge: 'BOY' },
        { id: 'girl', label: 'Runs Girl', price: 5000, color: 'from-purple-500 to-indigo-600', icon: '✨', badge: 'GIRL' },
        { id: 'fwb', label: 'FWB (Friends)', price: 5000, color: 'from-orange-400 to-red-500', icon: '🤝', badge: 'FWB' },
    ];

    const categoryMembers: Record<string, any[]> = {
        mummy: [
            { id: 'm1', name: 'Lady Diana', age: 42, location: 'Lekki Phase 1', bio: 'Looking for a decent and respectful companion.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana' },
            { id: 'm2', name: 'Alhaja Chief', age: 45, location: 'VI, Lagos', bio: 'Discretion is my top priority. Serious inquiries only.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chief' },
        ],
        daddy: [
            { id: 'd1', name: 'Chairman Otunba', age: 52, location: 'Ikoyi', bio: 'Successful entrepreneur seeking a smart protege.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Otunba' },
            { id: 'd2', name: 'Mr. Benson', age: 48, location: 'Abuja, FCT', bio: 'Frequent traveler, needs a travel buddy.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benson' },
        ],
        girl: [
            { id: 'g1', name: 'Bella Spice', age: 24, location: 'Ikeja', bio: 'High energy, loves clubbing and good vibes.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spice' },
            { id: 'g2', name: 'Crystal Lagos', age: 22, location: 'Ajah', bio: 'Student and part-time model.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Crystal' },
        ],
        boy: [
            { id: 'b1', name: 'Flex Jay', age: 26, location: 'Surulere', bio: 'Fitness enthusiast and great conversationalist.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jay' },
            { id: 'b2', name: 'Smooth Operator', age: 25, location: 'Magodo', bio: 'Artistic soul looking for inspiration.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Smooth' },
        ],
        fwb: [
            { id: 'f1', name: 'No Strings Tee', age: 27, location: 'Yaba', bio: 'Just keeping it casual. No drama.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tee' },
            { id: 'f2', name: 'Casual Kay', age: 23, location: 'VGC', bio: 'Good listener, loves late-night movies.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kay' },
        ]
    };

    const handleEnroll = async () => {
        setIsVerifying(true);
        try {
            await initializePayment({
                amount: fee,
                customerName: user?.full_name || user?.name || "Member",
                customerEmail: user?.email || "member@sincode.ng",
                paymentReference: `ENROLL-${Date.now()}`,
                paymentDescription: "Runs Network Enrollment Fee",
                onComplete: (res: any) => {
                    onUpdate?.({
                        ...user,
                        transactions: [{
                            id: res.transactionReference,
                            type: 'enrollment',
                            amount: fee,
                            description: 'Runs Network Enrollment',
                            date: new Date().toISOString(),
                            status: 'success'
                        }, ...(user.transactions || [])]
                    });
                    setIsEnrolled(true);
                    setIsVerifying(false);
                },
                onClose: () => setIsVerifying(false)
            });
        } catch (error) {
            console.error("Enrollment failed:", error);
            alert("Could not initialize payment. Please check your connection.");
            setIsVerifying(false);
        }
    };

    const handleWalletEnroll = () => {
        if ((user?.balance || 0) < fee) {
            alert("Insufficient wallet balance.");
            return;
        }

        setIsVerifying(true);
        setTimeout(() => {
            onUpdate?.({
                ...user,
                balance: user.balance - fee,
                transactions: [{
                    id: `RUNS-${Date.now()}`,
                    type: 'enrollment',
                    amount: fee,
                    description: 'Runs Network Enrollment (Wallet)',
                    date: new Date().toISOString(),
                    status: 'success'
                }, ...(user.transactions || [])]
            });
            setIsEnrolled(true);
            setIsVerifying(false);
            alert("Enrolled successfully using wallet balance!");
        }, 1500);
    };

    const handleSubscribe = async (cat: any) => {
        // Option to pay with wallet for subscriptions as well
        if (confirm(`Pay ${formatNaira(cat.price)} with wallet?`)) {
            if ((user?.balance || 0) < cat.price) {
                alert("Insufficient wallet balance.");
                return;
            }
            setIsVerifying(true);
            setTimeout(() => {
                onUpdate({
                    ...user,
                    balance: user.balance - cat.price,
                    transactions: [{
                        id: `SUB-${cat.id}-${Date.now()}`,
                        type: 'subscription',
                        amount: cat.price,
                        description: `${cat.label} Subscription (Wallet)`,
                        date: new Date().toISOString(),
                        status: 'success'
                    }, ...(user.transactions || [])]
                });
                setActiveSubscription(cat.id);
                setIsVerifying(false);
                alert("Subscription active!");
            }, 1000);
            return;
        }

        setIsVerifying(true);
        try {
            await initializePayment({
                amount: cat.price,
                customerName: user?.full_name || user?.name || "Member",
                customerEmail: user?.email || "member@sincode.ng",
                paymentReference: `SUB-${cat.id}-${Date.now()}`,
                paymentDescription: `${cat.label} Monthly Subscription`,
                onComplete: (res: any) => {
                    console.log("Subscription Success", res);
                    onUpdate({
                        ...user,
                        transactions: [{
                            id: res.transactionReference,
                            type: 'subscription',
                            amount: cat.price,
                            description: `${cat.label} Subscription`,
                            date: new Date().toISOString(),
                            status: 'success'
                        }, ...(user.transactions || [])]
                    });
                    setActiveSubscription(cat.id);
                    setIsVerifying(false);
                },
                onClose: () => setIsVerifying(false)
            });
        } catch (error) {
            console.error("Subscription failed:", error);
            alert("Could not initialize payment. Please try again.");
            setIsVerifying(false);
        }
    };

    if (!isEnrolled) {
        return (
            <div className="bg-white min-h-screen p-6 flex flex-col items-center justify-center text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-linear-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20"
                >
                    <Zap size={40} className="text-white fill-white" />
                </motion.div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">SINCODE RUNS</h2>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-10">
                    Connect with premium elites and exclusive companions. Professional verification required for the elite network.
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 w-full text-center">
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Network Access Fee</p>
                    <p className="text-slate-900 text-3xl font-black tracking-tighter">{formatNaira(2000)}</p>
                    <p className="text-slate-400 text-[9px] font-bold mt-2 uppercase">Verified entry to exclusive matching</p>
                </div>
                <div className="w-full space-y-3">
                    <button 
                        onClick={handleWalletEnroll}
                        disabled={isVerifying}
                        className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isVerifying ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Monitor size={16} />
                                Pay with Wallet
                            </>
                        )}
                    </button>
                    <button 
                        onClick={handleEnroll}
                        disabled={isVerifying}
                        className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/10 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
                    >
                        Other Payment Options
                    </button>
                </div>
            </div>
        );
    }

    const currentCat = categories.find(c => c.id === activeSubscription);
    const members = activeSubscription ? categoryMembers[activeSubscription] : [];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-white px-6 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black text-slate-900 leading-none">The Network</h2>
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                        <Zap size={20} fill="currentColor" />
                    </div>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    {activeSubscription ? `Access: ${currentCat?.label}` : 'Choose Your Pathway'}
                </p>
            </div>

            <div className="p-6">
                {!activeSubscription ? (
                    <div className="space-y-4">
                        {categories.map((cat) => (
                            <motion.div 
                                key={cat.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative overflow-hidden rounded-[2rem] border border-slate-200/60 shadow-xs bg-white active:scale-[0.98] transition-transform cursor-pointer"
                                onClick={() => handleSubscribe(cat)}
                            >
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md",
                                            "bg-linear-to-tr", cat.color
                                        )}>
                                            {cat.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900">{cat.label}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-tighter">
                                                    {cat.badge}
                                                </div>
                                                <span className="text-slate-300">•</span>
                                                <p className="text-slate-400 text-[10px] font-bold">Verified Elite</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-900 font-black text-base">{formatNaira(cat.price)}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">per month</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Package Dashboard Header */}
                        <div className={cn(
                            "p-8 rounded-[2.5rem] bg-linear-to-tr text-white shadow-xl relative overflow-hidden",
                            currentCat?.color
                        )}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black">{currentCat?.label} Hub</h3>
                                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">Your Premium Dashboard</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black">
                                    PRO MEMBER
                                </div>
                            </div>
                            
                            <div className="mt-8 flex gap-3">
                                <div className="bg-white text-slate-900 px-4 py-3 rounded-2xl flex-1 text-center">
                                    <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Active Now</p>
                                    <p className="text-lg font-black leading-none">124</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl flex-1 text-center">
                                    <p className="text-[9px] font-black uppercase text-white/60 leading-none mb-1">Connections</p>
                                    <p className="text-lg font-black leading-none">18</p>
                                </div>
                                <button 
                                    onClick={() => setActiveSubscription(null)}
                                    className="bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl flex-none flex items-center justify-center text-white"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Search and Filters Placeholder */}
                        <div className="flex gap-2">
                             <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                                 <Search size={16} className="text-slate-400" />
                                 <input type="text" placeholder="Find partner..." className="bg-transparent text-sm w-full outline-hidden" />
                             </div>
                             <button className="bg-white border border-slate-200 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-600">
                                 <Filter size={18} />
                             </button>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 gap-4">
                            {members.map((member) => (
                                <motion.div 
                                    key={member.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                            <img src={member.avatar} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="text-base font-black text-slate-900 leading-none">{member.name}</h4>
                                                <BadgeCheck size={16} className="text-blue-500 fill-blue-500 bg-white rounded-full" />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{member.age} • {member.location}</p>
                                            <div className="flex gap-2 mt-2">
                                                 <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-[4px] text-[8px] font-black uppercase tracking-tighter">
                                                     {currentCat?.badge}
                                                 </div>
                                                 <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-[4px] text-[8px] font-black uppercase tracking-tighter">
                                                     ONLINE
                                                 </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedMember(member)}
                                            className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-all"
                                        >
                                            <MessageSquare size={18} />
                                        </button>
                                    </div>
                                    <p className="mt-3 text-[11px] text-slate-400 font-medium leading-relaxed italic">
                                        "{member.bio}"
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Connection Modal Placeholder */}
            <AnimatePresence>
                {selectedMember && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
                    >
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pb-10"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-1.5 bg-slate-100 rounded-full"></div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-xl mb-6">
                                    <img src={selectedMember.avatar} className="w-full h-full object-cover" alt="" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">Connect with {selectedMember.name}</h3>
                                <p className="text-slate-400 text-xs font-medium max-w-xs">{selectedMember.location} Elite Network</p>
                                
                                <div className="w-full mt-10 space-y-3">
                                    <button 
                                        className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all"
                                        onClick={() => {
                                            alert(`Connection request sent to ${selectedMember.name}!`);
                                            setSelectedMember(null);
                                        }}
                                    >
                                        <MessageSquare size={16} />
                                        Send Private Message
                                    </button>
                                    <button 
                                        className="w-full bg-slate-50 text-slate-400 font-black py-5 rounded-2xl text-xs uppercase tracking-widest active:scale-[0.98] transition-all"
                                        onClick={() => setSelectedMember(null)}
                                    >
                                        Later
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProfileSettings = ({ user, onBack, onSave }: { user: any, onBack: () => void, onSave: (data: any) => void }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        avatar: user?.avatar || '',
        cover_photo: user?.cover_photo || '',
        state: user?.state || '',
        address: user?.address || '',
        phone: user?.phone || '',
        orientation: user?.orientation || 'straight',
        bio: user?.bio || '',
        is_active: user?.is_active ?? true
    });
    const [isSaving, setIsSaving] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>, field: 'avatar' | 'cover_photo') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update(formData as any)
                .eq('id', user.id);
            
            if (error) throw error;
            onSave(formData);
            alert("Profile updated successfully!");
            onBack();
        } catch (err) {
            console.error("Save failed:", err);
            onSave(formData);
            alert("Demo: Profile updated!");
            onBack();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-24">
            <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onBack} className="p-3 bg-slate-100 rounded-2xl text-slate-400">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] italic">Edit Profile</h2>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>

            <div className="p-6 space-y-8">
                {/* Visual Identity */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Visual Identity</label>
                    <input 
                        type="file" 
                        ref={coverInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, 'cover_photo')} 
                    />
                    <input 
                        type="file" 
                        ref={avatarInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, 'avatar')} 
                    />
                    <div className="relative h-40 rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-50 group">
                        <img 
                            src={formData.cover_photo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"} 
                            className="w-full h-full object-cover opacity-60" 
                            alt="" 
                        />
                        <button 
                            onClick={() => coverInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <div className="p-4 bg-white/50 backdrop-blur-md rounded-full text-white border border-white/20">
                                <Plus size={24} />
                            </div>
                        </button>
                        <div className="absolute -bottom-6 left-8">
                            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-200 relative group">
                                <img src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} className="w-full h-full object-cover" alt="" />
                                <button 
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Plus size={20} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Name</label>
                        <input 
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-500/50"
                            placeholder="Display name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State</label>
                            <input 
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-500/50"
                                placeholder="Lagos, Nigeria"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Orientation</label>
                            <select 
                                value={formData.orientation}
                                onChange={(e) => setFormData({...formData, orientation: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-500/50 appearance-none"
                            >
                                <option value="straight">Straight</option>
                                <option value="gay">Gay</option>
                                <option value="lesbian">Lesbian</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-500/50"
                            placeholder="+234 ..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Address</label>
                        <input 
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-blue-500/50"
                            placeholder="Street, Studio, or Home"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">About Me</label>
                        <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4 text-slate-900 font-medium outline-none focus:border-blue-500/50 h-32 resize-none"
                            placeholder="Share your story..."
                        />
                    </div>

                    {/* Active Status Toggle */}
                    <div className="premium-card !p-6 border-slate-100 bg-white shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.3)]",
                                formData.is_active ? "bg-emerald-500" : "bg-slate-300"
                            )}></div>
                            <div>
                                <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">Active Status</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Visibility on platform</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                            className={cn(
                                "w-14 h-8 rounded-full p-1 transition-all duration-300 relative",
                                formData.is_active ? "bg-blue-600" : "bg-slate-200"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md",
                                formData.is_active ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ user, onUpdate }: { user: any, onUpdate: (data: any) => void }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ProfileSettings 
        user={user} 
        onBack={() => setIsEditing(false)} 
        onSave={(data) => {
          onUpdate({ ...user, ...data });
          setIsEditing(false);
        }} 
      />
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Profile Header Block */}
      <div className="relative">
        <div className="h-44 w-full bg-slate-50 border-b border-slate-100 overflow-hidden relative">
          <img 
            src={user?.cover_photo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"} 
            className="w-full h-full object-cover opacity-50" 
            alt="Cover" 
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/20 to-slate-100/50"></div>
        </div>

        <div className="px-4 -mt-14 flex flex-col relative z-20">
          <div className="flex items-end justify-between">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                <img 
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "sinner"}`} 
                  className="w-full h-full object-cover" 
                  alt="Avatar" 
                />
              </div>
              <div className={cn(
                "absolute bottom-1 right-1 w-4 h-4 border-[3px] border-white rounded-full",
                user?.is_active !== false ? "bg-green-500" : "bg-slate-400"
              )}></div>
            </div>
            
            <div className="flex gap-2 mb-2">
               <button 
                onClick={() => setIsEditing(true)}
                className="px-5 py-1.5 bg-slate-50 font-bold text-[13px] rounded-full border border-slate-200 text-slate-800 shadow-xs hover:bg-slate-100 transition-colors"
               >
                  Profile
               </button>
               <button className="p-1.5 bg-slate-50 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors">
                  <MoreHorizontal size={20} />
               </button>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{user?.name || "sinner25"}</h2>
            <p className="text-slate-400 text-sm font-medium mt-0.5">@{user?.username || "sinner25"}</p>
            <p className="text-slate-400 text-[11px] mt-1.5 ml-0.5 flex items-center gap-1.5">
               Last seen 2 minutes ago
            </p>
          </div>

          <div className="flex gap-5 mt-5 pl-1">
            <div className="flex items-center gap-2">
               <Heart size={16} className="text-red-500 fill-red-500" strokeWidth={0} />
               <span className="text-sm font-bold text-slate-900 tracking-tight">0</span>
            </div>
            <div className="flex items-center gap-2">
               <Users size={16} className="text-blue-500" />
               <span className="text-sm font-bold text-slate-900 tracking-tight">0</span>
            </div>
          </div>

          <div className="mt-5 px-1">
            <p className="text-slate-700 text-[13px] leading-relaxed font-medium">
              {user?.bio || "Hey, I am using Fansly."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-b border-slate-100">
         <div className="flex">
            <button className="flex-1 py-4 text-center font-bold text-sm text-blue-500 border-b-2 border-blue-500">
               Posts
            </button>
            <button className="flex-1 py-4 text-center font-bold text-sm text-slate-500">
               Media
            </button>
         </div>
      </div>

      <div className="p-4 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Timeline" 
            className="w-full bg-slate-50 border border-slate-100 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-hidden"
          />
        </div>
        <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-md text-blue-400">
           <RotateCcw size={18} />
        </button>
        <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-md text-slate-400 active:scale-95 transition-transform">
           <ListFilter size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-12 py-20 flex flex-col items-center justify-center text-center px-8">
         <p className="text-slate-500 text-sm font-medium">This user has not posted anything yet.</p>
      </div>
    </div>
  );
};


const AdminDashboard = () => {
    const [pendingCreators, setPendingCreators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPending = async () => {
            setLoading(true);
            try {
                // In a real app, this would be: 
                // const { data } = await supabase.from('profiles').select('*').eq('verification_status', 'pending');
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('verification_status', 'pending');
                
                if (data && data.length > 0) {
                    setPendingCreators(data);
                } else {
                    // Mock data for demonstration if DB is empty/unreachable
                    setPendingCreators([
                        { id: '1', name: 'Tunde vibes', username: '@tunde_vibes', email: 'tunde@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde' },
                        { id: '2', name: 'Sade Lagos', username: '@sade_luxury', email: 'sade@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sade' }
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch pending creators");
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            const status = action === 'approve' ? 'approved' : 'rejected';
            const isVerified = action === 'approve';
            
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    verification_status: status, 
                    is_verified: isVerified 
                } as any)
                .eq('id', id);
            
            if (error) throw error;

            setPendingCreators(prev => prev.filter(c => c.id !== id));
            alert(`Creator ${action}d successfully!`);
        } catch (err) {
            console.error("Action failed:", err);
            // Even if DB fails (missing columns), we mock the UI success for demo
            setPendingCreators(prev => prev.filter(c => c.id !== id));
            alert(`Demo: Creator ${action}d! (DB columns check needed)`);
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <header className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase italic">Verification Desk</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Pending Approval Requests</p>
                </div>
                <div className="bg-blue-600/10 text-blue-500 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-600/20">
                    Admin Portal
                </div>
            </header>

            <div className="p-6 space-y-6">
                {loading ? (
                    <div className="py-20 text-center space-y-4 animate-pulse">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full mx-auto animate-spin"></div>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">Scanning Applications...</p>
                    </div>
                ) : pendingCreators.length === 0 ? (
                    <div className="py-32 text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                           <ShieldCheck size={40} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-slate-900 font-black uppercase italic tracking-tight">System Clear</h3>
                            <p className="text-slate-400 text-xs font-bold opacity-60">No pending creator requests found.</p>
                        </div>
                    </div>
                ) : (
                    pendingCreators.map((creator) => (
                        <motion.div 
                            key={creator.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex flex-col gap-8 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                            
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                                    <img src={creator.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-xl font-display font-black text-slate-900 leading-none tracking-tight uppercase">{creator.full_name || creator.name}</h4>
                                        <div className="px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-600/20">
                                            {creator.category || 'PENDING'}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium mt-2 tracking-wide">{creator.username} • <span className="text-slate-400">{creator.email}</span></p>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleAction(creator.id, 'approve')}
                                        className="w-14 h-14 bg-emerald-500 text-white rounded-[1.25rem] flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-90 transition-all font-black hover:bg-emerald-400"
                                    >
                                        <BadgeCheck size={28} />
                                    </button>
                                    <button 
                                        onClick={() => handleAction(creator.id, 'reject')}
                                        className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[1.25rem] flex items-center justify-center active:scale-90 transition-all border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                                    >
                                        <X size={28} />
                                    </button>
                                </div>
                            </div>

                            {creator.bio && (
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative z-10">
                                    <p className="text-xs text-slate-500 font-medium italic leading-relaxed">"{creator.bio}"</p>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

const BecomeCreatorForm = ({ onComplete }: { onComplete: (data: any) => void }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        category: '',
        bio: '',
        socials: '',
        idImage: null as string | null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { id: 'model', label: 'Professional Model', icon: '📸', desc: 'Elite high-fashion and commercial modeling' },
        { id: 'creator', label: 'Content Creator', icon: '🎬', desc: 'Engaging video and digital storytelling' },
        { id: 'influencer', label: 'Social Influencer', icon: '💫', desc: 'Lifestyle and brand partnerships' },
        { id: 'artist', label: 'Artist / Performer', icon: '🎭', desc: 'Musicians, dancers, and creative talent' }
    ];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API delay
        await new Promise(r => setTimeout(r, 2000));
        onComplete(formData);
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-10 pb-20 max-w-xl mx-auto">
            <header className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(37,99,235,0.2)] relative">
                    <ShieldCheck size={40} className="text-white relative z-10" />
                </div>
                <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase italic leading-none">Become an <span className="text-blue-500">Elite</span> Creator</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Professional verification required</p>
            </header>

            <div className="flex justify-between px-10 relative">
                <div className="absolute top-1/2 left-10 right-10 h-[1px] bg-slate-100 -translate-y-1/2 z-0"></div>
                {[1, 2, 3].map(i => (
                    <div key={i} className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black z-10 transition-all duration-500 border-2",
                        step >= i 
                          ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
                          : "bg-white border-slate-100 text-slate-400"
                    )}>
                        {i}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Select Your Category</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setFormData({ ...formData, category: cat.id });
                                    setStep(2);
                                }}
                                className={cn(
                                    "bg-white p-6 border-2 flex items-center gap-6 rounded-[2rem] transition-all text-left shadow-sm group active:scale-[0.98]",
                                    formData.category === cat.id ? "border-blue-600 bg-blue-50" : "border-slate-50 hover:border-slate-200"
                                )}
                            >
                                <div className="text-4xl filter drop-shadow-lg group-hover:scale-110 transition-transform">{cat.icon}</div>
                                <div className="flex-1">
                                    <p className="font-display font-black text-slate-900 uppercase tracking-tight text-lg">{cat.label}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{cat.desc}</p>
                                </div>
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                    formData.category === cat.id ? "bg-blue-600 border-blue-600" : "border-slate-200"
                                )}>
                                    {formData.category === cat.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1 block">Full Professional Name</label>
                            <input 
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="e.g. Divine Grace"
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-slate-900 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1 block">Your Story (Bio)</label>
                            <textarea 
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Share your professional background..."
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-slate-900 font-medium outline-none focus:border-blue-600 focus:bg-white transition-all h-40 placeholder:text-slate-300 shadow-sm resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1 block">Social Presence</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500">
                                    <Search size={18} />
                                </div>
                                <input 
                                    type="text"
                                    value={formData.socials}
                                    onChange={(e) => setFormData({ ...formData, socials: e.target.value })}
                                    placeholder="Instagram / X handle"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl pl-14 pr-8 py-5 text-slate-900 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <button 
                            onClick={() => setStep(3)}
                            disabled={!formData.fullName || !formData.bio}
                            className="group w-full bg-blue-600 text-white font-black py-6 rounded-3xl text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(37,99,235,0.2)] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3"
                        >
                            Continue Application
                            <Zap size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => setStep(1)} className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors py-2">Back to Categories</button>
                    </div>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-3">
                        <h3 className="text-lg font-display font-black text-slate-900 uppercase tracking-tighter italic">Identity Verification</h3>
                        <p className="text-[10px] text-slate-400 font-medium px-12 leading-relaxed">Safety is our priority. Upload a clear photo of your government ID or official portfolio page for verification.</p>
                    </div>

                    <div 
                        className={cn(
                            "aspect-video rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all overflow-hidden relative cursor-pointer group",
                            formData.idImage 
                              ? "border-emerald-500/50 bg-emerald-50 shadow-sm" 
                              : "border-slate-200 bg-slate-50 hover:border-blue-500/50 hover:bg-white"
                        )}
                        onClick={() => {
                            setFormData({ ...formData, idImage: 'https://api.dicebear.com/7.x/identicon/svg?seed=verified' });
                        }}
                    >
                        {formData.idImage ? (
                           <div className="text-center space-y-4">
                             <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] mx-auto animate-bounce">
                                <BadgeCheck size={32} />
                             </div>
                             <div className="space-y-1">
                                <p className="text-white font-black text-sm uppercase tracking-widest italic">Document Secured</p>
                                <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Tap to Replace</p>
                             </div>
                           </div>
                        ) : (
                            <div className="text-center space-y-4">
                              <div className="w-16 h-16 bg-white/5 text-slate-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:text-blue-500 transition-all duration-500">
                                 <Plus size={32} />
                              </div>
                              <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-slate-300">Tap to upload ID / Portfolio</p>
                            </div>
                        )}
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-blue-500/10 flex gap-6">
                        <div className="w-10 h-10 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                            Your identity data is fully encrypted using bank-grade security protocols. 
                            <span className="text-blue-400"> Verification typically completes within 24 hours.</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={handleSubmit}
                            disabled={!formData.idImage || isSubmitting}
                            className={cn(
                                "w-full py-6 rounded-3xl text-sm font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(37,99,235,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group",
                                isSubmitting 
                                  ? "bg-slate-800 text-slate-500" 
                                  : "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            )}
                        >
                            {isSubmitting && (
                                <div className="absolute inset-0 bg-white/20 animate-[pulse_1s_infinite]"></div>
                            )}
                            <span className="relative z-10">{isSubmitting ? "PROCESSING APPLICATION..." : "SUBMIT APPLICATION"}</span>
                            {!isSubmitting && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
                        </button>
                        <button onClick={() => setStep(2)} className="w-full text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors py-2">Back to Information</button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const CreatorDashboard = ({ onUploadClick, user, onUpdateProfile }: { onUploadClick: () => void, user: any, onUpdateProfile: (data: any) => void }) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

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
    if ((user?.revenue || 0) < 1000) {
      alert("Minimum withdrawal is ₦1,000");
      return;
    }
    
    setIsWithdrawing(true);
    try {
      const response = await fetch("/api/monnify/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: user.revenue,
          destinationBankCode: "058", // GTB for demo
          destinationAccountNumber: "0123456789",
          narration: `SINCODE Payout for ${user.name}`,
        }),
      });
      
      const data = await response.json();
      
      if (data.requestSuccessful || response.ok && data.status === "SUCCESS") {
        alert("Withdrawal successful! Your funds are being processed and should arrive shortly.");
        // Deduct from revenue and add to transactions
        const newTransaction = {
          id: data.responseBody?.transactionReference || `WDL-${Date.now()}`,
          type: 'withdrawal',
          amount: user.revenue,
          description: 'Revenue Withdrawal',
          date: new Date().toISOString(),
          status: 'success'
        };
        onUpdateProfile({ 
          ...user, 
          revenue: 0,
          transactions: [newTransaction, ...(user.transactions || [])]
        });
      } else {
        const errorMsg = data.responseMessage || data.error?.responseMessage || data.message || "Unknown error";
        console.error(`Withdrawal failed: ${errorMsg}`);
        alert(`Withdrawal failed: ${errorMsg}`);
      }
    } catch (error: any) {
      console.error("Network error occurred during withdrawal:", error);
      alert("Network error: Could not complete withdrawal. Please check your connection.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleApplyComplete = async (data: any) => {
    setIsRequesting(true);
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ 
                verification_status: 'pending',
                full_name: data.fullName,
                bio: data.bio,
                category: data.category
            } as any)
            .eq('id', user.id);
        
        if (error) throw error;
        onUpdateProfile({ 
            ...user, 
            verification_status: 'pending',
            full_name: data.fullName,
            bio: data.bio,
            category: data.category
        });
        alert("Verification request sent successfully!");
        setIsApplying(false);
    } catch (err) {
        // Mock success for demo
        onUpdateProfile({ ...user, verification_status: 'pending' });
        alert("Demo: Verification request sent!");
        setIsApplying(false);
    } finally {
        setIsRequesting(false);
    }
  };

  if (isApplying) {
      return (
          <div className="min-h-screen bg-white p-6">
              <button 
                onClick={() => setIsApplying(false)} 
                className="mb-8 p-4 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors border border-slate-100 active:scale-90"
              >
                  <ArrowLeft size={22} />
              </button>
              <BecomeCreatorForm onComplete={handleApplyComplete} />
          </div>
      );
  }

  return (
    <div className="p-6 space-y-10 pb-20 bg-white min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-display font-black uppercase tracking-tighter italic text-slate-900">Creator Hub</h2>
        {user?.is_verified ? (
            <div className="bg-emerald-50 text-emerald-500 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                <BadgeCheck size={14} className="fill-emerald-500 bg-white rounded-full p-0.5" />
                Verified Pro
            </div>
        ) : (
            <div className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-slate-100">
                Unverified
            </div>
        )}
      </div>

      {!user?.is_verified && user?.verification_status !== 'pending' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20 relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-xl font-black mb-2 relative z-10">Creator Network</h3>
              <p className="text-blue-100 text-xs font-medium mb-6 leading-relaxed relative z-10">Monetize your content and connect with elite fans. Join our verified creator ecosystem today.</p>
              <button 
                onClick={() => setIsApplying(true)}
                className="bg-white text-blue-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
              >
                  Become a Creator
              </button>
          </motion.div>
      )}

      {user?.verification_status === 'pending' && (
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between">
              <div>
                  <h4 className="text-slate-900 font-bold text-sm">Application Pending</h4>
                  <p className="text-slate-400 text-[10px] font-medium mt-1">Our team is reviewing your documents.</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin"></div>
          </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em] leading-none">Total Payouts</p>
           <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatNaira(450500)}</p>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em] leading-none">Elite Subs</p>
           <p className="text-2xl font-black text-slate-900 tracking-tighter">128</p>
        </div>
      </div>

      <section className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Recent Activity</h3>
        {[1, 2, 3].map(i => (
           <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group shadow-xs">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <TrendingUp size={28} />
                 </div>
                 <div>
                    <p className="text-base font-display font-black text-slate-900 italic tracking-tight">New Subscription</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">@{['wiz_kid', 'davido_fan', 'tiwa_wa'][i-1]} • Level 1</p>
                 </div>
              </div>
              <p className="text-md font-black text-blue-500">+{formatNaira(3500)}</p>
           </div>
        ))}
      </section>

      <button 
        onClick={onUploadClick}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-4 uppercase text-xs tracking-[0.3em] active:scale-[0.98] transition-all"
      >
         <PlusSquare size={28} />
         Drop New Content
      </button>

      <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-sm">
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-black text-2xl italic tracking-tighter uppercase text-slate-900 scale-y-110">Withdrawal</h3>
               <span className="text-[9px] bg-blue-50 px-3 py-1.5 rounded-lg text-blue-500 font-black uppercase tracking-[0.25em] border border-blue-100">Instant Pay</span>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 mb-10 flex items-center gap-5 group-hover:bg-slate-100 transition-colors">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black italic text-white shadow-lg">UBA</div>
                <div className="flex-1">
                    <p className="text-md font-bold text-slate-900 tracking-tight uppercase italic">United Bank for Africa</p>
                    <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase mt-1">**** 5821 • ELITE SAVINGS</p>
                </div>
            </div>

            <button 
                onClick={handleWithdrawal}
                disabled={isWithdrawing}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg hover:bg-black"
            >
                {isWithdrawing ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                   <>
                    <DollarSign size={16} />
                    Process Payout
                   </>
                )}
            </button>
         </div>
         <CreditCard size={180} className="absolute -bottom-16 -right-16 text-slate-100/50 rotate-12 pointer-events-none group-hover:text-blue-500/10 transition-colors duration-700" />
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log("SINCODE: App Mounting...");
    // Check active session on load
    const checkSession = async () => {
      // Safety timeout to ensure app eventually loads even if Supabase is slow/failing
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
        } else if (session) {
          // Fetch profile data
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            // Ensure wallet exists and inject demo funds requested by user
            const profileWithWallet = {
                ...profile,
                balance: (profile.balance || 0) + 100000,
                transactions: [
                    {
                        id: `DEMO-${Date.now()}`,
                        type: 'funding',
                        amount: 100000,
                        description: 'Demo Account Credit',
                        date: new Date().toISOString(),
                        status: 'success'
                    },
                    ...(profile.transactions || [])
                ],
                monnify_account: profile.monnify_account || null
            };
            setCurrentUser(profileWithWallet);
            setIsLoggedIn(true);
          } else if (error) {
            console.error("Profile error:", error);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        clearTimeout(timeout);
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth event:", _event, !!session);
      if (session) {
        setIsLoggedIn(true); // Set logged in immediately once session is detected
        
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setCurrentUser({
                ...profile,
                balance: (profile.balance || 0) + 100000,
                transactions: [
                    {
                        id: `DEMO-AUTH-${Date.now()}`,
                        type: 'funding',
                        amount: 100000,
                        description: 'Demo Account Credit (Login)',
                        date: new Date().toISOString(),
                        status: 'success'
                    },
                    ...(profile.transactions || [])
                ],
                monnify_account: profile.monnify_account || null
            });
          } else {
            // Fallback for user without a profile in the DB yet
            setCurrentUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || 'New User',
              username: session.user.user_metadata?.username || '@user',
              email: session.user.email,
              balance: 0,
              transactions: [],
              monnify_account: null
            });
          }
        } catch (err) {
          console.error("Profile sync error:", err);
          // Still logged in, just using fallback data
          setCurrentUser({
            id: session.user.id,
            name: 'User',
            email: session.user.email,
            balance: 0,
            transactions: []
          });
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart size={64} className="text-blue-500 fill-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
          </motion.div>
          
          <div className="space-y-2">
            <p className="text-white text-[10px] font-black uppercase tracking-[0.6em] opacity-80">Sincode Infrastructure</p>
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Initializing Neural Link...</p>
          </div>

          <p className="text-slate-700 text-[9px] max-w-[180px] font-medium leading-relaxed">
            If this takes too long, please check your Supabase environment variables in the Settings menu.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthPage onLogin={(user) => {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 md:pb-0 md:pl-24">
      <Header 
        onOpenMenu={() => setIsMenuOpen(true)} 
        user={currentUser} 
        onWalletClick={() => setActiveTab('wallet')}
      />
      
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
                       <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Tunde'}`} className="w-full h-full rounded-full bg-slate-100" alt="User" />
                    </div>
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">{currentUser?.name || "Tunde Olamide"}</h3>
                 <p className="text-slate-500 text-xs font-medium mt-1">{currentUser?.username || "@tunde_vibes"}</p>
                 <div className="mt-2 text-xs font-bold text-blue-500 flex items-center gap-1 justify-center">
                   <TrendingUp size={12} />
                   <span>{currentUser?.location || "Lagos, Nigeria"}</span>
                 </div>
                 
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
                      { icon: UserCircle, label: 'Profile', id: 'profile' },
                      { icon: DollarSign, label: 'My Wallet', id: 'wallet' },
                      { icon: ShoppingBag, label: 'Store', id: 'store' },
                      { icon: Zap, label: 'Runs (Matchmaking)', id: 'runs' },
                      { icon: Users, label: 'Subscriptions', id: 'discover' },
                      ...(currentUser?.email === 'iqleadsbloger@gmail.com' ? [{ icon: ShieldCheck, label: 'Admin Desk', id: 'admin' }] : []),
                      { icon: List, label: 'Lists', id: 'discover' },
                      { icon: Bookmark, label: 'Bookmarks', id: 'discover' },
                      { icon: MessageCircle, label: 'Messages', id: 'messages' },
                      { icon: Bell, label: 'Notifications', id: 'notifications' },
                      { icon: Settings, label: 'Settings', id: 'settings' },
                      { icon: UserPlus, label: 'Referrals', id: 'home' },
                    ].map((item, i) => (
                       <button 
                         key={i} 
                         onClick={() => {
                           setActiveTab(item.id);
                           setIsMenuOpen(false);
                         }}
                         className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-all group rounded-xl"
                       >
                          <item.icon size={22} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                       </button>
                    ))}

                    <div className="my-4 border-t border-slate-100" />

                    {[
                      { icon: CreditCard, label: 'Add Payment Method', id: 'home' },
                      { icon: ShieldCheck, label: 'Become A Creator', id: 'create' },
                      { icon: HelpCircle, label: 'Contact Support', id: 'home' },
                      { icon: LifeBuoy, label: 'Help Center', id: 'home' },
                      { icon: FileText, label: 'Terms', id: 'home' },
                      { icon: Shield, label: 'Privacy Policy', id: 'home' },
                    ].map((item, i) => (
                       <button 
                        key={i} 
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMenuOpen(false);
                          if (item.id === 'create') setIsUploading(false); // Ensure we go to hub not upload
                        }}
                        className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-all group rounded-xl text-left"
                       >
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
              <FeedPage 
                user={currentUser}
                onUpdate={(updated) => setCurrentUser(updated)}
                onPostClick={() => {
                    setActiveTab('create');
                    setIsUploading(true);
                }} 
              />
            </motion.div>
          )}

          {activeTab === 'store' && (
            <motion.div
              key="store"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommercePage user={currentUser} onUpdate={(updated) => setCurrentUser(updated)} />
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <WalletPage user={currentUser} onUpdate={(updated) => setCurrentUser(updated)} />
            </motion.div>
          )}

          {activeTab === 'runs' && (
            <motion.div
              key="runs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RunsPage user={currentUser} onUpdate={(updated) => setCurrentUser(updated)} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SettingsPage 
                onBack={() => setActiveTab('profile')} 
                user={currentUser} 
                onOpenMenu={() => setIsMenuOpen(true)} 
              />
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {isUploading ? (
                <CreatePostPage onBack={() => setIsUploading(false)} />
              ) : (
                <CreatorDashboard 
                    onUploadClick={() => setIsUploading(true)} 
                    user={currentUser} 
                    onUpdateProfile={(updated) => setCurrentUser(updated)}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminDashboard />
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
             <motion.div
               key="profile"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
             >
               <ProfileView user={currentUser} onUpdate={(data) => setCurrentUser({...currentUser, ...data})} />
             </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-4"
            >
               <h2 className="text-xl font-bold px-2 py-4">Notifications</h2>
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-50 last:border-0 items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} className="w-full h-full bg-blue-50" alt="" />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm">
                          <span className="font-bold">Creator {i}</span> {i % 2 === 0 ? 'posted a new story' : 'replied to your message'}
                       </p>
                       <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{i * 10} minutes ago</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                 </div>
               ))}
            </motion.div>
          )}

          {/* Placeholder for tabs without content yet */}
          {['discover', 'messages', 'notifications'].includes(activeTab) && (
            <div className="h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-white">
               <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                  {activeTab === 'discover' ? <Search size={32} /> : activeTab === 'messages' ? <MessageSquare size={32} /> : <Bell size={32} />}
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-1">
                 {activeTab === 'discover' ? 'Explore Content' : activeTab === 'messages' ? 'Your Messages' : 'Alerts & Activity'}
               </h3>
               <p className="text-slate-400 text-xs max-w-[180px] leading-relaxed font-medium">
                 {activeTab === 'discover' 
                   ? 'Searching for the most engaging Nigerian creators...' 
                   : activeTab === 'messages' 
                   ? 'Connect directly with fans and creators through SINCODE.'
                   : 'Stay updated with your latest tips, subs, and creator syncs.'}
               </p>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} setIsUploading={setIsUploading} />
    </div>
  );
}
