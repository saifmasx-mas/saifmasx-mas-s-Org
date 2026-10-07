-- ====================================================================
-- NEXUS DIGITAL AGENCY - SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Profiles, Subscriptions & Service Requests with Row-Level Security (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'agency_member', 'admin')),
    locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'ar')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'free')),
    plan_id TEXT NOT NULL DEFAULT 'starter' CHECK (plan_id IN ('starter', 'growth_pro', 'enterprise')),
    plan_name TEXT NOT NULL DEFAULT 'Starter Sprint',
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    price_cents INTEGER NOT NULL DEFAULT 199900, -- in cents: $1,999.00 / month
    currency TEXT NOT NULL DEFAULT 'usd',
    current_period_start TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    current_period_end TIMESTAMPTZ DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '30 days') NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- 4. SERVICE REQUESTS / PROJECT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    service_category TEXT NOT NULL CHECK (service_category IN ('ai_engineering', 'fullstack_web', 'cloud_devops', 'ui_ux_design', 'mobile_app', 'security_audit')),
    budget_range TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'in_progress', 'completed', 'archived')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR PROFILES
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 7. RLS POLICIES FOR SUBSCRIPTIONS
-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- 8. RLS POLICIES FOR SERVICE REQUESTS
-- Users can read their own service requests
CREATE POLICY "Users can view own service requests"
    ON public.service_requests FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create service requests
CREATE POLICY "Users can insert own service requests"
    ON public.service_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own service requests
CREATE POLICY "Users can update own service requests"
    ON public.service_requests FOR UPDATE
    USING (auth.uid() = user_id);

-- 9. AUTOMATIC TRIGGER TO CREATE PROFILE & INITIAL SUBSCRIPTION ON USER SIGN UP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (id, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/src/assets/images/abusaif_avatar_1791381724704.jpg'),
        'client'
    );

    -- Insert default subscription (Starter Sprint)
    INSERT INTO public.subscriptions (
        user_id,
        status,
        plan_id,
        plan_name,
        billing_cycle,
        price_cents
    )
    VALUES (
        NEW.id,
        'active',
        'starter',
        'Starter Sprint',
        'monthly',
        199900
    );

    RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON public.service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
