import React from 'react';
import { 
  Terminal, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Code2, 
  Database,
  ArrowUpRight
} from 'lucide-react';
import { Language } from '../lib/types';
import { TRANSLATIONS } from '../lib/i18n';

interface FooterProps {
  lang: Language;
  onOpenCodeModal: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenCodeModal,
  onOpenAuth,
  onOpenDashboard,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="border-t border-slate-800 bg-[#060911] text-slate-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-mono font-bold text-white text-base">
                N
              </div>
              <span className="font-extrabold text-base text-white tracking-wider">
                {lang === 'ar' ? 'نكسس ديجيتال' : 'NEXUS DIGITAL'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'وكالة هندسة برمجية متخصصة في معمارية Next.js 14 وتطوير تطبيقات الويب السريعة والذكاء الاصطناعي مع أمان Supabase RLS.'
                : 'Next.js 14 full-stack agency engineering high-throughput web applications, AI vector pipelines, and zero-trust Supabase backends.'}
            </p>
            <div className="pt-1 flex items-center gap-2 font-mono text-[11px] text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-mono uppercase text-white font-bold text-xs tracking-wider">
              {t.footer.linksTitle}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-cyan-400 transition-colors">
                  {t.nav.pricing}
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-cyan-400 transition-colors">
                  {t.nav.calculator}
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenCodeModal}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.nav.docs}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {t.nav.dashboard}
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="font-mono uppercase text-white font-bold text-xs tracking-wider">
              {t.footer.techTitle}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Next.js 14 App Router',
                'React Server Components',
                'Supabase SSR Auth',
                'PostgreSQL RLS',
                'pgvector Embeddings',
                'Tailwind CSS',
                'TypeScript 5',
                'Docker & Terraform',
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Details & Social Media */}
          <div className="space-y-3">
            <h4 className="font-mono uppercase text-white font-bold text-xs tracking-wider">
              {lang === 'ar' ? 'معلومات التواصل والمقر' : 'Headquarters & Contact'}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold">
                    {lang === 'ar' ? 'بورصا، تركيا' : 'Bursa, Turkey'}
                  </span>
                  <span className="text-slate-500 block text-[11px]">
                    {lang === 'ar' ? 'المقر التقني الرئيسي' : 'Primary Engineering Hub'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">📱</span>
                <a 
                  href="tel:+905362515878"
                  className="text-slate-300 hover:text-cyan-400 font-mono transition-colors"
                >
                  +90 536 251 5878
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">✉️</span>
                <a 
                  href="mailto:saif.masx@gmail.com"
                  className="text-slate-300 hover:text-cyan-400 font-mono transition-colors"
                >
                  saif.masx@gmail.com
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-2">
                {lang === 'ar' ? 'شبكات التواصل المباشر:' : 'CONNECT DIRECTLY:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://wa.me/905362515878"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center gap-1 transition-all"
                  title="WhatsApp"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://linkedin.com/in/abusaif-almasri"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-all"
                  title="LinkedIn"
                >
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/saifmasx"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-all"
                  title="GitHub"
                >
                  <span>GitHub</span>
                </a>
                <a
                  href="https://x.com/abusaif_almasri"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-all"
                  title="X (Twitter)"
                >
                  <span>X / Twitter</span>
                </a>
                <a
                  href="https://t.me/abusaif_almasri"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900 border border-sky-500/30 text-sky-300 text-[11px] font-mono flex items-center gap-1 transition-all"
                  title="Telegram"
                >
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} Nexus Digital Agency. {t.footer.rights}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">{t.footer.security}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
