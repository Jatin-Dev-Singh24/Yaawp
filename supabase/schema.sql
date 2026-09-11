-- ==============================================================================
-- Supabase Schema & Row Level Security (RLS) Setup
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    name TEXT,
    avatar TEXT,
    bio TEXT DEFAULT '',
    website TEXT,
    email TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    caption TEXT DEFAULT '',
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image',
    filter_class TEXT DEFAULT 'filter-normal',
    tags TEXT[] DEFAULT '{}',
    location TEXT,
    audience TEXT DEFAULT 'everyone',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create User Data Tables
CREATE TABLE IF NOT EXISTS public.custom_circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'Users',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.circle_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL REFERENCES public.custom_circles(id) ON DELETE CASCADE,
    member_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_posts (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS public.hidden_profiles (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hidden_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, hidden_user_id)
);

-- ==============================================================================
-- 5. Enable Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_profiles ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 6. Row Level Security Policies for `profiles`
--    - Users can only read their own profile
--    - Users can only update their own profile
--    - Users can insert their own profile
-- ==============================================================================
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- ==============================================================================
-- 7. Row Level Security Policies for `posts`
--    - Users can only read their own posts
--    - Users can only insert their own posts
--    - Users can only update their own posts
--    - Users can delete their own posts
-- ==============================================================================
DROP POLICY IF EXISTS "Users can read own posts" ON public.posts;
CREATE POLICY "Users can read own posts"
    ON public.posts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own posts" ON public.posts;
CREATE POLICY "Users can insert own posts"
    ON public.posts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts"
    ON public.posts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts"
    ON public.posts
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. Row Level Security Policies for User-Specific Data
-- ==============================================================================
DROP POLICY IF EXISTS "Users can manage own custom circles" ON public.custom_circles;
CREATE POLICY "Users can manage own custom circles"
    ON public.custom_circles
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own circle members" ON public.circle_members;
CREATE POLICY "Users can manage own circle members"
    ON public.circle_members
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.custom_circles
            WHERE public.custom_circles.id = circle_members.circle_id
            AND public.custom_circles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.custom_circles
            WHERE public.custom_circles.id = circle_members.circle_id
            AND public.custom_circles.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can manage own saved posts" ON public.saved_posts;
CREATE POLICY "Users can manage own saved posts"
    ON public.saved_posts
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own hidden profiles" ON public.hidden_profiles;
CREATE POLICY "Users can manage own hidden profiles"
    ON public.hidden_profiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 9. Automatic Profile Creation Trigger on Auth Signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, name, avatar, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        NEW.email
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 10. Enable Supabase Realtime for Posts & Profiles
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'posts'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
    END IF;
END $$;

-- ==============================================================================
-- 11. Supabase Storage Bucket & Policies for Media (Photos, Videos, Avatars, Voice Notes)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for media in the 'media' bucket
DROP POLICY IF EXISTS "Public Media Access" ON storage.objects;
CREATE POLICY "Public Media Access"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'media');

-- Authenticated upload access
DROP POLICY IF EXISTS "Authenticated Upload Media" ON storage.objects;
CREATE POLICY "Authenticated Upload Media"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'media');

-- Authenticated update access
DROP POLICY IF EXISTS "Authenticated Update Media" ON storage.objects;
CREATE POLICY "Authenticated Update Media"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'media')
    WITH CHECK (bucket_id = 'media');

-- Authenticated delete access
DROP POLICY IF EXISTS "Authenticated Delete Media" ON storage.objects;
CREATE POLICY "Authenticated Delete Media"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'media');


