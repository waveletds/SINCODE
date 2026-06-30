import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BadgeCheck, 
  Sparkles, 
  Heart, 
  MessageSquare, 
  Coins, 
  ShoppingBag, 
  Info, 
  Lock, 
  Eye, 
  DollarSign,
  TrendingUp,
  UserPlus,
  Compass,
  Zap,
  HelpCircle
} from 'lucide-react';
import { cn, formatNaira } from '@/src/lib/utils';
import { doc, updateDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';

interface CreatorProfileViewProps {
  creator: {
    username: string;
    name: string;
    category: string;
    avatar: string;
    image: string;
    bio: string;
    active: boolean;
    price?: number;
  };
  onBack: () => void;
  user: any;
  onUpdateUser: (updatedUser: any) => void;
  subscriptions: string[];
  onCreatorFollowed: (username: string) => void;
  viewingHistory: string[];
  onPostViewed: (id: string) => void;
  onMessageClick?: (username: string) => void;
}

export default function CreatorProfileView({
  creator,
  onBack,
  user,
  onUpdateUser,
  subscriptions,
  onCreatorFollowed,
  viewingHistory,
  onPostViewed,
  onMessageClick
}: CreatorProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'shop' | 'bio'>('posts');
  const [isTipping, setIsTipping] = useState(false);
  const [tipAmount, setTipAmount] = useState('1000');
  const [isSubmittingTip, setIsSubmittingTip] = useState(false);
  const [tipSuccess, setTipSuccess] = useState(false);

  // Filter posts specific to this creator
  const creatorPosts = useMemo(() => {
    // We import CENTRAL_POSTS inside useMemo or reference static posts
    // For safety, we match creatorName or creatorUsername
    const creatorCleanUsername = creator.username.toLowerCase();
    const allPosts = [
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
        likes: 98,
        comments: 14,
        price: 1800,
        tags: ["Fashion & Runway", "Lifestyle & Behind-the-scenes"]
      },
      {
        id: "post-3",
        creatorName: "Eko Finesse",
        creatorUsername: "@ekofinesse",
        creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=model",
        category: "Featured",
        content: "Sunrise at Lekki Conservation Centre. The morning mist over the canopy walk is pure magic. High contrast monochrome print of this drop is available in the Shop. 🐾🌅",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
        likes: 310,
        comments: 48,
        price: 0,
        tags: ["Photography & Visual Art"]
      },
      {
        id: "post-4",
        creatorName: "Burna Beats",
        creatorUsername: "@burnabeats",
        creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=music",
        category: "Featured",
        content: "Abuja Afrofusion Festival live clips! Unreleased mixtape tracks that I performed on stage. Thank you guys for the extreme energy! 🎶⚡🥁",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
        likes: 290,
        comments: 51,
        price: 2200,
        tags: ["LGBTQ+ Pride & Community", "Fashion & Runway", "VIP Entertainment & Modeling"]
      }
    ];

    return allPosts.filter(p => p.creatorUsername.toLowerCase() === creatorCleanUsername);
  }, [creator.username]);

  // Generate dynamic products for this creator
  const creatorProducts = useMemo(() => {
    return [
      {
        id: `prod-${creator.username}-1`,
        name: `${creator.name}'s Premium Selfie Pack`,
        price: 3500,
        category: 'Digital',
        image: creator.image,
        desc: 'Unlock 15 exclusive high-resolution, unedited photos. Strictly behind-the-scenes content.'
      },
      {
        id: `prod-${creator.username}-2`,
        name: `1-on-1 Interactive Direct Message`,
        price: 15000,
        category: 'Service',
        image: creator.avatar,
        desc: 'Direct premium message connection with verified instant reply back from me.'
      }
    ];
  }, [creator]);

  const isFollowed = subscriptions.includes(creator.username);
  const subscriptionPrice = creator.price || 1500;

  const handleSubscribeClick = async () => {
    if (isFollowed) {
      // Toggle follow off
      onCreatorFollowed(creator.username);
      alert(`Unsubscribed from ${creator.name}`);
      return;
    }

    // Checking subscription balance
    if ((user?.balance || 0) < subscriptionPrice) {
      alert(`Insufficient funds. Subscription to ${creator.name} is ${formatNaira(subscriptionPrice)}. Please fund your wallet.`);
      return;
    }

    if (confirm(`Subscribe to ${creator.name} for ${formatNaira(subscriptionPrice)}/month?`)) {
      const updatedBalance = (user?.balance || 0) - subscriptionPrice;
      const subTransaction = {
        id: `SUB-${Date.now()}`,
        type: 'purchase',
        amount: subscriptionPrice,
        description: `Premium Subscription: ${creator.name}`,
        date: new Date().toISOString(),
        status: 'success'
      };

      const updatedUser = {
        ...user,
        balance: updatedBalance,
        transactions: [subTransaction, ...(user.transactions || [])]
      };

      try {
        await updateDoc(doc(db, 'profiles', user.id), {
          balance: updatedBalance,
          transactions: updatedUser.transactions
        });
      } catch (err) {
        console.error("Firestore sync error on subscribe:", err);
      }

      onUpdateUser(updatedUser);
      onCreatorFollowed(creator.username);
      alert(`Successfully subscribed to ${creator.name}! Welcome to the Elite club!`);
    }
  };

  const handleSendTip = async () => {
    const amount = parseInt(tipAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid tip amount.");
      return;
    }

    if ((user?.balance || 0) < amount) {
      alert("Insufficient wallet balance for this tip. Please fund your wallet first.");
      return;
    }

    setIsSubmittingTip(true);
    try {
      // Simulate network
      await new Promise(r => setTimeout(r, 1200));

      const updatedBalance = (user?.balance || 0) - amount;
      const tipTransaction = {
        id: `TIP-${Date.now()}`,
        type: 'purchase',
        amount: amount,
        description: `Creator Tip to ${creator.name}`,
        date: new Date().toISOString(),
        status: 'success'
      };

      const updatedUser = {
        ...user,
        balance: updatedBalance,
        transactions: [tipTransaction, ...(user.transactions || [])]
      };

      try {
        await updateDoc(doc(db, 'profiles', user.id), {
          balance: updatedBalance,
          transactions: updatedUser.transactions
        });
      } catch (err) {
        console.error("Firestore sync error on tipping:", err);
      }

      onUpdateUser(updatedUser);
      setTipSuccess(true);
      setTimeout(() => {
        setTipSuccess(false);
        setIsTipping(false);
      }, 2000);
    } catch (err) {
      alert("Failed to process tip. Please try again.");
    } finally {
      setIsSubmittingTip(false);
    }
  };

  const handleProductBuy = async (product: any) => {
    if ((user?.balance || 0) < product.price) {
      alert(`Insufficient balance. This item is ${formatNaira(product.price)}.`);
      return;
    }

    if (confirm(`Purchase "${product.name}" for ${formatNaira(product.price)}?`)) {
      const updatedBalance = (user?.balance || 0) - product.price;
      const productTransaction = {
        id: `SHOP-${Date.now()}`,
        type: 'purchase',
        amount: product.price,
        description: `Shop Purchase: ${product.name}`,
        date: new Date().toISOString(),
        status: 'success'
      };

      const updatedUser = {
        ...user,
        balance: updatedBalance,
        transactions: [productTransaction, ...(user.transactions || [])]
      };

      try {
        await updateDoc(doc(db, 'profiles', user.id), {
          balance: updatedBalance,
          transactions: updatedUser.transactions
        });
      } catch (err) {
        console.error("Firestore sync error on product purchase:", err);
      }

      onUpdateUser(updatedUser);
      alert(`Successfully purchased "${product.name}"! Access details have been unlocked in your orders.`);
    }
  };

  const handlePostUnlock = (post: any) => {
    const isUnlocked = viewingHistory.includes(post.id);
    if (isUnlocked || post.price === 0) return;

    if ((user?.balance || 0) < post.price) {
      alert(`Insufficient funds. Unlocking this post requires ${formatNaira(post.price)}.`);
      return;
    }

    if (confirm(`Unlock premium post for ${formatNaira(post.price)}?`)) {
      const updatedBalance = (user?.balance || 0) - post.price;
      const unlockTransaction = {
        id: `UNLOCK-${Date.now()}`,
        type: 'purchase',
        amount: post.price,
        description: `Unlocked content from ${creator.name}`,
        date: new Date().toISOString(),
        status: 'success'
      };

      const updatedUser = {
        ...user,
        balance: updatedBalance,
        transactions: [unlockTransaction, ...(user.transactions || [])]
      };

      try {
        updateDoc(doc(db, 'profiles', user.id), {
          balance: updatedBalance,
          transactions: updatedUser.transactions
        }).catch(err => console.error(err));
      } catch (e) {}

      onUpdateUser(updatedUser);
      onPostViewed(post.id);
      alert("Post unlocked successfully!");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 relative">
      {/* Cover Banner */}
      <div className="relative h-48 md:h-64 w-full bg-slate-900 overflow-hidden">
        <img 
          src={creator.image} 
          className="w-full h-full object-cover opacity-60 blur-xs" 
          alt="Cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
        
        {/* Navigation Toolbar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
          <button 
            onClick={onBack}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/60 active:scale-90 transition-all"
            id="back-btn-creator"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsTipping(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-xs uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
              id="tip-btn-creator"
            >
              <Coins size={14} />
              Send Tip
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info Overlay Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row gap-5 items-center md:items-end text-center md:text-left">
              <div className="relative -mt-20 md:-mt-24">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] border-4 border-white bg-slate-100 overflow-hidden shadow-2xl">
                  <img 
                    src={creator.avatar} 
                    className="w-full h-full object-cover" 
                    alt={creator.name} 
                  />
                </div>
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full" title="Active now"></div>
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-2xl md:text-3xl font-display font-black text-slate-900 uppercase tracking-tight">{creator.name}</h1>
                  <BadgeCheck size={22} className="text-yellow-500 fill-yellow-500 shrink-0" />
                  <span className="bg-blue-600/10 text-blue-600 border border-blue-600/20 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                    {creator.category}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-semibold mt-1">@{creator.username.replace(/^@/, '')}</p>
                <p className="text-[10px] font-black uppercase text-yellow-600 tracking-widest mt-1.5 flex items-center gap-1 justify-center md:justify-start">
                  <Sparkles size={11} className="fill-yellow-500" /> Premium Elite Creator
                </p>
              </div>
            </div>

            {/* Sub and Chat actions */}
            <div className="flex gap-3 justify-center items-center">
              {onMessageClick && (
                <button 
                  onClick={() => onMessageClick(creator.username)}
                  className="px-6 py-3.5 text-xs font-black uppercase tracking-widest bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all flex items-center gap-2 shadow-xs"
                >
                  <MessageSquare size={16} className="text-slate-500" />
                  Message
                </button>
              )}
              
              <button 
                onClick={handleSubscribeClick}
                className={cn(
                  "px-8 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 border",
                  isFollowed
                    ? "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                    : "bg-navy-800 text-yellow-500 border-navy-800 hover:bg-navy-950"
                )}
              >
                {isFollowed ? 'Subscribed' : `Subscribe (${formatNaira(subscriptionPrice)})`}
              </button>
            </div>
          </div>

          {/* Quick Metrics Stats row */}
          <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-50 py-6 my-8 text-center">
            <div>
              <p className="text-xl font-black text-slate-900">1.2K</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Subscribers</p>
            </div>
            <div>
              <p className="text-xl font-black text-slate-900">5.4K</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Likes Received</p>
            </div>
            <div>
              <p className="text-xl font-black text-slate-900">{creatorPosts.length}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Elite Posts</p>
            </div>
          </div>

          {/* Personal Biography */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biography</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">{creator.bio}</p>
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className="flex border-b border-slate-200 mt-10">
          <button 
            onClick={() => setActiveTab('posts')}
            className={cn(
              "flex-1 py-4 font-black uppercase tracking-wider text-xs border-b-2 transition-colors flex items-center justify-center gap-2",
              activeTab === 'posts' 
                ? "text-navy-800 border-navy-800" 
                : "text-slate-400 border-transparent hover:text-slate-600"
            )}
          >
            <Compass size={14} />
            Exclusive Posts ({creatorPosts.length})
          </button>
          <button 
            onClick={() => setActiveTab('shop')}
            className={cn(
              "flex-1 py-4 font-black uppercase tracking-wider text-xs border-b-2 transition-colors flex items-center justify-center gap-2",
              activeTab === 'shop' 
                ? "text-navy-800 border-navy-800" 
                : "text-slate-400 border-transparent hover:text-slate-600"
            )}
          >
            <ShoppingBag size={14} />
            VIP Shop ({creatorProducts.length})
          </button>
          <button 
            onClick={() => setActiveTab('bio')}
            className={cn(
              "flex-1 py-4 font-black uppercase tracking-wider text-xs border-b-2 transition-colors flex items-center justify-center gap-2",
              activeTab === 'bio' 
                ? "text-navy-800 border-navy-800" 
                : "text-slate-400 border-transparent hover:text-slate-600"
            )}
          >
            <Info size={14} />
            Info & FAQ
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-8">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {creatorPosts.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-500">
                  <Lock className="mx-auto mb-4 text-slate-300" size={32} />
                  <p className="font-bold">No exclusive posts yet.</p>
                  <p className="text-xs text-slate-400 mt-1">This creator hasn't uploaded any premium feed media yet.</p>
                </div>
              ) : (
                creatorPosts.map((post) => {
                  const isUnlocked = viewingHistory.includes(post.id) || post.price === 0;
                  return (
                    <div key={post.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden p-6 shadow-sm space-y-4">
                      {/* Post Header */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={post.creatorAvatar} className="w-10 h-10 rounded-full border border-slate-100 object-cover" alt="" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-none">{post.creatorName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">@{post.creatorUsername.replace(/^@/, '')}</p>
                          </div>
                        </div>
                        
                        {post.price > 0 && (
                          <div className={cn(
                            "px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border",
                            isUnlocked 
                              ? "bg-green-50 text-green-500 border-green-100" 
                              : "bg-yellow-500/10 text-yellow-600 border-yellow-500/10"
                          )}>
                            {isUnlocked ? "Unlocked" : `${formatNaira(post.price)} Unlock`}
                          </div>
                        )}
                      </div>

                      {/* Post Text Description */}
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">
                        {post.content}
                      </p>

                      {/* Media container */}
                      <div 
                        onClick={() => handlePostUnlock(post)}
                        className={cn(
                          "relative aspect-video rounded-3xl overflow-hidden group bg-slate-900 border border-slate-100",
                          !isUnlocked && "cursor-pointer active:scale-[0.99] transition-transform"
                        )}
                      >
                        <img 
                          src={post.image} 
                          className={cn(
                            "w-full h-full object-cover transition-all duration-700",
                            !isUnlocked && "blur-2xl opacity-60 scale-105"
                          )} 
                          alt="Teaser" 
                        />
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-xs">
                            <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-4">
                              <Lock size={22} className="text-yellow-400 animate-pulse" />
                            </div>
                            <h4 className="text-white text-md font-black uppercase tracking-wider">Premium Elite Content</h4>
                            <p className="text-slate-200 text-xs mt-1 font-medium max-w-xs">Pay {formatNaira(post.price)} to instantly unlock this exclusive photo pack</p>
                            
                            <button className="mt-5 bg-yellow-500 text-slate-900 px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">
                              Unlock Pack
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Post footer stats */}
                      <div className="flex justify-between items-center text-slate-400 text-xs font-semibold pt-2 border-t border-slate-50">
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                            <Heart size={16} className="text-slate-400" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                            <MessageSquare size={16} />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                        <div className="flex gap-1.5">
                          {post.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="bg-slate-50 text-[10px] text-slate-500 border border-slate-100 px-2 py-0.5 rounded-md">#{t.replace(/\s+/g, '')}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creatorProducts.map((product) => (
                <div key={product.id} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-5">
                      <img src={product.image} className="w-full h-full object-cover" alt="" />
                      <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 border border-slate-100 text-[8px] font-black text-slate-800 uppercase tracking-widest rounded-full shadow-xs">
                        {product.category}
                      </div>
                    </div>
                    <h4 className="text-slate-900 font-bold text-base leading-tight">{product.name}</h4>
                    <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed leading-relaxed">{product.desc}</p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Pricing</p>
                      <p className="text-lg font-black text-yellow-600 mt-0.5">{formatNaira(product.price)}</p>
                    </div>

                    <button 
                      onClick={() => handleProductBuy(product)}
                      className="bg-navy-800 text-yellow-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-950 active:scale-95 transition-all"
                    >
                      Buy Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-bold">
                  <TrendingUp size={18} className="text-blue-500" />
                  <h4>Category & Focus</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Registered category is <span className="font-bold text-slate-900">{creator.category}</span>. Specialized in high-fashion modeling, digital premium content curation, and VIP fan experiences.
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-bold">
                  <UserPlus size={18} className="text-yellow-500" />
                  <h4>Verified Creator</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  This account has completed formal identity verification desk procedures, confirming full ownership and authentic original media authorization.
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-bold">
                  <Zap size={18} className="text-amber-500" />
                  <h4>Service Response Times</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Tips and private direct messages are typically prioritized, with verified creators targeting custom video/photo responses within 24-48 business hours.
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-bold">
                  <HelpCircle size={18} className="text-indigo-500" />
                  <h4>Subscriber FAQ</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Accessing unlocked posts and digital products can be done on any device. Payments are processed securely via encrypted digital channels.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tipping Dialog Modal */}
      <AnimatePresence>
        {isTipping && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTipping(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 max-w-sm w-full p-6 md:p-8 relative z-10 shadow-2xl overflow-hidden"
              id="tipping-modal"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full"></div>
              
              {tipSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <CheckCircleIcon size={36} />
                  </div>
                  <h3 className="text-xl font-display font-black text-slate-900 uppercase">Tip Delivered!</h3>
                  <p className="text-slate-500 text-xs font-semibold">Your generous support of {formatNaira(parseInt(tipAmount))} has been transferred to {creator.name}.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-display font-black text-slate-900 uppercase">Support Creator</h3>
                    <p className="text-slate-400 text-xs font-medium mt-1">Send a direct financial tip to show appreciation for {creator.name}'s premium content.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {['1000', '2500', '5000'].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setTipAmount(amt)}
                        className={cn(
                          "py-3 border-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                          tipAmount === amt 
                            ? "bg-yellow-500 border-yellow-500 text-slate-900 font-black shadow-sm" 
                            : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200"
                        )}
                      >
                        {formatNaira(parseInt(amt))}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Custom Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₦</span>
                      <input 
                        type="number" 
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                        placeholder="Enter tip amount" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-8 pr-4 text-sm font-bold focus:outline-hidden focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between text-xs font-bold border border-slate-100">
                    <span className="text-slate-400">Your Wallet Balance</span>
                    <span className="text-slate-900 font-black">{formatNaira(user?.balance || 0)}</span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsTipping(false)}
                      className="flex-1 py-3.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSendTip}
                      disabled={isSubmittingTip}
                      className="flex-1 py-3.5 bg-yellow-500 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-50"
                    >
                      {isSubmittingTip ? "Sending..." : "Send Tip"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple fallback icon wrapper
function CheckCircleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
