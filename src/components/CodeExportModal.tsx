import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Database, 
  Layers, 
  Lock, 
  Terminal,
  Download
} from 'lucide-react';
import { Language } from '../lib/types';
import { TRANSLATIONS } from '../lib/i18n';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'middleware' | 'server' | 'client' | 'dashboard'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  const codeSnippets = {
    schema: `-- ====================================================================
-- NEXUS DIGITAL AGENCY - SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Profiles, Subscriptions & Service Requests with Row-Level Security (RLS)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'agency_member', 'admin')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'free')),
    plan_id TEXT NOT NULL DEFAULT 'starter' CHECK (plan_id IN ('starter', 'growth_pro', 'enterprise')),
    plan_name TEXT NOT NULL DEFAULT 'Starter Sprint',
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    price_cents INTEGER NOT NULL DEFAULT 199900,
    current_period_start TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    current_period_end TIMESTAMPTZ DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '30 days') NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR PROFILES
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 5. RLS POLICIES FOR SUBSCRIPTIONS
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- 6. AUTOMATIC TRIGGER FOR NEW USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        '/src/assets/images/abusaif_avatar_1791381724704.jpg'
    );

    INSERT INTO public.subscriptions (user_id, status, plan_id, plan_name, price_cents)
    VALUES (NEW.id, 'active', 'starter', 'Starter Sprint', 199900);

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`,

    middleware: `// middleware.ts (Next.js 14 App Router Session Protection & Refresh)
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Validate user session token securely with Supabase
  const { data: { user } } = await supabase.auth.getUser();

  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard');

  // Protect /dashboard route
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};`,

    server: `// lib/supabase/server.ts (Next.js 14 Server Components & Actions)
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if middleware is managing refreshed tokens
          }
        },
      },
    }
  );
}`,

    client: `// lib/supabase/client.ts (Next.js 14 Client Components)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}`,

    dashboard: `// app/dashboard/page.tsx (Next.js 14 Protected Server Component)
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Verify User Session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/login');
  }

  // 2. Fetch Profile and Subscription with RLS
  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
  ]);

  return (
    <div className="max-w-7xl mx-auto p-8 text-white">
      <h1 className="text-3xl font-bold">Welcome, {profile?.full_name}</h1>
      <div className="mt-4 p-6 bg-slate-900 rounded-xl border border-slate-800">
        <p className="font-mono text-cyan-400">Plan: {subscription?.plan_name}</p>
        <p className="text-slate-400">Status: {subscription?.status}</p>
      </div>
    </div>
  );
}`,
  };

  const currentCode = codeSnippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#0a0f1d] rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t.codeExport.title}
              </h3>
              <p className="text-xs text-slate-400">
                {t.codeExport.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex overflow-x-auto gap-1 p-3 bg-slate-950/80 border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'schema' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>schema.sql</span>
          </button>

          <button
            onClick={() => setActiveTab('middleware')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'middleware' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>middleware.ts</span>
          </button>

          <button
            onClick={() => setActiveTab('server')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'server' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>lib/supabase/server.ts</span>
          </button>

          <button
            onClick={() => setActiveTab('client')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'client' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>lib/supabase/client.ts</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>app/dashboard/page.tsx</span>
          </button>
        </div>

        {/* Code View Area */}
        <div className="relative flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070b14] font-mono text-xs text-slate-300">
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.codeExport.copied : t.codeExport.copyCode}</span>
          </button>

          <pre className="overflow-x-auto leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {lang === 'ar' 
              ? 'جميع الملفات موجودة في المجلد البرمجي وجاهزة للنشر مع Vercel و Supabase.' 
              : 'All files are saved in the project and ready to deploy with Vercel and Supabase.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
