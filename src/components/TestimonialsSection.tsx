import React from 'react';
import { Star, Quote, Award, CheckCircle2 } from 'lucide-react';
import { Language } from '../lib/types';
import { TRANSLATIONS, TESTIMONIALS_DATA } from '../lib/i18n';

interface TestimonialsSectionProps {
  lang: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="testimonials" className="py-24 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>{t.testimonials.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-7 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-all"
            >
              <div>
                {/* Metric Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.metric[lang]}</span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">
                  "{item.quote[lang]}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-5 border-t border-slate-800">
                <img
                  src={item.avatar}
                  alt={item.author}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-cyan-500/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.author}</h4>
                  <p className="text-xs text-slate-400">
                    {item.role[lang]} • <strong className="text-slate-300 font-semibold">{item.company}</strong>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Enterprise Logos Bar */}
        <div className="mt-16 pt-10 border-t border-slate-800/80">
          <p className="text-center text-xs font-mono uppercase text-slate-400 mb-6 tracking-widest">
            {lang === 'ar' ? 'شركات ومنصات اعتمدت على أنظمتنا البرمجية' : 'POWERING ENGINEERING AT GLOBAL TECH FIRMS'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-slate-300 font-mono font-black text-xl tracking-tighter hover:text-cyan-400 transition-colors">
              FINTRACK.AI
            </span>
            <span className="text-slate-300 font-mono font-black text-xl tracking-tighter hover:text-cyan-400 transition-colors">
              SYNTHETIX_LAB
            </span>
            <span className="text-slate-300 font-mono font-black text-xl tracking-tighter hover:text-cyan-400 transition-colors">
              BARAKAH CLOUD
            </span>
            <span className="text-slate-300 font-mono font-black text-xl tracking-tighter hover:text-cyan-400 transition-colors">
              APEX VENTURES
            </span>
            <span className="text-slate-300 font-mono font-black text-xl tracking-tighter hover:text-cyan-400 transition-colors">
              NEXUS QUANT
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
