import React, { useState } from 'react';
import { 
  Globe, 
  Database, 
  Code2, 
  Layers, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Language, UserProfile, Subscription } from '../lib/types';
import { TRANSLATIONS } from '../lib/i18n';
import { isConfigured } from '../lib/supabase';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  currentUser: UserProfile | null;
  subscription: Subscription;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onOpenDashboard: () => void;
  onOpenCodeModal: () => void;
  onOpenSupabaseConfig: () => void;
  currentView: 'landing' | 'dashboard';
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  currentUser,
  subscription,
  onOpenAuth,
  onSignOut,
  onOpenDashboard,
  onOpenCodeModal,
  onOpenSupabaseConfig,
  currentView,
  onGoHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090D16]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onGoHome}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                  <span className="font-mono font-black text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    N
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                    {lang === 'ar' ? 'نكسس ديجيتال' : 'NEXUS'}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold uppercase">
                    NEXT.JS 14
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {lang === 'ar' ? 'وكالة الحلول والأنظمة الرقمية' : 'Full-Stack Systems Agency'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          {currentView === 'landing' ? (
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
              <a href="#services" className="hover:text-cyan-400 transition-colors">
                {t.nav.services}
              </a>
              <a href="#pricing" className="hover:text-cyan-400 transition-colors">
                {t.nav.pricing}
              </a>
              <a href="#calculator" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {t.nav.calculator}
              </a>
              <a href="#testimonials" className="hover:text-cyan-400 transition-colors">
                {t.nav.testimonials}
              </a>
              
              {/* Code & Schema Trigger Button */}
              <button
                onClick={onOpenCodeModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-cyan-300 transition-all cursor-pointer"
                title="View Next.js 14 Architecture and PostgreSQL Schema"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.nav.docs}</span>
              </button>
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={onGoHome}
                className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                ← {lang === 'ar' ? 'العودة للموقع الرئيسي' : 'Back to Agency Site'}
              </button>
              <button
                onClick={onOpenCodeModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-cyan-300 transition-all cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.nav.docs}</span>
              </button>
            </div>
          )}

          {/* Right Action Icons & Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Supabase Status Pill */}
            <button
              onClick={onOpenSupabaseConfig}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                isConfigured 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:border-emerald-400' 
                  : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:border-indigo-400'
              }`}
              title="Click to view or connect Supabase credentials"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isConfigured ? 'Supabase Live' : 'Supabase Demo'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`}></span>
            </button>

            {/* Direct Contact Button */}
            <a
              href="https://wa.me/905362515878"
              target="_blank"
              rel="noreferrer"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 transition-all"
              title="Chat on WhatsApp: +90 536 251 5878"
            >
              <span>💬</span>
              <span>+90 536 251 5878</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenDashboard}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-cyan-400/60"
                  />
                  <span className="font-bold">{currentUser.full_name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-mono ${
                    currentView === 'dashboard' ? 'bg-slate-950 text-cyan-300' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {subscription.plan_id === 'growth_pro' ? 'PRO' : subscription.plan_id.toUpperCase()}
                  </span>
                </button>

                <button
                  onClick={onSignOut}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                  title={t.nav.signOut}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="relative group overflow-hidden px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {t.nav.signUp}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onToggleLang}
              className="p-2 rounded-lg text-xs font-semibold bg-slate-800 text-cyan-400"
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#090D16] px-4 pt-2 pb-6 space-y-3">
          {currentView === 'landing' ? (
            <div className="flex flex-col space-y-2 text-sm text-slate-300">
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400"
              >
                {t.nav.services}
              </a>
              <a 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400"
              >
                {t.nav.pricing}
              </a>
              <a 
                href="#calculator" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400"
              >
                {t.nav.calculator}
              </a>
              <a 
                href="#testimonials" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 hover:text-cyan-400"
              >
                {t.nav.testimonials}
              </a>
            </div>
          ) : (
            <button
              onClick={() => {
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left p-2 rounded-lg bg-slate-800 text-white font-medium text-sm"
            >
              ← {lang === 'ar' ? 'العودة للموقع الرئيسي' : 'Back to Agency Site'}
            </button>
          )}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenCodeModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 text-cyan-300 text-xs font-mono"
            >
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                {t.nav.docs}
              </span>
              <span className="text-[10px] text-slate-400">Next.js 14 + SQL</span>
            </button>

            <button
              onClick={() => {
                onOpenSupabaseConfig();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-mono"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                {t.nav.configSupabase}
              </span>
              <span className="text-[10px] text-emerald-400">{isConfigured ? 'Live' : 'Sandbox'}</span>
            </button>

            {currentUser ? (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    onOpenDashboard();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.nav.dashboard}
                </button>
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-lg bg-red-500/10 text-red-400 font-medium text-xs border border-red-500/20"
                >
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    onOpenAuth('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-lg bg-slate-800 text-white font-medium text-xs text-center"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs text-center"
                >
                  {t.nav.signUp}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
