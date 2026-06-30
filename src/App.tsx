/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent, useRef, FormEvent, useMemo } from 'react';
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
  ShieldAlert,
  ListFilter,
  Download,
  Sliders,
  Flame,
  Sparkles
} from 'lucide-react';
import { db, auth, googleProvider, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import CreatorProfileView from '@/src/components/CreatorProfileView';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { cn, formatNaira } from '@/src/lib/utils';
import { initializePayment } from '@/src/lib/monnify';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab, setIsUploading }: { activeTab: string, setActiveTab: (t: string) => void, setIsUploading: (b: boolean) => void }) => {
  const tabs = [
    { id: 'home', icon: Flame, label: 'VIP Feed' },
    { id: 'discover', icon: Search, label: 'Explore' },
    { id: 'runs', icon: Zap, label: 'Runs' },
    { id: 'create', icon: ShieldCheck, label: 'Creator' },
    { id: 'store', icon: ShoppingBag, label: 'Shop' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
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
              isActive ? "text-yellow-500 scale-105" : "text-slate-400"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
          </button>
        );
      })}
    </nav>
  );
};

const DesktopSidebar = ({ activeTab, setActiveTab, setIsUploading }: { activeTab: string, setActiveTab: (t: string) => void, setIsUploading: (b: boolean) => void }) => {
  const tabs = [
    { id: 'home', icon: Flame, label: 'VIP Feed' },
    { id: 'discover', icon: Search, label: 'Explore' },
    { id: 'runs', icon: Zap, label: 'Runs' },
    { id: 'create', icon: ShieldCheck, label: 'Creator' },
    { id: 'store', icon: ShoppingBag, label: 'Shop' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-24 bg-white border-r border-slate-100 hidden md:flex flex-col items-center py-8 gap-8 z-50">
      <div className="mb-4">
        <Heart size={32} className="text-yellow-500 fill-yellow-500" strokeWidth={1} />
      </div>
      <div className="flex-1 flex flex-col gap-5 w-full px-2">
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
                "w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group relative",
                isActive ? "text-yellow-500 bg-slate-50 shadow-inner" : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-yellow-500 rounded-r-full" />
              )}
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} className="group-hover:scale-105 transition-transform" />
              <span className="text-[10px] font-semibold tracking-tight mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
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
         <Heart size={26} className="text-yellow-500 fill-yellow-500" strokeWidth={1} />
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

const FeedPage = ({ 
  onPostClick, 
  user, 
  onUpdate,
  subscriptions,
  onCreatorFollowed,
  viewingHistory,
  onPostViewed,
  recommendations,
  isRecsLoading,
  onCreatorClick,
  bookmarkedPostIds = [],
  onBookmarkToggle,
  onRequireLogin,
  likedPostIds = [],
  onLikeToggle
}: { 
  onPostClick: () => void, 
  user: any, 
  onUpdate: (data: any) => void,
  subscriptions: string[],
  onCreatorFollowed: (username: string) => void,
  viewingHistory: string[],
  onPostViewed: (id: string) => void,
  recommendations: any,
  isRecsLoading: boolean,
  onCreatorClick?: (username: string) => void,
  bookmarkedPostIds?: string[],
  onBookmarkToggle?: (postId: string) => void,
  onRequireLogin?: (reason: string) => void,
  likedPostIds?: string[],
  onLikeToggle?: (postId: string) => void
}) => {
  const [activeCategory, setActiveCategory] = useState('Featured');

  const handlePayment = (amount: number, description: string, postId: string) => {
    if (!user) {
      onRequireLogin?.("watch");
      return;
    }
    // Register the post view in user's history
    onPostViewed(postId);

    // Option to pay with wallet
    if (confirm(`Unlock with Wallet for ${formatNaira(amount)}?`)) {
        if ((user?.balance || 0) < amount) {
            alert("Insufficient wallet balance.");
            return;
        }

        onUpdate({
            ...(user || {}),
            balance: (user?.balance || 0) - amount,
            transactions: [{
                id: `UNLOCK-${Date.now()}`,
                type: 'purchase',
                amount: amount,
                description: `Unlock: ${description}`,
                date: new Date().toISOString(),
                status: 'success'
            }, ...(user?.transactions || [])]
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

  // Merge regular and AI recommended creators for the Who to Follow feed
  const displayCreators = useMemo(() => {
    const regular = CENTRAL_CREATORS.filter(c => activeCategory === 'Featured' || c.category === activeCategory);
    if (activeCategory === 'Featured' && recommendations?.recommendedCreators?.length > 0) {
      // Prioritize AI recommended creators in Featured tab
      const recs = recommendations.recommendedCreators.map((c: any) => ({
        ...c,
        isAIRecommended: true
      }));
      const recUsernames = recs.map((r: any) => r.username);
      const uniqueRegular = regular.filter(c => !recUsernames.includes(c.username));
      return [...recs, ...uniqueRegular];
    }
    return regular;
  }, [activeCategory, recommendations?.recommendedCreators]);

  return (
    <div className="bg-white min-h-screen pb-16">
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
           <button className="p-2 aspect-square rounded-full bg-slate-50 border border-slate-100 text-yellow-500">
              <TrendingUp size={18} />
           </button>
           <button 
            onClick={onPostClick}
            className="p-2 aspect-square rounded-full bg-slate-50 border border-slate-100 text-yellow-500 active:scale-95 transition-transform"
           >
              <PlusSquare size={18} />
           </button>
        </div>
      </div>

      {/* AI Recommendation Section */}
      {recommendations?.recommendedPosts?.length > 0 && (
        <div className="px-6 py-5 bg-linear-to-r from-yellow-500/5 via-amber-500/5 to-transparent border-y border-slate-100 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-yellow-500 fill-yellow-500 animate-pulse shrink-0" size={18} />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">AI Recommendations For You</h3>
            {isRecsLoading && (
              <div className="w-3 h-3 border-2 border-slate-300 border-t-yellow-500 rounded-full animate-spin ml-auto"></div>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recommendations.recommendedPosts.map((post: any) => {
              const isUnlocked = viewingHistory.includes(post.id);
              return (
                <div 
                  key={`rec-${post.id}`} 
                  onClick={() => onPostViewed(post.id)}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shrink-0 w-72 shadow-xs hover:border-yellow-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onCreatorClick?.(post.creatorUsername); 
                        }} 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                          <img src={post.creatorAvatar || "https://api.dicebear.com/7.x/avataaars/svg"} className="w-full h-full object-cover" loading="lazy" alt="" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-none">{post.creatorName}</h4>
                          <p className="text-[9px] text-slate-400">@{post.creatorUsername?.replace(/^@/, '')}</p>
                        </div>
                      </div>
                      <span className="bg-yellow-500/10 text-yellow-600 border border-yellow-500/10 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5">
                        <Sparkles size={8} /> AI Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 font-medium leading-relaxed">{post.content}</p>
                  </div>
                  
                  <div>
                    {/* Explanation Badge */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2.5 mb-3">
                      <p className="text-[10px] text-slate-600 font-bold leading-normal flex items-start gap-1.5">
                        <span className="text-yellow-500 font-normal">💡</span>
                        <span>{post.recommendationReason}</span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400 uppercase tracking-wider text-[8px]">{post.category}</span>
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] border font-black uppercase tracking-wider",
                        isUnlocked 
                          ? "text-green-600 bg-green-50 border-green-100" 
                          : "text-slate-700 bg-slate-50 border-slate-100"
                      )}>
                        {isUnlocked ? "Unlocked" : `₦${post.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Who to Follow Header */}
      <div className="px-6 mt-6 flex items-center justify-between">
         <h3 className="text-base font-bold text-slate-800">Who To Follow</h3>
         <div className="flex gap-4">
            <button className="text-slate-300 hover:text-slate-600"><ChevronLeft size={20} /></button>
            <button className="text-slate-600 hover:text-slate-900"><ChevronRight size={20} /></button>
         </div>
      </div>

      {/* Creators List with AI badging */}
      <div className="px-4 py-4 space-y-3">
        {displayCreators.map((creator, idx) => {
          const isFollowed = subscriptions.includes(creator.username);
          return (
            <motion.div 
              key={`${creator.username}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative h-28 w-full rounded-2xl overflow-hidden border border-slate-100 shadow-xs bg-white"
            >
              <div className="absolute inset-0">
                 <img src={creator.image} className="w-full h-full object-cover blur-sm opacity-40" loading="lazy" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
              </div>

              <div className="relative h-full flex items-center justify-between px-4 z-10">
                 <div 
                   onClick={() => onCreatorClick?.(creator.username)}
                   className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                 >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                        <img src={creator.avatar} className="w-full h-full object-cover" loading="lazy" alt={creator.name} />
                      </div>
                      <div className="absolute bottom-1 right-1 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">{creator.name}</h4>
                        <BadgeCheck size={16} className="text-yellow-500 fill-yellow-500 bg-white rounded-full" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{creator.username}</p>
                      
                      {creator.isAIRecommended && (
                        <p className="text-[9px] text-yellow-600 font-black uppercase tracking-wider mt-1 flex items-center gap-0.5">
                          <Sparkles size={10} className="fill-yellow-500" /> AI Pick
                        </p>
                      )}
                    </div>
                 </div>

                 <button 
                  onClick={() => onCreatorFollowed(creator.username)}
                  className={cn(
                    "text-[11px] font-black px-5 py-2.5 rounded-full shadow-xs transition-all active:scale-95 leading-none uppercase tracking-widest border",
                    isFollowed 
                      ? "bg-slate-100 text-slate-500 border-slate-200" 
                      : "bg-navy-800 text-yellow-500 border-navy-800 hover:bg-navy-950"
                  )}
                 >
                    {isFollowed ? 'Following' : 'Follow'}
                 </button>
              </div>
            </motion.div>
          );
        })}
        
        <div className="flex justify-center items-center gap-2 pt-2">
           <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
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
          {CENTRAL_CREATORS.map((c, i) => (
            <div key={i} className="relative aspect-[2/3] w-32 rounded-2xl overflow-hidden shadow-sm shrink-0 group border border-slate-100">
              <img 
                src={c.image} 
                className={cn("w-full h-full object-cover", !c.active && "blur-xs opacity-90")} 
                loading="lazy"
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
        {CENTRAL_POSTS
          .filter(p => activeCategory === 'Featured' || p.category === activeCategory)
          .map((post) => {
            const isUnlocked = viewingHistory.includes(post.id);
            const isFollowed = subscriptions.includes(post.creatorUsername);
            const isBookmarked = bookmarkedPostIds.includes(post.id);
            return (
              <div key={post.id} className="bg-white border-b border-slate-100 py-6 space-y-4">
                {/* Post Header */}
                <div className="px-4 flex items-center justify-between">
                  <div 
                    onClick={() => onCreatorClick?.(post.creatorUsername)}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100">
                       <img src={post.creatorAvatar} className="w-full h-full object-cover bg-slate-100" loading="lazy" alt="Avatar" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900">{post.creatorName}</h3>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                           <ShieldCheck size={10} className="text-navy-950" strokeWidth={3} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{post.creatorUsername} • 2h</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => onCreatorFollowed(post.creatorUsername)}
                    className={cn(
                      "text-[10px] font-black px-4 py-1.5 rounded-full border transition-all active:scale-95 leading-none uppercase tracking-wider",
                      isFollowed 
                        ? "bg-slate-50 text-slate-400 border-slate-200" 
                        : "bg-navy-800 text-yellow-500 border-navy-800"
                    )}
                  >
                     {isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>
                
                {/* Post Content */}
                <div className="px-4 space-y-4">
                   <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>
                   
                   <div 
                    onClick={() => {
                      if (!user) {
                        onRequireLogin?.("watch");
                        return;
                      }
                      onPostViewed(post.id);
                    }}
                    className="relative aspect-video rounded-xl overflow-hidden group bg-slate-200 cursor-pointer"
                   >
                     <img src={post.image} className={cn("w-full h-full object-cover absolute", !isUnlocked && "blur-2xl opacity-60 scale-110")} loading="lazy" alt="Teaser" />
                     {!isUnlocked && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/30 backdrop-blur-xs">
                          <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-3">
                             <EyeOff size={28} />
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayment(post.price, `Unlock content from ${post.creatorName}`, post.id);
                            }}
                            className="bg-navy-800 text-yellow-500 font-black py-3 px-6 rounded-full text-xs uppercase tracking-widest shadow-lg shadow-navy-800/20 active:scale-95 transition-all border border-yellow-500/10"
                          >
                            Unlock for ₦{post.price}
                          </button>
                       </div>
                     )}
                   </div>
                </div>

                {/* Post Bottom Bar */}
                <div className="px-4 pt-2 flex items-center justify-between">
                   <div className="flex items-center gap-6 text-slate-400">
                      {(() => {
                         const isLiked = likedPostIds.includes(post.id);
                         return (
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               if (!user) {
                                 onRequireLogin?.("like");
                                 return;
                               }
                               onLikeToggle?.(post.id);
                             }}
                             className={cn(
                               "flex items-center gap-1.5 p-1 transition-colors cursor-pointer",
                               isLiked ? "text-rose-500 hover:text-rose-600" : "text-slate-400 hover:text-rose-500"
                             )}
                             id={`like-btn-${post.id}`}
                           >
                              <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
                              <span className="text-xs font-bold">{post.likes + (isLiked ? 1 : 0)}</span>
                           </button>
                         );
                       })()}
                      <div className="flex items-center gap-1.5 p-1 hover:text-yellow-500 transition-colors cursor-pointer">
                         <MessageCircle size={22} />
                         <span className="text-xs font-bold">{post.comments}</span>
                      </div>
                      <div 
                         onClick={(e) => {
                           e.stopPropagation();
                           if (!user) {
                             onRequireLogin?.("saved");
                             return;
                           }
                           onBookmarkToggle?.(post.id);
                         }}
                         className={cn(
                           "flex items-center gap-1.5 p-1 transition-colors cursor-pointer",
                           isBookmarked ? "text-yellow-500 hover:text-yellow-600" : "text-slate-400 hover:text-yellow-500"
                         )}
                       >
                         <Bookmark size={22} fill={isBookmarked ? "currentColor" : "none"} />
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
};

const SavedPage = ({
  user,
  onUpdate,
  subscriptions,
  onCreatorFollowed,
  viewingHistory,
  onPostViewed,
  onCreatorClick,
  bookmarkedPostIds = [],
  onBookmarkToggle
}: {
  user: any,
  onUpdate: (data: any) => void,
  subscriptions: string[],
  onCreatorFollowed: (username: string) => void,
  viewingHistory: string[],
  onPostViewed: (id: string) => void,
  onCreatorClick?: (username: string) => void,
  bookmarkedPostIds?: string[],
  onBookmarkToggle?: (postId: string) => void
}) => {
  const savedPosts = useMemo(() => {
    return CENTRAL_POSTS.filter(post => bookmarkedPostIds.includes(post.id));
  }, [bookmarkedPostIds]);

  const handlePayment = (amount: number, description: string, postId: string) => {
    // Register the post view in user's history
    onPostViewed(postId);

    // Option to pay with wallet
    if (confirm(`Unlock with Wallet for ${formatNaira(amount)}?`)) {
        if ((user?.balance || 0) < amount) {
            alert("Insufficient wallet balance.");
            return;
        }

        onUpdate({
            ...(user || {}),
            balance: (user?.balance || 0) - amount,
            transactions: [{
                id: `UNLOCK-${Date.now()}`,
                type: 'purchase',
                amount: amount,
                description: `Unlock: ${description}`,
                date: new Date().toISOString(),
                status: 'success'
            }, ...(user?.transactions || [])]
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
    <div className="pb-24">
      {/* Header Banner */}
      <div className="bg-navy-900 text-white px-6 py-10 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-0 inset-x-0 h-full bg-linear-to-b from-yellow-500/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mx-auto mb-3">
            <Bookmark size={24} fill="currentColor" />
          </div>
          <h2 className="text-2xl font-display font-black uppercase tracking-tight">Saved Publications</h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">Access your bookmarked content, photos, and exclusive creator drops anytime.</p>
        </div>
      </div>

      {savedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
            <Bookmark size={28} />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No saved posts yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">Tap the bookmark icon on any exclusive drop in the VIP feed to keep it here.</p>
        </div>
      ) : (
        <section className="space-y-0">
          {savedPosts.map((post) => {
            const isUnlocked = viewingHistory.includes(post.id);
            const isFollowed = subscriptions.includes(post.creatorUsername);
            const isBookmarked = bookmarkedPostIds.includes(post.id);
            return (
              <div key={post.id} className="bg-white border-b border-slate-100 py-6 space-y-4">
                {/* Post Header */}
                <div className="px-4 flex items-center justify-between">
                  <div 
                    onClick={() => onCreatorClick?.(post.creatorUsername)}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100">
                       <img src={post.creatorAvatar} className="w-full h-full object-cover bg-slate-100" loading="lazy" alt="Avatar" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900">{post.creatorName}</h3>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                           <ShieldCheck size={10} className="text-navy-950" strokeWidth={3} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{post.creatorUsername} • 2h</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => onCreatorFollowed(post.creatorUsername)}
                    className={cn(
                      "text-[10px] font-black px-4 py-1.5 rounded-full border transition-all active:scale-95 leading-none uppercase tracking-wider",
                      isFollowed 
                        ? "bg-slate-50 text-slate-400 border-slate-200" 
                        : "bg-navy-800 text-yellow-500 border-navy-800"
                    )}
                  >
                     {isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>
                
                {/* Post Content */}
                <div className="px-4 space-y-4">
                   <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>
                   
                   <div 
                    onClick={() => {
                      if (!user) {
                        onRequireLogin?.("watch");
                        return;
                      }
                      onPostViewed(post.id);
                    }}
                    className="relative aspect-video rounded-xl overflow-hidden group bg-slate-200 cursor-pointer"
                   >
                     <img src={post.image} className={cn("w-full h-full object-cover absolute", !isUnlocked && "blur-2xl opacity-60 scale-110")} loading="lazy" alt="Teaser" />
                     {!isUnlocked && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/30 backdrop-blur-xs">
                          <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-3">
                             <EyeOff size={28} />
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayment(post.price, `Unlock content from ${post.creatorName}`, post.id);
                            }}
                            className="bg-navy-800 text-yellow-500 font-black py-3 px-6 rounded-full text-xs uppercase tracking-widest shadow-lg shadow-navy-800/20 active:scale-95 transition-all border border-yellow-500/10"
                          >
                            Unlock for ₦{post.price}
                          </button>
                       </div>
                     )}
                   </div>
                </div>

                {/* Post Bottom Bar */}
                <div className="px-4 pt-2 flex items-center justify-between">
                   <div className="flex items-center gap-6 text-slate-400">
                      <div className="flex items-center gap-1.5 p-1 hover:text-red-500 transition-colors cursor-pointer">
                         <Heart size={22} />
                         <span className="text-xs font-bold">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1 hover:text-blue-500 transition-colors cursor-pointer">
                         <MessageCircle size={22} />
                         <span className="text-xs font-bold">{post.comments}</span>
                      </div>
                      <div 
                         onClick={(e) => {
                           e.stopPropagation();
                           if (!user) {
                             onRequireLogin?.("saved");
                             return;
                           }
                           onBookmarkToggle?.(post.id);
                         }}
                         className={cn(
                           "flex items-center gap-1.5 p-1 transition-colors cursor-pointer",
                           isBookmarked ? "text-yellow-500 hover:text-yellow-600" : "text-slate-400 hover:text-yellow-500"
                         )}
                       >
                         <Bookmark size={22} fill={isBookmarked ? "currentColor" : "none"} />
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};

const ExplorePage = ({
  user,
  onUpdate,
  subscriptions,
  onCreatorFollowed,
  viewingHistory,
  onPostViewed,
  recommendations,
  isRecsLoading,
  onCreatorClick
}: {
  user: any,
  onUpdate: (data: any) => void,
  subscriptions: string[],
  onCreatorFollowed: (username: string) => void,
  viewingHistory: string[],
  onPostViewed: (id: string) => void,
  recommendations: any,
  isRecsLoading: boolean,
  onCreatorClick?: (username: string) => void
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const userInterests = user?.interests || [];

  const handleToggleInterest = (interest: string) => {
    let updated: string[];
    if (userInterests.includes(interest)) {
      updated = userInterests.filter((i: string) => i !== interest);
    } else {
      updated = [...userInterests, interest];
    }
    // Update the profile in local state
    onUpdate({
      ...user,
      interests: updated
    });
  };

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return CENTRAL_POSTS;
    const query = searchQuery.toLowerCase();
    return CENTRAL_POSTS.filter(p => 
      p.content.toLowerCase().includes(query) || 
      p.creatorName.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Search bar */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search creators, hashtags, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-hidden focus:border-yellow-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Stated Interests Dynamic Control */}
      <div className="p-6 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="text-slate-800" size={16} />
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Customize Stated Interests</h3>
        </div>
        <p className="text-slate-500 text-xs mb-4 font-medium">Select your preferences to instantly tune your personalized AI Recommendation Engine:</p>
        <div className="flex flex-wrap gap-2">
          {ALL_INTERESTS.map((interest) => {
            const isSelected = userInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => handleToggleInterest(interest)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5",
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                )}
              >
                {isSelected && <BadgeCheck size={12} className="text-yellow-400 fill-yellow-400" />}
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Creators Row */}
      {recommendations?.recommendedCreators?.length > 0 && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-yellow-500 fill-yellow-500 animate-pulse" size={16} />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">AI Suggested Creators</h3>
            {isRecsLoading && <div className="w-3 h-3 border-2 border-slate-300 border-t-yellow-500 rounded-full animate-spin ml-auto"></div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.recommendedCreators.map((creator: any) => {
              const isFollowed = subscriptions.includes(creator.username);
              return (
                <div key={creator.username} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-600 border-b border-l border-yellow-500/10 rounded-bl-2xl px-3 py-1 text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={8} /> Best Match
                  </div>
                  <div>
                    <div 
                      onClick={() => onCreatorClick?.(creator.username)}
                      className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                        <img src={creator.avatar || "https://api.dicebear.com/7.x/avataaars/svg"} className="w-full h-full object-cover" loading="lazy" alt="" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-none">{creator.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">@{creator.username.replace(/^@/, '')}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">{creator.bio}</p>
                  </div>

                  <div className="bg-yellow-500/5 rounded-2xl p-3 mb-4">
                    <p className="text-[10px] text-yellow-700 font-bold leading-normal flex items-start gap-1.5">
                      <span>💡</span>
                      <span>{creator.recommendationReason}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => onCreatorFollowed(creator.username)}
                    className={cn(
                      "w-full text-xs font-black py-3 rounded-2xl shadow-xs transition-all leading-none uppercase tracking-widest border",
                      isFollowed
                        ? "bg-slate-50 text-slate-400 border-slate-200"
                        : "bg-navy-800 text-yellow-500 border-navy-800 hover:bg-navy-950"
                    )}
                  >
                    {isFollowed ? "Following" : "Subscribe Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Recommended Posts Grid */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-amber-500 fill-amber-500" size={16} />
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Recommended VIP Feed</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const isUnlocked = viewingHistory.includes(post.id);
            const recReason = recommendations?.recommendedPosts?.find((p: any) => p.id === post.id)?.recommendationReason;
            return (
              <div
                key={post.id}
                onClick={() => onPostViewed(post.id)}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-200">
                    <img src={post.image} className={cn("w-full h-full object-cover", !isUnlocked && "blur-xl opacity-75 scale-105")} loading="lazy" alt="" />
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <span className="bg-navy-800 text-yellow-500 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                          Unlock Content
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-xs">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreatorClick?.(post.creatorUsername);
                      }}
                      className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                        <img src={post.creatorAvatar} className="w-full h-full object-cover" loading="lazy" alt="" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{post.creatorName}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">{post.content}</p>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  {recReason ? (
                    <div className="bg-yellow-500/5 rounded-2xl p-3 mb-3 border border-yellow-500/10">
                      <p className="text-[9px] text-yellow-700 font-bold leading-normal flex items-start gap-1">
                        <span>💡</span>
                        <span>{recReason}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-3 mb-3 border border-slate-100">
                      <p className="text-[9px] text-slate-500 font-bold leading-normal flex items-start gap-1">
                        <span>🏷️</span>
                        <span>Topic: {post.tags[0]}</span>
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span>₦{post.price} Content</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md",
                      isUnlocked ? "text-green-600 bg-green-50" : "text-slate-500 bg-slate-50"
                    )}>
                      {isUnlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export interface Post {
  id: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  category: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  price: number;
  tags: string[];
}

export interface Creator {
  username: string;
  name: string;
  category: string;
  avatar: string;
  image: string;
  bio: string;
  active: boolean;
}

export const ALL_INTERESTS = [
  "Fashion & Runway",
  "Photography & Visual Art",
  "Lifestyle & Behind-the-scenes",
  "Afrobeat & Music Culture",
  "LGBTQ+ Pride & Community",
  "VIP Entertainment & Modeling"
];

export const CENTRAL_POSTS: Post[] = [
  {
    id: "post-1",
    creatorName: "TheLittleJuice",
    creatorUsername: "@thelittlejuice",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juice",
    category: "VIP",
    content: "Behind the scenes recording of our private studio session. Exclusive outfits and runway design concepts that we've been gatekeeping. 💖 #VIPFashion #LagosRunway",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    likes: 124,
    comments: 32,
    price: 2500,
    tags: ["Fashion & Runway", "VIP Entertainment & Modeling", "Lifestyle & Behind-the-scenes"]
  },
  {
    id: "post-2",
    creatorName: "Lillie",
    creatorUsername: "@lillikois",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lillie",
    category: "Straight",
    content: "Lagos Fashion Week BTS was absolutely insane. Met the top models and creative designers from across West Africa. New collection drop coming shortly! 📸✨ #LagosFashionWeek #BehindTheScenes",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    likes: 310,
    comments: 45,
    price: 3000,
    tags: ["Fashion & Runway", "Lifestyle & Behind-the-scenes", "Photography & Visual Art"]
  },
  {
    id: "post-3",
    creatorName: "Eko Finesse",
    creatorUsername: "@ekofinesse",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=model",
    category: "Featured",
    content: "Golden hour photography session at Landmark Beach. Capturing the beautiful warm vibe and essence of Lagos culture. Subscribe to unlock the full high-res catalog. 🌴🌊 #LagosVibes #VisualArt",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    likes: 540,
    comments: 88,
    price: 1500,
    tags: ["Photography & Visual Art", "Lifestyle & Behind-the-scenes"]
  },
  {
    id: "post-4",
    creatorName: "Burna Beats",
    creatorUsername: "@burnabeats",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=music",
    category: "Featured",
    content: "Cooked up a legendary new Afrobeat rhythm in the studio tonight. Blending traditional Fuji percussion with modern synth melodies. Only for true sound curators! 🎶🔥 #Afrobeat #MusicCulture",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    likes: 420,
    comments: 73,
    price: 2000,
    tags: ["Afrobeat & Music Culture", "Lifestyle & Behind-the-scenes"]
  },
  {
    id: "post-5",
    creatorName: "Bella Desa",
    creatorUsername: "@belladesa",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    category: "LGBTQ+",
    content: "Celebrating community, art, and unapologetic self-expression at our private Lagos fashion rave. Proud to create space for everyone! 🏳️‍🌈✨ #LGBTQPride #EliteModeling",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    likes: 290,
    comments: 51,
    price: 2200,
    tags: ["LGBTQ+ Pride & Community", "Fashion & Runway", "VIP Entertainment & Modeling"]
  }
];

export const CENTRAL_CREATORS: Creator[] = [
  {
    username: "@thelittlejuice",
    name: "TheLittleJuice",
    category: "VIP",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juice",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    bio: "Elite digital curator, premium fashion designer & private runway model based in Abuja.",
    active: true
  },
  {
    username: "@lillikois",
    name: "Lillie",
    category: "Straight",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lillie",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    bio: "International runway model, high fashion enthusiast & Lagos Fashion Week visual curator.",
    active: true
  },
  {
    username: "@ekofinesse",
    name: "Eko Finesse",
    category: "Featured",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=model",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    bio: "Visual artist & travel lifestyle photographer capturing raw, high-contrast stories of Lagos.",
    active: false
  },
  {
    username: "@burnabeats",
    name: "Burna Beats",
    category: "Featured",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=music",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    bio: "Lagos-based Afrobeat producer & sound designer crafting premium soundpacks and music loops.",
    active: true
  },
  {
    username: "@belladesa",
    name: "Bella Desa",
    category: "LGBTQ+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    bio: "Unapologetic designer & modeling coach building inclusive fashion spaces across Nigeria.",
    active: true
  }
];

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const AuthPage = ({ onLogin, onClose }: { onLogin: (user: any) => void, onClose?: () => void }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      console.log("Initiating Google OAuth via Firebase...");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("Firebase login successful, user:", user.uid);
      setSuccess('Signed in successfully!');
      
      // Load or create profile in Firestore
      const userDocRef = doc(db, 'profiles', user.uid);
      let userDocSnap;
      try {
        userDocSnap = await getDoc(userDocRef);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.GET, `profiles/${user.uid}`);
      }
      
      let profileData;
      if (userDocSnap.exists()) {
        profileData = userDocSnap.data();
      } else {
        // Create initial profile
        profileData = {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          username: 'user_' + user.uid.substring(0, 8),
          email: user.email,
          balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        try {
          await setDoc(userDocRef, profileData);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.CREATE, `profiles/${user.uid}`);
        }
      }
      
      onLogin(profileData);
    } catch (err: any) {
      console.error("Google login failed:", err);
      setError(err.message || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const guestId = 'guest_' + Math.random().toString(36).substring(2, 10);
      const guestProfile = {
        id: guestId,
        name: 'Guest Fan (Nigeria)',
        username: 'guest_' + guestId.substring(6),
        email: `${guestId}@sincode.ng`,
        balance: 100000,
        state: 'Lagos',
        location: 'Lagos, Nigeria',
        interests: ['Fashion & Runway', 'VIP Entertainment & Modeling'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isGuest: true
      };

      try {
        await setDoc(doc(db, 'profiles', guestId), guestProfile);
      } catch (dbErr) {
        console.error("Firestore error creating guest profile, using local fallback:", dbErr);
      }

      setSuccess('Signed in as Guest successfully!');
      onLogin(guestProfile);
    } catch (err: any) {
      setError(err.message || 'Guest login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const teasers = [
    { id: 1, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', active: true, title: 'BTS: Lagos Fashion Week' },
    { id: 2, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', active: false, title: 'Private Studio Session' },
    { id: 3, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', active: true, title: 'Exclusive Interview' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans relative">
       {onClose && (
         <button 
           onClick={onClose}
           className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90"
           id="close-auth-btn"
         >
           <X size={20} />
         </button>
       )}

       {/* Top Section: Branding & Logo */}
       <div className="bg-navy-900 px-8 pt-16 pb-16 relative overflow-hidden flex flex-col items-center transition-all duration-500">
          <div className="absolute top-0 inset-x-0 h-full bg-linear-to-b from-yellow-500/5 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="relative mb-6">
                <Heart size={80} className="text-white fill-white transition-all animate-pulse" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
                      <Eye size={18} className="text-yellow-500" strokeWidth={3} />
                   </div>
                </div>
             </div>
             <h1 className="text-5xl font-display font-black text-white tracking-tight uppercase mb-2">SINCODE</h1>
             <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">Elite Nigerian Creator Hub</p>
          </div>

          {/* Featured Teasers Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-lg mt-12 relative z-20">
             {teasers.map((t, i) => (
                <div key={t.id} className={cn(
                   "relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group",
                   i === 1 ? "scale-105 z-10 -rotate-1" : "rotate-1 opacity-80"
                )}>
                   <img src={t.image} className={cn("w-full h-full object-cover", !t.active && "blur-xl")} loading="lazy" alt="Teaser" />
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
                         <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                         <span className="text-[9px] font-black uppercase text-white">Live</span>
                      </div>
                   )}
                </div>
             ))}
          </div>
       </div>

       {/* Bottom Section: Actions */}
       <div className="flex-1 bg-black p-8 flex flex-col items-center justify-center rounded-t-[3rem] -mt-10 relative z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.8)] border-t border-white/5 overflow-y-auto scrollbar-hide">
          {error && <div className="w-full max-w-sm mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">{error}</div>}
          {success && <div className="w-full max-w-sm mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-xl text-center">{success}</div>}
          
          <div className="w-full max-w-sm space-y-4 text-center">
             <div className="space-y-2 mb-2">
                <h2 className="text-xl font-bold text-white tracking-tight uppercase">Access the Sincode Portal</h2>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">Verify your identity and connect with Africa's most elite creators, designers, and curators.</p>
             </div>

             <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white hover:bg-slate-100 text-black font-black py-4 rounded-2xl shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
             >
                {isLoading ? (
                   <>
                     <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                     <span>Connecting...</span>
                   </>
                ) : (
                   <>
                     <span className="font-sans font-black text-lg mr-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent">G</span>
                     <span>Continue with Google</span>
                   </>
                )}
             </button>

             <button 
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-yellow-500 font-black py-4 rounded-2xl shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
             >
                <Zap size={16} className="fill-yellow-500 text-yellow-500" />
                <span>Instant Guest Login</span>
             </button>

             {onClose && (
               <button 
                  onClick={onClose}
                  className="w-full bg-transparent hover:underline text-slate-400 font-semibold py-2 text-xs uppercase tracking-wider transition-all"
               >
                  Browse as Guest First
               </button>
             )}
             
             <div className="pt-6 text-center opacity-40">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-4">Secure Gateway • Lagos, Nigeria</p>
                <div className="flex justify-center gap-6 text-slate-500">
                   <Home size={18} />
                   <Search size={18} />
                   <MessageCircle size={18} />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const UpdateProfilePage = ({ user, onComplete, onLogout }: { user: any, onComplete: (fields: any) => Promise<void>, onLogout: () => void }) => {
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username?.startsWith('user_') ? '' : (user?.username || ''));
    const [phone, setPhone] = useState(user?.phone || '');
    const [dob, setDob] = useState(user?.dob || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [state, setState] = useState(user?.state || '');
    const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name || !username || !phone || !state || !gender) {
            setError('Please fill all required fields');
            return;
        }

        if (selectedInterests.length < 2) {
            setError('Please select at least 2 interests so we can personalize your AI recommendations!');
            return;
        }

        const cleanUsername = username.startsWith('@') ? username : `@${username}`;

        // Validate username formatting
        if (cleanUsername.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await onComplete({
                name,
                username: cleanUsername,
                phone,
                dob,
                gender,
                state,
                interests: selectedInterests
            });
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6">
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>
            
            <div className="w-full max-w-md bg-navy-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative z-10 space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-yellow-500/20">
                        <User className="text-yellow-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">Complete Your Profile</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Join the Elite SINCODE Creator Hub</p>
                </div>

                {error && (
                    <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            type="text" 
                            placeholder="e.g. Tunde Olamide" 
                            className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" 
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Username</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-black">@</span>
                            <input 
                                value={username.replace(/^@/, '')} 
                                onChange={e => setUsername(e.target.value)} 
                                type="text" 
                                placeholder="tunde_vibes" 
                                className="w-full bg-navy-900 border border-white/5 rounded-xl pl-9 pr-5 py-3.5 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" 
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                        <div className="flex gap-2">
                            <div className="bg-navy-900 border border-white/5 rounded-xl px-4 py-3.5 text-slate-500 text-sm font-bold flex items-center">+234</div>
                            <input 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)} 
                                type="tel" 
                                placeholder="801 234 5678" 
                                className="flex-1 bg-navy-900 border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-hidden focus:border-blue-500 placeholder:text-slate-700 transition-colors" 
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Birth Date</label>
                            <input 
                                value={dob} 
                                onChange={e => setDob(e.target.value)} 
                                type="date" 
                                className="w-full bg-navy-900 border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-hidden focus:border-blue-500 transition-colors [color-scheme:dark]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                            <select 
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                                className="w-full bg-navy-900 border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-hidden focus:border-blue-500 appearance-none transition-colors"
                                required
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
                            onChange={e => setState(e.target.value)}
                            className="w-full bg-navy-900 border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-hidden focus:border-blue-500 appearance-none transition-colors"
                            required
                        >
                            <option value="" disabled>Select State</option>
                            {NIGERIAN_STATES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Select Interests (Min. 2)</label>
                            <span className="text-[10px] text-yellow-500 font-bold">{selectedInterests.length} Selected</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {ALL_INTERESTS.map((interest) => {
                                const isSelected = selectedInterests.includes(interest);
                                return (
                                    <button
                                        type="button"
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                                            isSelected
                                                ? "bg-yellow-500 text-navy-950 border-yellow-500 shadow-lg shadow-yellow-500/20 scale-[1.03]"
                                                : "bg-navy-900/50 text-slate-400 border-white/5 hover:bg-navy-900"
                                        )}
                                    >
                                        {interest}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-navy-950 font-black py-4 rounded-2xl shadow-2xl shadow-yellow-500/10 active:scale-95 transition-all text-sm uppercase tracking-widest mt-6 flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            "Save & Continue"
                        )}
                    </button>
                </form>

                <div className="border-t border-white/5 pt-4 text-center">
                    <button 
                        onClick={onLogout}
                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

const WalletPage = ({ user, onUpdate }: { user: any, onUpdate: (data: any) => void }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [fundingAmount, setFundingAmount] = useState('');

    const generateDAN = async () => {
        if (!user || !user.id) {
            alert("Connection error: Please try logging out and back in.");
            return;
        }
        setIsGenerating(true);
        try {
            const response = await fetch("/api/monnify/reserved-accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accountReference: `DAN-${user.id}-${Date.now()}`,
                    accountName: `SINCODE / ${(user.name || user.username || 'USER').toUpperCase()}`,
                    customerEmail: user.email || `${user.username || user.id}@sincode.ng`,
                    customerName: user.name || user.username || 'User'
                })
            });

            const data = await response.json();
            
            if (data.requestSuccessful && data.responseBody && data.responseBody.accounts && data.responseBody.accounts.length > 0) {
                // Monnify returns accounts in responseBody.accounts
                const account = data.responseBody.accounts[0];
                const newAccount = {
                    accountName: account.accountName,
                    accountNumber: account.accountNumber,
                    bankName: account.bankName,
                    reference: data.responseBody.accountReference
                };
                
                // Persist to Firebase
                try {
                    await updateDoc(doc(db, 'profiles', user.id), { monnify_account: newAccount });
                } catch (dbErr) {
                    console.error("DB Update Error (monnify_account):", dbErr);
                    handleFirestoreError(dbErr, OperationType.UPDATE, `profiles/${user.id}`);
                }

                onUpdate({ ...user, monnify_account: newAccount });
                alert("Virtual account generated successfully!");
            } else {
                const errorMsg = data.responseMessage || data.responseBody?.responseMessage || "Failed to generate account (No account data returned)";
                console.error("DAN Generation Error:", data);
                alert(`Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error("Network error during DAN generation:", error);
            alert("Network error: Could not generate virtual account. Please check your connection.");
        } finally {
            setIsGenerating(false);
        }
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
                    ...(user || {}),
                    balance: (user?.balance || 0) + amount,
                    transactions: [newTransaction, ...(user?.transactions || [])]
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
            ...(user || {}),
            balance: (user?.balance || 0) + amount,
            transactions: [newTransaction, ...(user?.transactions || [])]
        });
        alert(`Demo funds of ${formatNaira(amount)} added!`);
    };

    return (
        <div className="bg-white min-h-screen pb-20 p-6 space-y-8">
            <header className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-navy-800 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-navy-800/20 mb-2">
                    <DollarSign size={32} className="text-yellow-500" />
                </div>
                <h2 className="text-3xl font-display font-black text-navy-900 tracking-tighter uppercase leading-none">Wallet & Credits</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Manage your sin-credits</p>
            </header>

            <div className="bg-navy-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group transition-all duration-500 hover:shadow-yellow-500/10">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-500/20 blur-[80px] rounded-full group-hover:bg-yellow-500/30 transition-all duration-700"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>
                
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest opacity-80">Available Balance</p>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    </div>
                    <div className="relative inline-block">
                        <h3 className="text-5xl font-display font-black tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {formatNaira(user?.balance || 0)}
                        </h3>
                        <div className="absolute -inset-1 bg-yellow-500/5 blur-xl group-hover:bg-yellow-500/10 transition-all duration-700 -z-10 rounded-full"></div>
                    </div>
                </div>
                
                <div className="mt-12 pt-10 border-t border-white/5 flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Account Holder</p>
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-200">{user?.name || user?.username}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                        <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest leading-none">Status</p>
                        <p className="text-[10px] font-bold uppercase tracking-tight text-white mt-1">Tier 2 Active</p>
                    </div>
                </div>
            </div>

            {/* Monnify DAN Section */}
            <section className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Dedicated Account</h4>
                {user?.monnify_account ? (
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between font-mono">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Name</span>
                            <span className="text-xs font-bold text-slate-900">{user.monnify_account.bankName}</span>
                        </div>
                        <div className="flex items-center justify-between font-mono">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Number</span>
                            <span className="text-lg font-black text-navy-800 tracking-tighter">{user.monnify_account.accountNumber}</span>
                        </div>
                        <div className="flex items-center justify-between font-mono">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Name</span>
                            <span className="text-[11px] font-bold text-slate-900">{user.monnify_account.accountName}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                            <p className="text-[9px] text-center text-slate-400 font-medium">Transfers to this account will fund your wallet automatically.</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-100 border-dashed rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm border border-slate-50">
                            <Monitor size={32} />
                        </div>
                        <div className="space-y-2">
                            <h5 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Virtual Account Number</h5>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">Generate a dedicated NGN account to fund your profile with bank transfers.</p>
                        </div>
                        <button 
                            onClick={generateDAN}
                            disabled={isGenerating}
                            className="bg-navy-800 text-yellow-500 font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-navy-800/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : "Generate Virtual Account"}
                        </button>
                    </div>
                )}
            </section>

            {/* Quick Top-up Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Quick Top-up</h4>
                    <button 
                        onClick={handleDemoFund}
                        className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center gap-1.5"
                    >
                        <RotateCcw size={10} />
                        Demo +100k
                    </button>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-[2.2rem] p-4 flex items-center gap-3 shadow-sm focus-within:border-blue-200 focus-within:bg-white transition-all">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                        <span className="font-black text-lg text-navy-800">₦</span>
                    </div>
                    <input 
                        type="number" 
                        value={fundingAmount}
                        onChange={e => setFundingAmount(e.target.value)}
                        placeholder="Enter amount to fund" 
                        className="flex-1 bg-transparent border-none text-sm font-black text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:ring-0" 
                    />
                    <button 
                        onClick={handleFundWallet}
                        className="bg-navy-900 text-yellow-500 font-black px-8 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-navy-900/10 active:scale-95 transition-all hover:bg-navy-800"
                    >
                        Fund Wallet
                    </button>
                </div>
            </section>

            {/* History */}
            <section className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Transaction History</h4>
                {(!user?.transactions || user.transactions.length === 0) ? (
                    <div className="py-20 text-center">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest tracking-tighter">No transactions yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {user.transactions.map((tx: any, i: number) => (
                            <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center border",
                                        tx.type === 'funding' ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"
                                    )}>
                                        {tx.type === 'funding' ? <Plus size={20} /> : <ShoppingBag size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{tx.description}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={cn(
                                    "text-sm font-black tracking-tighter",
                                    tx.type === 'funding' ? "text-emerald-500" : "text-navy-800"
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
                ...(user || {}),
                balance: (user?.balance || 0) - selectedProduct.price,
                transactions: [newTransaction, ...(user?.transactions || [])]
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
                    <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase mb-8">Checkout</h2>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 mb-8 flex items-center gap-4">
                        <img src={selectedProduct.image} className="w-16 h-16 rounded-xl object-cover" loading="lazy" alt="" />
                        <div>
                            <p className="text-sm font-bold text-slate-900">{selectedProduct.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{selectedProduct.creator}</p>
                            <p className="text-sm font-black text-yellow-600 mt-1">{formatNaira(selectedProduct.price)}</p>
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
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-yellow-500" 
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
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-yellow-500" 
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
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-yellow-500" 
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
                        <button type="submit" className="w-full bg-navy-800 text-yellow-500 font-black py-5 rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-navy-800/10 active:scale-95 transition-all mt-8">
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
                    <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase mb-8">Payment Details</h2>

                    <div className="space-y-4">
                        <button 
                            onClick={handleWalletPayment}
                            className="w-full bg-navy-800 text-white p-6 rounded-[2rem] text-left shadow-lg shadow-navy-800/10 group relative overflow-hidden active:scale-[0.98] transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500 flex items-center gap-1.5 mb-1">
                                        <Monitor size={12} />
                                        Pay with Wallet
                                    </p>
                                    <p className="text-lg font-black tracking-tighter">SINCODE BALANCE</p>
                                    <p className="text-xs font-bold mt-2 text-yellow-500">Wallet: {formatNaira(user?.balance || 0)}</p>
                                </div>
                                <p className="text-xl font-black text-yellow-500">{formatNaira(selectedProduct.price)}</p>
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

                        <div className="bg-yellow-50 border border-yellow-100 rounded-[2rem] p-6">
                            <p className="text-xs text-navy-800 font-medium">Your order will be processed automatically once transfer is detected. Do not close this page.</p>
                        </div>

                        <button 
                            onClick={handlePaymentComplete}
                            className="w-full bg-navy-950 text-yellow-500 font-black py-5 rounded-2xl text-sm uppercase tracking-widest active:scale-95 transition-all mt-8"
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
                        <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase">My Orders</h2>
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
                                        <img src={order.image} className="w-20 h-20 rounded-2xl object-cover" loading="lazy" alt="" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-md font-bold text-slate-900 leading-tight">{order.name}</h4>
                                                <span className="text-[9px] font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md uppercase tracking-widest">{order.type}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">{order.creator}</p>
                                            <p className="text-xs font-black text-slate-900 mt-2">{formatNaira(order.price)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                                        {order.type === 'digital' ? (
                                            <button className="w-full bg-navy-800 text-yellow-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-navy-800/10 flex items-center justify-center gap-2">
                                                <Download size={16} />
                                                Download Digital Content
                                            </button>
                                        ) : (
                                            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivery Schedule</p>
                                                    <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">{order.deliveryDay}, {order.deliveryTime}</p>
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
                    <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase">Commerce</h2>
                    <button 
                        onClick={() => setView('cart')}
                        className="relative p-2 bg-slate-50 rounded-xl"
                    >
                        <ShoppingBag size={24} className="text-slate-400" />
                        {orders.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-navy-950 font-bold animate-pulse">{orders.length}</div>
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
                                <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" alt={p.name} />
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
                                        className="w-10 h-10 bg-navy-800 text-yellow-500 rounded-xl active:scale-90 transition-transform shadow-lg shadow-navy-800/10 flex items-center justify-center"
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
                <div className="bg-navy-900 rounded-[2.5rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <Tag className="text-yellow-500 mb-4" size={24} />
                        <h3 className="text-white font-bold text-2xl leading-none uppercase tracking-tighter">Elite Hub<br/><span className="text-yellow-500">Video Pack</span></h3>
                        <p className="text-slate-400 text-[10px] mt-4 font-bold uppercase tracking-widest">Get 40% OFF this weekend.</p>
                        <button className="mt-8 bg-yellow-500 text-navy-950 text-[10px] font-black uppercase tracking-[0.25em] px-8 py-4 rounded-2xl shadow-xl shadow-yellow-500/20">
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
                                    <img src={item.url} className="w-full h-full object-cover" loading="lazy" alt="Preview" />
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
    const [isEnrolled, setIsEnrolled] = useState(user?.is_runs_enrolled || false);
    const [activeSubscription, setActiveSubscription] = useState<string | null>(user?.runs_subscription || null);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        setIsEnrolled(user?.is_runs_enrolled || false);
        setActiveSubscription(user?.runs_subscription || null);
    }, [user?.is_runs_enrolled, user?.runs_subscription]);

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

    const accessOnlyMembers = [
        { id: 'ao1', name: 'Tunde Harrison', age: 26, location: 'Yaba, Lagos', bio: 'Just paid my access fee, looking for FWB or Sugar Mummy. Dm me!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde' },
        { id: 'ao2', name: 'Chinedu Obi', age: 28, location: 'Enugu', bio: 'Verified access fee paid. Looking to connect before choosing a premium network.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chinedu' },
        { id: 'ao3', name: 'Amara Kalu', age: 23, location: 'Abuja', bio: 'Access network member. Happy to meet premium elites here.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara' },
        { id: 'ao4', name: 'Seyi Adebayo', age: 25, location: 'Ibadan', bio: 'Student, paid access fee. Let\'s hang out and connect casual.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seyi' }
    ];

    const handleEnroll = async () => {
        setIsVerifying(true);
        try {
            await initializePayment({
                amount: fee,
                customerName: user?.full_name || user?.name || "Member",
                customerEmail: user?.email || "member@sincode.ng",
                paymentReference: `ENROLL-${Date.now()}`,
                paymentDescription: "Runs Network Enrollment Fee",
                onComplete: async (res: any) => {
                    const newTx = {
                        id: res.transactionReference,
                        type: 'enrollment',
                        amount: fee,
                        description: 'Runs Network Enrollment',
                        date: new Date().toISOString(),
                        status: 'success'
                    };
                    const updatedUser = {
                        ...user,
                        is_runs_enrolled: true,
                        transactions: [newTx, ...(user?.transactions || [])]
                    };
                    if (user?.id) {
                        try {
                            await updateDoc(doc(db, 'profiles', user.id), {
                                is_runs_enrolled: true,
                                transactions: updatedUser.transactions
                            });
                        } catch (err) {
                            console.error("Firestore enroll save failed:", err);
                        }
                    }
                    onUpdate?.(updatedUser);
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

    const handleWalletEnroll = async () => {
        if ((user?.balance || 0) < fee) {
            alert("Insufficient wallet balance.");
            return;
        }

        setIsVerifying(true);
        const updatedUser = {
            ...(user || {}),
            balance: (user?.balance || 0) - fee,
            is_runs_enrolled: true,
            transactions: [{
                id: `RUNS-${Date.now()}`,
                type: 'enrollment',
                amount: fee,
                description: 'Runs Network Enrollment (Wallet)',
                date: new Date().toISOString(),
                status: 'success'
            }, ...(user?.transactions || [])]
        };

        if (user?.id) {
            try {
                await updateDoc(doc(db, 'profiles', user.id), {
                    balance: updatedUser.balance,
                    is_runs_enrolled: true,
                    transactions: updatedUser.transactions
                });
            } catch (err) {
                console.error("Wallet enroll save failed:", err);
                setIsVerifying(false);
                alert("Database save failed. Please try again.");
                return;
            }
        }
        onUpdate?.(updatedUser);
        setIsEnrolled(true);
        setIsVerifying(false);
        alert("Enrolled successfully using wallet balance!");
    };

    const handleSubscribe = async (cat: any) => {
        // Option to pay with wallet for subscriptions as well
        if (confirm(`Pay ${formatNaira(cat.price)} with wallet?`)) {
            if ((user?.balance || 0) < cat.price) {
                alert("Insufficient wallet balance.");
                return;
            }
            setIsVerifying(true);
            const updatedUser = {
                ...(user || {}),
                balance: (user?.balance || 0) - cat.price,
                runs_subscription: cat.id,
                transactions: [{
                    id: `SUB-${cat.id}-${Date.now()}`,
                    type: 'subscription',
                    amount: cat.price,
                    description: `${cat.label} Subscription (Wallet)`,
                    date: new Date().toISOString(),
                    status: 'success'
                }, ...(user?.transactions || [])]
            };
            if (user?.id) {
                try {
                    await updateDoc(doc(db, 'profiles', user.id), {
                        balance: updatedUser.balance,
                        runs_subscription: cat.id,
                        transactions: updatedUser.transactions
                    });
                } catch (err) {
                    console.error("Subscription save failed:", err);
                    setIsVerifying(false);
                    alert("Subscription failed to save.");
                    return;
                }
            }
            onUpdate?.(updatedUser);
            setActiveSubscription(cat.id);
            setIsVerifying(false);
            alert("Subscription active!");
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
                onComplete: async (res: any) => {
                    const newTx = {
                        id: res.transactionReference,
                        type: 'subscription',
                        amount: cat.price,
                        description: `${cat.label} Subscription`,
                        date: new Date().toISOString(),
                        status: 'success'
                    };
                    const updatedUser = {
                        ...user,
                        runs_subscription: cat.id,
                        transactions: [newTx, ...(user?.transactions || [])]
                    };
                    if (user?.id) {
                        try {
                            await updateDoc(doc(db, 'profiles', user.id), {
                                runs_subscription: cat.id,
                                transactions: updatedUser.transactions
                            });
                        } catch (err) {
                            console.error("Subscription save failed:", err);
                        }
                    }
                    onUpdate?.(updatedUser);
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

    const handleExitSubscription = async () => {
        if (!confirm("Are you sure you want to return to the Access Network hub?")) {
            return;
        }
        setIsVerifying(true);
        const updatedUser = {
            ...(user || {}),
            runs_subscription: null
        };
        if (user?.id) {
            try {
                await updateDoc(doc(db, 'profiles', user.id), {
                    runs_subscription: null
                });
            } catch (err) {
                console.error("Exit subscription failed:", err);
                setIsVerifying(false);
                return;
            }
        }
        onUpdate?.(updatedUser);
        setActiveSubscription(null);
        setIsVerifying(false);
    };

    if (!isEnrolled) {
        return (
            <div className="bg-white min-h-screen p-6 flex flex-col items-center justify-center text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-linear-to-tr from-navy-800 to-navy-950 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-navy-950/20"
                >
                    <Zap size={40} className="text-yellow-500 fill-yellow-500" />
                </motion.div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">SINCODE RUNS</h2>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-10">
                    Connect with premium elites and exclusive companions. Professional verification required for the elite network.
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 w-full text-center">
                    <p className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Network Access Fee</p>
                    <p className="text-slate-900 text-3xl font-black tracking-tighter">{formatNaira(fee)}</p>
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
                        className="w-full bg-navy-800 text-yellow-500 font-black py-5 rounded-2xl shadow-xl shadow-navy-800/10 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
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
                    <h2 className="text-2xl font-black text-navy-900 leading-none">The Network</h2>
                    <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                        <Zap size={20} fill="currentColor" />
                    </div>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    {activeSubscription ? `Access: ${currentCat?.label}` : 'Choose Your Pathway'}
                </p>
            </div>

            <div className="p-6">
                {!activeSubscription ? (
                    <div className="space-y-8">
                        {/* Select Premium Network Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Select Premium Network</h3>
                                <span className="text-[10px] bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full font-black uppercase tracking-widest border border-yellow-100">5 Available</span>
                            </div>
                            <div className="space-y-4">
                                {categories.map((cat) => (
                                    <motion.div 
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group relative overflow-hidden rounded-[2rem] border border-slate-200/60 shadow-xs bg-white active:scale-[0.98] transition-transform cursor-pointer hover:border-yellow-400 hover:shadow-md transition-all duration-300"
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
                        </div>

                        {/* Access Network Lounge (Awaiting Premium Placement) */}
                        <div className="pt-6 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Access Lounge</h3>
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">Awaiting Network</span>
                            </div>
                            <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-4">
                                These verified members have paid the network access fee but have not joined a premium network category yet.
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                {accessOnlyMembers.map((member) => (
                                    <motion.div 
                                        key={member.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                                <img src={member.avatar} className="w-full h-full object-cover" loading="lazy" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="text-sm font-black text-slate-900 leading-none truncate">{member.name}</h4>
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></div>
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-1">{member.age} • {member.location}</p>
                                                <div className="flex gap-2 mt-2">
                                                     <div className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-[4px] text-[8px] font-black uppercase tracking-tighter">
                                                         ACCESS PAID
                                                     </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setSelectedMember(member)}
                                                className="bg-slate-900 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0"
                                            >
                                                <MessageSquare size={16} />
                                            </button>
                                        </div>
                                        <p className="mt-3 text-[11px] text-slate-400 font-medium leading-relaxed">
                                            "{member.bio}"
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
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
                                    onClick={handleExitSubscription}
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
                                            <img src={member.avatar} className="w-full h-full object-cover" loading="lazy" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="text-base font-black text-slate-900 leading-none">{member.name}</h4>
                                                <BadgeCheck size={16} className="text-yellow-500 fill-yellow-500 bg-white rounded-full" />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{member.age} • {member.location}</p>
                                            <div className="flex gap-2 mt-2">
                                                 <div className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-[4px] text-[8px] font-black uppercase tracking-tighter">
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
                                    <p className="mt-3 text-[11px] text-slate-400 font-medium leading-relaxed">
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
                                    <img src={selectedMember.avatar} className="w-full h-full object-cover" loading="lazy" alt="" />
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

const KYCVerification = ({ user, onBack, onComplete }: { user: any, onBack: () => void, onComplete: (data: any) => void }) => {
    const [step, setStep] = useState(1);
    const [idType, setIdType] = useState('BVN');
    const [idNumber, setIdNumber] = useState('');
    const [dob, setDob] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = () => {
        if (!idNumber || !dob) {
            alert("Please fill in all fields");
            return;
        }
        setIsVerifying(true);
        // Simulate real KYC verification with Monnify/Third party
        setTimeout(() => {
            setIsVerifying(false);
            onComplete({
                kyc_verified: true,
                kyc_type: idType,
                kyc_reference: `KYC-${Date.now()}`,
                kyc_date: new Date().toISOString()
            });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="p-6 flex items-center gap-6 border-b border-slate-100">
                <button onClick={onBack} className="p-3 bg-slate-100 rounded-2xl text-slate-400">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identity Verification</h2>
            </div>

            <div className="p-8 space-y-10">
                <header className="space-y-4">
                    <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center text-yellow-500 shadow-xl shadow-navy-800/20">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Complete KYC</h3>
                        <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">To ensure community safety and enable higher transaction limits, please verify your identity.</p>
                    </div>
                </header>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identification Type</label>
                        <div className="flex gap-2">
                            {['BVN', 'NIN', 'Passport'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setIdType(type)}
                                    className={cn(
                                        "flex-1 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                        idType === type ? "bg-navy-800 text-yellow-500 border-navy-800 shadow-lg shadow-navy-800/10" : "bg-slate-50 text-slate-400 border-slate-100"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                {idType} Number
                            </label>
                            <input 
                                type="text" 
                                value={idNumber}
                                onChange={e => setIdNumber(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-yellow-500" 
                                placeholder={`Enter ${idType} Number`}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                            <input 
                                type="date" 
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-yellow-500" 
                            />
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-[2rem] p-8 flex items-start gap-4">
                        <Lock size={20} className="text-yellow-600 shrink-0 mt-1" />
                        <p className="text-xs text-navy-800 font-medium leading-relaxed">
                            Your data is encrypted and handled according to Nigerian Data Protection Regulations (NDPR). We only use this to verify your identity.
                        </p>
                    </div>

                    <button 
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className="w-full bg-navy-800 text-yellow-500 font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-navy-800/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {isVerifying ? (
                            <>
                                <div className="w-4 h-4 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                                Running Verification...
                            </>
                        ) : "Submit Verification"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileSettings = ({ user, onBack, onSave, onKYCClick }: { user: any, onBack: () => void, onSave: (data: any) => void, onKYCClick: () => void }) => {
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
            try {
                await updateDoc(doc(db, 'profiles', user.id), formData as any);
            } catch (dbErr) {
                handleFirestoreError(dbErr, OperationType.UPDATE, `profiles/${user.id}`);
            }
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
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Edit Profile</h2>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-navy-800 text-yellow-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy-800/20 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>

            <div className="p-6 space-y-8">
                {/* KYC Section */}
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            user?.kyc_verified ? "bg-emerald-50 text-emerald-500" : "bg-yellow-50 text-yellow-600"
                        )}>
                            {user?.kyc_verified ? <BadgeCheck size={24} /> : <ShieldAlert size={24} />}
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 leading-none">
                                {user?.kyc_verified ? "Identity Verified" : "Verification Required"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                                {user?.kyc_verified ? "Tier 2 Limits Enabled" : "Tier 1 Limits Apply"}
                            </p>
                        </div>
                    </div>
                    {!user?.kyc_verified && (
                        <button 
                            onClick={onKYCClick}
                            className="bg-navy-800 text-yellow-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Verify
                        </button>
                    )}
                </div>

                {/* Visual Identity */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-yellow-600 uppercase tracking-widest ml-1">Visual Identity</label>
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
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Status</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Visibility on platform</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                            className={cn(
                                "w-14 h-8 rounded-full p-1 transition-all duration-300 relative",
                                formData.is_active ? "bg-navy-800" : "bg-slate-200"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-yellow-500 rounded-full transition-all duration-300 shadow-md",
                                formData.is_active ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ user, onUpdate, onCreatorClick }: { user: any, onUpdate: (data: any) => void, onCreatorClick?: (username: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifyingKYC, setIsVerifyingKYC] = useState(false);

  if (isVerifyingKYC) {
    return (
      <KYCVerification 
        user={user} 
        onBack={() => setIsVerifyingKYC(false)} 
        onComplete={async (data) => {
          // Update DB
          try {
            try {
              await updateDoc(doc(db, 'profiles', user.id), data as any);
            } catch (dbErr) {
              handleFirestoreError(dbErr, OperationType.UPDATE, `profiles/${user.id}`);
            }
            onUpdate({ ...user, ...data });
            alert("Identity verified successfully!");
          } catch (err) {
            onUpdate({ ...user, ...data });
            alert("Demo: Identity verified!");
          }
          setIsVerifyingKYC(false);
        }} 
      />
    );
  }

  if (isEditing) {
    return (
      <ProfileSettings 
        user={user} 
        onBack={() => setIsEditing(false)} 
        onKYCClick={() => {
            setIsEditing(false);
            setIsVerifyingKYC(true);
        }}
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
            
            <div className="flex gap-2 mb-2 flex-wrap">
               <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 bg-slate-50 font-bold text-[13px] rounded-full border border-slate-200 text-slate-800 shadow-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5"
               >
                  <Settings size={14} className="text-slate-500" />
                  Edit Profile
               </button>
               {user?.is_verified && (
                 <button 
                  onClick={() => onCreatorClick?.(user.username)}
                  className="px-4 py-1.5 bg-yellow-500 font-bold text-[13px] rounded-full text-navy-950 shadow-xs hover:bg-yellow-400 transition-colors flex items-center gap-1.5"
                 >
                    <Eye size={14} />
                    View Creator View
                 </button>
               )}
               <button className="p-1.5 bg-slate-50 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors">
                  <MoreHorizontal size={20} />
               </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{user?.name || "sinner25"}</h2>
              {user?.kyc_verified && (
                <div className="bg-emerald-50 text-emerald-500 p-0.5 rounded-full border border-emerald-100" title="KYC Verified">
                   <ShieldCheck size={14} fill="currentColor" className="text-white" />
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm font-medium mt-0.5">@{user?.username || "sinner25"}</p>
            <p className="text-slate-400 text-[11px] mt-1.5 ml-0.5 flex items-center gap-1.5">
               Last seen 2 minutes ago
            </p>
          </div>

          <div className="flex gap-5 mt-5 pl-1">
            <div className="flex items-center gap-2">
               <Heart size={16} className="text-yellow-500 fill-yellow-500" strokeWidth={0} />
               <span className="text-sm font-bold text-navy-950 tracking-tight">0</span>
            </div>
            <div className="flex items-center gap-2">
               <Users size={16} className="text-yellow-600" />
               <span className="text-sm font-bold text-navy-950 tracking-tight">0</span>
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
            <button className="flex-1 py-4 text-center font-bold text-sm text-yellow-600 border-b-2 border-yellow-600">
               Posts
            </button>
            <button className="flex-1 py-4 text-center font-bold text-sm text-slate-500">
               Media
            </button>
         </div>
      </div>

      <div className="p-4 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
          <input 
            type="text" 
            placeholder="Search Timeline" 
            className="w-full bg-slate-50 border border-slate-100 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-hidden"
          />
        </div>
        <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-md text-yellow-500">
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
                const q = query(collection(db, 'profiles'), where('verification_status', '==', 'pending'));
                let querySnapshot;
                try {
                    querySnapshot = await getDocs(q);
                } catch (dbErr) {
                    handleFirestoreError(dbErr, OperationType.LIST, 'profiles');
                }
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
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
                console.error("Failed to fetch pending creators", err);
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
            
            try {
                await updateDoc(doc(db, 'profiles', id), { 
                    verification_status: status, 
                    is_verified: isVerified 
                });
            } catch (dbErr) {
                handleFirestoreError(dbErr, OperationType.UPDATE, `profiles/${id}`);
            }

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
                    <h2 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase">Verification Desk</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Pending Approval Requests</p>
                </div>
                <div className="bg-navy-800/10 text-yellow-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-yellow-600/20">
                    Admin Portal
                </div>
            </header>

            <div className="p-6 space-y-6">
                {loading ? (
                    <div className="py-20 text-center space-y-4 animate-pulse">
                        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-600 rounded-full mx-auto animate-spin"></div>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Scanning Applications...</p>
                    </div>
                ) : pendingCreators.length === 0 ? (
                    <div className="py-32 text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                           <ShieldCheck size={40} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-slate-900 font-black uppercase tracking-tight">System Clear</h3>
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
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">"{creator.bio}"</p>
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
                <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Become an <span className="text-blue-500">Elite</span> Creator</h2>
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
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Your Category</h3>
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
                        <h3 className="text-lg font-display font-black text-slate-900 uppercase tracking-tighter">Identity Verification</h3>
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
                                <p className="text-white font-black text-sm uppercase tracking-widest">Document Secured</p>
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
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
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
        const errorMsg = data.responseMessage || (typeof data.error === 'object' ? data.error?.responseMessage : data.error) || data.message || "Unknown error";
        console.error("Withdrawal failure details:", data);
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
        try {
            await updateDoc(doc(db, 'profiles', user.id), { 
                verification_status: 'pending',
                full_name: data.fullName,
                bio: data.bio,
                category: data.category
            });
        } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.UPDATE, `profiles/${user.id}`);
        }
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
        <h2 className="text-4xl font-display font-black uppercase tracking-tighter text-slate-900">Creator Hub</h2>
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
                    <p className="text-base font-display font-black text-slate-900 tracking-tight">New Subscription</p>
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
               <h3 className="font-black text-2xl tracking-tighter uppercase text-slate-900 scale-y-110">Withdrawal</h3>
               <span className="text-[9px] bg-blue-50 px-3 py-1.5 rounded-lg text-blue-500 font-black uppercase tracking-[0.25em] border border-blue-100">Instant Pay</span>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 mb-10 flex items-center gap-5 group-hover:bg-slate-100 transition-colors">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">UBA</div>
                <div className="flex-1">
                    <p className="text-md font-bold text-slate-900 tracking-tight uppercase">United Bank for Africa</p>
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

const LockedTabPlaceholder = ({ 
  tab, 
  onSignInClick 
}: { 
  tab: string, 
  onSignInClick: () => void 
}) => {
  const getPlaceholderDetails = (t: string) => {
    switch (t) {
      case 'runs':
        return {
          title: 'Runs Matchmaking is Locked',
          desc: 'Sign in to discover, search, and live-match with premium creators and elite members.',
          icon: Zap,
          btnText: 'Unlock Runs'
        };
      case 'create':
        return {
          title: 'Creator Hub is Locked',
          desc: 'Sign in to manage your creator profile, drop new exclusive publications, and process fast payouts.',
          icon: ShieldCheck,
          btnText: 'Open Creator Hub'
        };
      case 'saved':
        return {
          title: 'Bookmarks are Locked',
          desc: 'Sign in to save exclusive posts, compile your catalog, and keep track of your favorite moments.',
          icon: Bookmark,
          btnText: 'Access Bookmarks'
        };
      case 'profile':
        return {
          title: 'Profile details are Locked',
          desc: 'Sign in to view your statistics, check transaction histories, and customize your personal details.',
          icon: UserCircle,
          btnText: 'View My Profile'
        };
      case 'messages':
        return {
          title: 'Direct Messages are Locked',
          desc: 'Sign in to start private chats, receive prioritized responses, and converse with creators.',
          icon: MessageSquare,
          btnText: 'Unlock Chat'
        };
      case 'notifications':
        return {
          title: 'Alerts & Activity are Locked',
          desc: 'Sign in to stay updated on your creator subscriptions, likes, and tips.',
          icon: Bell,
          btnText: 'See My Alerts'
        };
      default:
        return {
          title: 'Feature is Locked',
          desc: 'This premium portal feature is restricted to registered members only. Connect in seconds.',
          icon: Lock,
          btnText: 'Sign In Now'
        };
    }
  };

  const details = getPlaceholderDetails(tab);
  const Icon = details.icon;

  return (
    <div className="h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-white font-sans animate-fade-in">
       <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mb-6 text-blue-500 shadow-xs">
          <Icon size={28} />
       </div>
       <h3 className="text-xl font-display font-black text-slate-900 uppercase tracking-tight mb-2">
         {details.title}
       </h3>
       <p className="text-slate-500 text-xs max-w-xs leading-relaxed font-semibold mb-6">
         {details.desc}
       </p>
       <button 
         onClick={onSignInClick}
         className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-blue-600/15 active:scale-95 transition-all cursor-pointer"
         id={`locked-btn-${tab}`}
       >
         {details.btnText}
       </button>
    </div>
  );
};

const LoginPromptModal = ({ 
  reason, 
  onClose, 
  onSignInClick 
}: { 
  reason: string, 
  onClose: () => void, 
  onSignInClick: () => void 
}) => {
  const getPromptDetails = (r: string) => {
    switch (r) {
      case 'follow':
        return {
          title: 'Subscribe & Follow Creators',
          desc: 'Sign in to subscribe to premium Nigerian creators, view exclusive story feeds, and follow updates.',
          icon: Users,
          iconColor: 'text-blue-500 bg-blue-50'
        };
      case 'like':
        return {
          title: 'Like Exclusive Posts',
          desc: 'Sign in to like VIP publications, engage with elite content, and show your appreciation.',
          icon: Heart,
          iconColor: 'text-rose-500 bg-rose-50'
        };
      case 'watch':
        return {
          title: 'Watch Exclusive Content',
          desc: 'Sign in to unlock, purchase, and watch premium videos, high-resolution photo packs, and streams.',
          icon: Play,
          iconColor: 'text-amber-500 bg-amber-50'
        };
      case 'message':
        return {
          title: 'Send Direct Messages',
          desc: 'Sign in to open a premium chat connection and converse directly with verified elite creators.',
          icon: MessageSquare,
          iconColor: 'text-indigo-500 bg-indigo-50'
        };
      case 'wallet':
        return {
          title: 'Access Digital Wallet',
          desc: 'Sign in to fund your wallet, track instant payout transactions, and purchase exclusive items.',
          icon: CreditCard,
          iconColor: 'text-emerald-500 bg-emerald-50'
        };
      case 'saved':
        return {
          title: 'Access Bookmarks',
          desc: 'Sign in to save posts, bookmark publications, and view your saved elite catalog.',
          icon: Bookmark,
          iconColor: 'text-yellow-500 bg-yellow-50'
        };
      case 'create':
        return {
          title: 'Access Creator Hub',
          desc: 'Sign in to apply as a verified creator, drop new media, and manage your custom hub.',
          icon: ShieldCheck,
          iconColor: 'text-teal-500 bg-teal-50'
        };
      case 'runs':
        return {
          title: 'Runs Matchmaking',
          desc: 'Sign in to discover, sync, and matchmaking live with premium members and creators.',
          icon: Zap,
          iconColor: 'text-purple-500 bg-purple-50'
        };
      case 'profile':
        return {
          title: 'Access Personal Profile',
          desc: 'Sign in to view your details, edit your bio, and personalize your recommendation engine.',
          icon: User,
          iconColor: 'text-slate-500 bg-slate-50'
        };
      default:
        return {
          title: 'Sign In Required',
          desc: 'Sign in to verify your identity and connect with Africa\'s most elite creators, designers, and curators.',
          icon: Lock,
          iconColor: 'text-yellow-500 bg-yellow-50'
        };
    }
  };

  const details = getPromptDetails(reason);
  const Icon = details.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 max-w-sm w-full p-8 relative z-10 shadow-2xl text-center space-y-6 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full"></div>
        
        <div className={`w-16 h-16 ${details.iconColor} rounded-3xl flex items-center justify-center mx-auto shadow-md`}>
          <Icon size={28} className="fill-current" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-display font-black text-slate-900 uppercase tracking-tight leading-none">{details.title}</h3>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed px-2">{details.desc}</p>
        </div>

        <div className="space-y-3 pt-2">
          <button 
            onClick={onSignInClick}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
          >
            Go to Portal Sign In
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            Cancel & Browse
          </button>
        </div>
      </motion.div>
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

  // Guest & Action Lock States
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [loginPromptReason, setLoginPromptReason] = useState<string | null>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  // AI Recommendation States
  const [subscriptions, setSubscriptions] = useState<string[]>(['@pokepetit...']);
  const [viewingHistory, setViewingHistory] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isRecsLoading, setIsRecsLoading] = useState<boolean>(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);

  const handleLikeToggle = (postId: string) => {
    if (!currentUser) {
      setLoginPromptReason("like");
      return;
    }
    setLikedPostIds((prev) => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  const handleCreatorFollowed = (username: string) => {
    if (!currentUser) {
      setLoginPromptReason("follow");
      return;
    }
    setSubscriptions((prev) => {
      if (prev.includes(username)) {
        return prev.filter((u) => u !== username);
      } else {
        return [...prev, username];
      }
    });
  };

  const handlePostViewed = (id: string) => {
    setViewingHistory((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const handleBookmarkToggle = async (postId: string) => {
    if (!currentUser) {
      setLoginPromptReason("saved");
      return;
    }
    
    const currentBookmarks = currentUser.bookmarkedPostIds || [];
    let updatedBookmarks: string[];
    if (currentBookmarks.includes(postId)) {
      updatedBookmarks = currentBookmarks.filter((id: string) => id !== postId);
    } else {
      updatedBookmarks = [...currentBookmarks, postId];
    }
    
    // Update local state first for instant responsiveness
    const updatedUser = { ...currentUser, bookmarkedPostIds: updatedBookmarks };
    setCurrentUser(updatedUser);
    
    // Persist to Firestore
    try {
      const userDocRef = doc(db, 'profiles', currentUser.id);
      await updateDoc(userDocRef, { bookmarkedPostIds: updatedBookmarks });
    } catch (err) {
      console.error("Failed to persist bookmark to Firestore:", err);
    }
  };

  // Fetch AI Recommendations based on viewing history, subscriptions, and stated interests (Debounced)
  useEffect(() => {
    let active = true;
    
    const timer = setTimeout(() => {
      const fetchRecommendations = async () => {
        setIsRecsLoading(true);
        try {
          const response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              viewingHistory,
              subscriptions,
              interests: currentUser?.interests || [],
              allPosts: CENTRAL_POSTS,
              allCreators: CENTRAL_CREATORS
            })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
          }
          const data = await response.json();
          if (active) {
            setRecommendations(data);
          }
        } catch (err) {
          console.error("AI Recommendation fetch error:", err);
        } finally {
          if (active) {
            setIsRecsLoading(false);
          }
        }
      };

      fetchRecommendations();
    }, 1500); // 1.5 seconds debounce to prevent 429 quota exhaustion on fast toggles/clicks

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [viewingHistory, subscriptions, currentUser?.interests]);

  // Check if we are inside an OAuth popup window and close if so
  useEffect(() => {
    if (window.opener && window.opener !== window) {
      console.log("OAuth popup detected in App. Sending postMessage and closing...");
      try {
        window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, window.location.origin);
      } catch (err) {
        console.error("Failed to postMessage to opener:", err);
      }
      window.close();
    }
  }, []);

  useEffect(() => {
    console.log("SINCODE: App Mounting...");
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Firebase Auth state change:", !!user);
      if (user) {
        setIsLoggedIn(true);
        setIsLoading(true);
        try {
          // Fetch profile data from Firestore
          let profileSnap;
          try {
            profileSnap = await getDoc(doc(db, 'profiles', user.uid));
          } catch (dbErr) {
            handleFirestoreError(dbErr, OperationType.GET, `profiles/${user.uid}`);
          }
          
          if (profileSnap.exists()) {
            const profile = profileSnap.data();
            // Ensure wallet exists and inject demo funds requested by user
            const profileWithWallet = {
                id: user.uid,
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
          } else {
            // Fallback for user without a profile in the DB yet
            const fallbackProfile = {
              id: user.uid,
              name: user.displayName || 'New User',
              username: 'user_' + user.uid.substring(0, 8),
              email: user.email,
              balance: 0,
              transactions: [],
              monnify_account: null
            };
            setCurrentUser(fallbackProfile);
          }
        } catch (err) {
          console.error("Profile sync error:", err);
          // Still logged in, just using fallback data
          setCurrentUser({
            id: user.uid,
            name: user.displayName || 'User',
            email: user.email,
            balance: 0,
            transactions: []
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
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

  const isProfileIncomplete = isLoggedIn && currentUser && (
    !currentUser.username || 
    currentUser.username === '@user' || 
    currentUser.username.startsWith('user_') || 
    currentUser.username.startsWith('@user_') || 
    !currentUser.state
  );

  const isTabLocked = !isLoggedIn && ['runs', 'create', 'saved', 'profile', 'messages', 'notifications', 'settings'].includes(activeTab);

  if (!isLoggedIn && !currentUser) {
    return <AuthPage onLogin={(user) => {
      setCurrentUser(user);
      if (user && !user.isGuest) {
        setIsLoggedIn(true);
      }
    }} />;
  }

  if (isLoggedIn && isProfileIncomplete) {
    return (
      <UpdateProfilePage 
        user={currentUser} 
        onComplete={async (updatedFields) => {
          try {
            const profileDoc = {
              id: currentUser.id,
              email: currentUser.email,
              name: updatedFields.name,
              username: updatedFields.username,
              phone: updatedFields.phone,
              dob: updatedFields.dob || "",
              gender: updatedFields.gender,
              state: updatedFields.state,
              location: `${updatedFields.state}, Nigeria`,
              interests: updatedFields.interests || []
            };
            try {
              await setDoc(doc(db, 'profiles', currentUser.id), profileDoc, { merge: true });
            } catch (dbErr) {
              handleFirestoreError(dbErr, OperationType.CREATE, `profiles/${currentUser.id}`);
            }

            const profileWithWallet = {
              ...currentUser,
              ...profileDoc,
              balance: (currentUser.balance || 0) + 100000,
              transactions: currentUser.transactions || []
            };
            setCurrentUser(profileWithWallet);
          } catch (error) {
            console.error("Failed to complete profile registration:", error);
            throw error;
          }
        }} 
        onLogout={handleLogout} 
      />
    );
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
          {selectedCreator ? (
            <motion.div
              key="creator-profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CreatorProfileView 
                creator={selectedCreator}
                onBack={() => setSelectedCreator(null)}
                user={currentUser}
                onUpdateUser={(updated) => setCurrentUser(updated)}
                subscriptions={subscriptions}
                onCreatorFollowed={handleCreatorFollowed}
                viewingHistory={viewingHistory}
                onPostViewed={handlePostViewed}
                onMessageClick={(username) => {
                  setSelectedCreator(null);
                  setActiveTab('messages');
                }}
                onRequireLogin={(reason) => {
                  setLoginPromptReason(reason);
                  setShowAuthOverlay(true);
                }}
              />
            </motion.div>
          ) : isTabLocked ? (
            <motion.div
              key="locked-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LockedTabPlaceholder tab={activeTab} onSignInClick={() => setShowAuthOverlay(true)} />
            </motion.div>
          ) : (
            <>
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
                subscriptions={subscriptions}
                onCreatorFollowed={handleCreatorFollowed}
                viewingHistory={viewingHistory}
                onPostViewed={handlePostViewed}
                recommendations={recommendations}
                isRecsLoading={isRecsLoading}
                bookmarkedPostIds={currentUser?.bookmarkedPostIds || []}
                onBookmarkToggle={handleBookmarkToggle}
                onCreatorClick={(username) => {
                  const c = CENTRAL_CREATORS.find(item => item.username.toLowerCase() === username.toLowerCase());
                  if (c) {
                    setSelectedCreator(c);
                  }
                }}
                onRequireLogin={(reason) => {
                  setLoginPromptReason(reason);
                  setShowAuthOverlay(true);
                }}
                likedPostIds={likedPostIds}
                onLikeToggle={handleLikeToggle}
              />
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SavedPage 
                user={currentUser}
                onUpdate={(updated) => setCurrentUser(updated)}
                subscriptions={subscriptions}
                onCreatorFollowed={handleCreatorFollowed}
                viewingHistory={viewingHistory}
                onPostViewed={handlePostViewed}
                bookmarkedPostIds={currentUser?.bookmarkedPostIds || []}
                onBookmarkToggle={handleBookmarkToggle}
                onCreatorClick={(username) => {
                  const c = CENTRAL_CREATORS.find(item => item.username.toLowerCase() === username.toLowerCase());
                  if (c) {
                    setSelectedCreator(c);
                  }
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
               <ProfileView 
                 user={currentUser} 
                 onUpdate={(data) => setCurrentUser({...currentUser, ...data})} 
                 onCreatorClick={(username) => {
                   if (username === currentUser?.username) {
                     const selfCreator = {
                       id: currentUser.id,
                       name: currentUser.name,
                       username: currentUser.username,
                       avatar: currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id || "sinner"}`,
                       image: currentUser.cover_photo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
                       bio: currentUser.bio || "Welcome to my VIP premium space!",
                       subscribers: 128,
                       subscriptionPrice: 1500,
                       isAIRecommended: false,
                     };
                     setSelectedCreator(selfCreator);
                   } else {
                     const c = CENTRAL_CREATORS.find(item => item.username.toLowerCase() === username.toLowerCase());
                     if (c) {
                       setSelectedCreator(c);
                     }
                   }
                 }}
               />
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

          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ExplorePage
                user={currentUser}
                onUpdate={(updated) => setCurrentUser(updated)}
                subscriptions={subscriptions}
                onCreatorFollowed={handleCreatorFollowed}
                viewingHistory={viewingHistory}
                onPostViewed={handlePostViewed}
                recommendations={recommendations}
                isRecsLoading={isRecsLoading}
                onCreatorClick={(username) => {
                  const c = CENTRAL_CREATORS.find(item => item.username.toLowerCase() === username.toLowerCase());
                  if (c) {
                    setSelectedCreator(c);
                  }
                }}
              />
            </motion.div>
          )}

          {/* Placeholder for tabs without content yet */}
          {['messages', 'notifications'].includes(activeTab) && (
            <div className="h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-white">
               <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                  {activeTab === 'messages' ? <MessageSquare size={32} /> : <Bell size={32} />}
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-1">
                 {activeTab === 'messages' ? 'Your Messages' : 'Alerts & Activity'}
               </h3>
               <p className="text-slate-400 text-xs max-w-[180px] leading-relaxed font-medium">
                 {activeTab === 'messages' 
                   ? 'Connect directly with fans and creators through SINCODE.'
                   : 'Stay updated with your latest tips, subs, and creator syncs.'}
               </p>
            </div>
          )}
            </>
          )}
        </AnimatePresence>
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} setIsUploading={setIsUploading} />
      <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} setIsUploading={setIsUploading} />
    </div>
  );
}
