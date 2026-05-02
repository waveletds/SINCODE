-- 1. Create Profiles table (linked to Auth users)
-- This table is in the public schema and uses RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE, -- Added for identity mapping
  phone TEXT UNIQUE, -- Added unique constraint
  dob DATE,
  gender TEXT,
  state TEXT,
  location TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_creator BOOLEAN DEFAULT FALSE,
  wallet_balance DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Posts table for creators
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image', -- image, video
  is_premium BOOLEAN DEFAULT FALSE,
  price DECIMAL(10, 2) DEFAULT 0.00,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active', -- active, expired
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscriber_id, creator_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 5. Profiles Policies
-- Everyone can view profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- Only the user can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. Posts Policies
-- Logic: If post is not premium, everyone can see. If premium, only subscribers or the creator can see.
CREATE POLICY "Viewable posts policy" 
ON public.posts FOR SELECT 
USING (
  is_premium = false 
  OR auth.uid() = creator_id 
  OR EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE subscriber_id = auth.uid() 
    AND creator_id = public.posts.creator_id 
    AND status = 'active'
  )
);

-- Creators can manage their own posts
CREATE POLICY "Creators can manage own posts" 
ON public.posts FOR ALL USING (auth.uid() = creator_id);

-- 7. Subscriptions Policies
-- Users can see their own subscriptions and creators can see their subscribers
CREATE POLICY "Users can view relevant subscriptions" 
ON public.subscriptions FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);

-- 8. Function to handle new user signup automatically via trigger
-- This ensures every time a user signs up via Auth, a profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, username, email, phone, dob, gender, state, location)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'Anonymous'), 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    CASE WHEN NEW.raw_user_meta_data->>'dob' IS NOT NULL AND NEW.raw_user_meta_data->>'dob' <> '' THEN (NEW.raw_user_meta_data->>'dob')::date ELSE NULL END,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'location'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Trigger for new user
-- Drop if exists to avoid errors on retry
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
