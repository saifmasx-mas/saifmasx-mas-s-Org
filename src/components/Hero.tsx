import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  Database, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2,
  Code2,
  Play
} from 'lucide-react';
import { Language } from '../lib/types';
import { TRANSLATIONS } from '../lib/i18n';

interface HeroProps {
  lang: Language;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenCodeModal: () => void;
  onScrollToPricing: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onOpenAuth,
  onOpenCodeModal,
  onScrollToPricing,
  onOpenCalculator,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background radial glow & geometric grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/20 to-purple-700/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Architectural Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-inner shadow-cyan-500/10 hover:border-cyan-400/50 transition-all cursor-pointer"
               onClick={onOpenCodeModal}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold tracking-wide uppercase">{t.hero.badge}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hover:text-cyan-200 flex items-center gap-1">
              {lang === 'ar' ? 'عرض الكود' : 'View Code'} →
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            <span className="block">{t.hero.headline1}</span>
            <span className="text-gradient-cyan block mt-1">
              {t.hero.headline2}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            {t.hero.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-7 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 hover:opacity-95 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{t.hero.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onScrollToPricing}
              className="px-6 py-4 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-cyan-500/40 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{t.hero.secondaryCta}</span>
            </button>

            <button
              onClick={onOpenCodeModal}
              className="px-5 py-4 rounded-xl font-mono text-xs text-slate-300 hover:text-cyan-300 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>{t.hero.viewArchitecture}</span>
            </button>
          </div>

          {/* Lead Architect & Founder Profile Showcase */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3.5 px-4 py-2.5 rounded-2xl glass-panel border border-cyan-500/30 bg-slate-900/80 shadow-lg shadow-cyan-950/40 hover:border-cyan-400/50 transition-all">
              <img
                src="/src/assets/images/abusaif_avatar_1791381724704.jpg"
                alt="abusaif almasri"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover object-top border-2 border-cyan-400/60 shadow-md shadow-cyan-500/20"
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    abusaif almasri
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
                    {lang === 'ar' ? 'المهندس الرئيسي' : 'Lead Architect'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'أبو سيف المصري • مطور Next.js 14 وبنية السحابية' : 'Full-Stack Next.js 14 & Supabase Systems Engineer'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Architecture Interactive Terminal / Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto rounded-2xl glass-panel p-2 sm:p-4 border border-slate-800 shadow-2xl shadow-cyan-950/50">
          <div className="bg-[#0b101c] rounded-xl border border-slate-800/80 overflow-hidden">
            
            {/* Terminal Top Window Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-2 font-mono text-xs text-slate-400">
                  nexus-production-cluster // Next.js 14 App Router + Supabase RLS
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active 200 OK</span>
              </div>
            </div>

            {/* Architecture Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/80 text-left">
              
              {/* Telemetry Item 1 */}
              <div className="p-4 sm:p-5 flex flex-col justify-between hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>FRAMEWORK</span>
                  <span className="text-cyan-400 font-semibold">SSR + RSC</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">Next.js 14.2</div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'توجيه App Router مع تدفق خادم فوري' : 'Streaming Server Components with edge caching'}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>TTFB: 42ms (Global Edge)</span>
                </div>
              </div>

              {/* Telemetry Item 2 */}
              <div className="p-4 sm:p-5 flex flex-col justify-between hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>DATABASE</span>
                  <span className="text-purple-400 font-semibold">POSTGRES</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">Supabase Auth</div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'حماية تامة مع سياسات RLS وجداول Profiles' : 'Full Row-Level Security & Profiles Schema'}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>RLS Enforced: 100%</span>
                </div>
              </div>

              {/* Telemetry Item 3 */}
              <div className="p-4 sm:p-5 flex flex-col justify-between hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>AI PIPELINE</span>
                  <span className="text-amber-400 font-semibold">PGVECTOR</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">Vector Embeddings</div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'بحث دلالي فائق ووكلاء أذكياء مخصصين' : 'Hybrid semantic search & custom RAG pipelines'}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cosine Similarity: &lt;18ms</span>
                </div>
              </div>

              {/* Telemetry Item 4 */}
              <div className="p-4 sm:p-5 flex flex-col justify-between hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>STYLING</span>
                  <span className="text-cyan-400 font-semibold">TAILWIND</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">Bilingual RTL</div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'دعم كامل للخطوط العربية والإنجليزية' : 'Native bidirectional LTR/RTL typography'}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tajawal + Jakarta Sans</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4 Key Business Metrics */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center hover:border-cyan-500/30 transition-all">
            <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1 font-mono">
              {t.hero.metricUptime}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero.metricUptimeSub}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center hover:border-cyan-500/30 transition-all">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1 font-mono">
              {t.hero.metricDelivery}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero.metricDeliverySub}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center hover:border-cyan-500/30 transition-all">
            <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1 font-mono">
              {t.hero.metricValue}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero.metricValueSub}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center hover:border-cyan-500/30 transition-all">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1 font-mono">
              {t.hero.metricRating}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero.metricRatingSub}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
