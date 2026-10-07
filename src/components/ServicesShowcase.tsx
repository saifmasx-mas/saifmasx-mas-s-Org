import React, { useState } from 'react';
import { 
  Cpu, 
  LayoutGrid, 
  Server, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Layers, 
  Clock, 
  DollarSign,
  X
} from 'lucide-react';
import { Language, ServiceItem } from '../lib/types';
import { TRANSLATIONS, SERVICES_DATA } from '../lib/i18n';

interface ServicesShowcaseProps {
  lang: Language;
  onRequestService: (service: ServiceItem) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-6 h-6 text-cyan-400" />,
  LayoutGrid: <LayoutGrid className="w-6 h-6 text-sky-400" />,
  Server: <Server className="w-6 h-6 text-indigo-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-purple-400" />,
  Smartphone: <Smartphone className="w-6 h-6 text-blue-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
};

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({
  lang,
  onRequestService,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai' | 'web' | 'cloud' | 'mobile'>('all');
  const t = TRANSLATIONS[lang];

  const filteredServices = SERVICES_DATA.filter(service => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ai') return service.category === 'ai_engineering';
    if (activeFilter === 'web') return service.category === 'fullstack_web' || service.category === 'ui_ux_design';
    if (activeFilter === 'cloud') return service.category === 'cloud_devops' || service.category === 'security_audit';
    if (activeFilter === 'mobile') return service.category === 'mobile_app';
    return true;
  });

  return (
    <section id="services" className="py-24 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.services.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.services.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: lang === 'ar' ? 'جميع الخدمات' : 'All Capabilities' },
            { id: 'ai', label: lang === 'ar' ? 'الذكاء الاصطناعي (AI)' : 'AI Engineering' },
            { id: 'web', label: lang === 'ar' ? 'الويب و Next.js 14' : 'Next.js 14 Full-Stack' },
            { id: 'cloud', label: lang === 'ar' ? 'السحابة والأمان' : 'Cloud & DevOps' },
            { id: 'mobile', label: lang === 'ar' ? 'تطبيقات الجوال' : 'Mobile Apps' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 glass-panel-hover flex flex-col justify-between"
            >
              <div>
                {/* Top Icon & Category Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {iconMap[service.iconName] || <Cpu className="w-6 h-6 text-cyan-400" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{service.turnaroundTime[lang]}</span>
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {service.title[lang]}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  {service.shortDesc[lang]}
                </p>

                {/* Deliverables Preview */}
                <div className="space-y-2 mb-6 pt-4 border-t border-slate-800/80">
                  {service.deliverables[lang].slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {service.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800 text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    {t.services.startingAt}
                  </span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {service.startingPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 transition-colors cursor-pointer"
                  >
                    {t.services.learnMore}
                  </button>
                  <button
                    onClick={() => onRequestService(service)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.services.bookCall}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Blueprint Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0b101c] rounded-2xl border border-slate-700 shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                {iconMap[selectedService.iconName]}
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  ARCHITECTURAL BLUEPRINT
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {selectedService.title[lang]}
                </h3>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {selectedService.detailedDesc[lang]}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-3 tracking-wider">
                {lang === 'ar' ? 'المخرجات الهندسية المضمونة' : 'GUARANTEED DELIVERABLES'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedService.deliverables[lang].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 tracking-wider">
                {lang === 'ar' ? 'حزمة التقنيات المستخدمة' : 'PRODUCTION TECH STACK'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedService.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">
                  {t.services.turnaround}: <strong className="text-white">{selectedService.turnaroundTime[lang]}</strong>
                </span>
                <span className="text-xs text-slate-400 block font-mono">
                  {t.services.startingAt}: <strong className="text-cyan-400 text-sm">{selectedService.startingPrice}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    const s = selectedService;
                    setSelectedService(null);
                    onRequestService(s);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>{t.services.bookCall}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
