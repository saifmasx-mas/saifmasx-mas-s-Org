import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building, 
  Phone, 
  ArrowRight, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { Language, UserProfile, Subscription } from '../lib/types';
import { TRANSLATIONS } from '../lib/i18n';
import { 
  supabase, 
  isConfigured, 
  saveMockUser, 
  saveMockSubscription, 
  DEFAULT_USER, 
  DEFAULT_SUBSCRIPTION 
} from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialMode: 'signin' | 'signup';
  onAuthSuccess: (user: UserProfile, subscription?: Subscription) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialMode,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isConfigured && supabase) {
        // Real Supabase Auth Flow
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                company_name: companyName,
                phone: phone,
              },
            },
          });
          if (error) throw error;

          if (data.user) {
            const newUser: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              full_name: fullName || 'abusaif almasri',
              company_name: companyName || 'Al-Masri Digital Systems',
              avatar_url: '/src/assets/images/abusaif_avatar_1791381724704.jpg',
              phone: phone,
              role: 'client',
              created_at: new Date().toISOString(),
            };
            saveMockUser(newUser);
            onAuthSuccess(newUser);
            onClose();
          } else {
            setSuccessMsg(
              lang === 'ar' 
                ? 'تم إرسال رابط تأكيد إلى بريدك الإلكتروني.' 
                : 'Confirmation email sent. Please check your inbox.'
            );
          }
        } else {
          // Sign In
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;

          if (data.user) {
            // Fetch profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const userProfile: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              full_name: profileData?.full_name || 'abusaif almasri',
              company_name: profileData?.company_name || 'Al-Masri Digital Systems',
              avatar_url: profileData?.avatar_url || '/src/assets/images/abusaif_avatar_1791381724704.jpg',
              phone: profileData?.phone,
              role: profileData?.role || 'client',
              created_at: data.user.created_at || new Date().toISOString(),
            };

            saveMockUser(userProfile);
            onAuthSuccess(userProfile);
            onClose();
          }
        }
      } else {
        // Interactive Demo Sandbox Mode
        setTimeout(() => {
          const user: UserProfile = {
            id: `usr_${Math.random().toString(36).substring(2, 9)}`,
            email: email || 'abusaif.almasri@nexusdigital.agency',
            full_name: fullName || (mode === 'signin' ? 'abusaif almasri' : 'abusaif almasri'),
            company_name: companyName || 'Al-Masri Digital Systems',
            avatar_url: '/src/assets/images/abusaif_avatar_1791381724704.jpg',
            phone: phone || '+971 50 892 4110',
            role: 'client',
            created_at: new Date().toISOString(),
          };
          saveMockUser(user);
          onAuthSuccess(user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (tier: 'pro' | 'enterprise') => {
    const user: UserProfile = {
      ...DEFAULT_USER,
      company_name: tier === 'enterprise' ? 'Enterprise Global Cloud' : 'Apex AI Ventures',
    };
    const sub: Subscription = {
      ...DEFAULT_SUBSCRIPTION,
      plan_id: tier === 'enterprise' ? 'enterprise' : 'growth_pro',
      plan_name: tier === 'enterprise' ? 'Enterprise Elite' : 'Growth Pro',
      price_cents: tier === 'enterprise' ? 999900 : 499900,
    };
    saveMockUser(user);
    saveMockSubscription(sub);
    onAuthSuccess(user, sub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0b101c] rounded-2xl border border-slate-700/90 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              {isConfigured ? 'SUPABASE AUTH' : 'NEXUS AUTH GATEWAY'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {mode === 'signin' ? t.auth.signInTitle : t.auth.signUpTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin' ? t.auth.signInSub : t.auth.signUpSub}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">
                  {t.auth.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. abusaif almasri"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">
                  {t.auth.companyLabel}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Tech Corp"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              {t.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>{lang === 'ar' ? 'جارٍ التحقق...' : 'Authenticating...'}</span>
              </span>
            ) : (
              <>
                <span>{mode === 'signin' ? t.auth.submitSignIn : t.auth.submitSignUp}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <span className="text-xs text-slate-400">
            {mode === 'signin' ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount}{' '}
          </span>
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setErrorMsg(null);
            }}
            className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
          >
            {mode === 'signin' ? t.auth.signUpLink : t.auth.signInLink}
          </button>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-[11px] font-mono uppercase text-slate-400 mb-2.5 text-center">
            {t.auth.orDemo}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('pro')}
              className="p-2 rounded-lg text-[11px] font-mono text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{t.auth.demoClient}</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('enterprise')}
              className="p-2 rounded-lg text-[11px] font-mono text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>{t.auth.demoEnterprise}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
