import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Check, 
  Send, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Language, ServiceRequest } from '../lib/types';
import { TRANSLATIONS } from '../lib/i18n';

interface ProjectCalculatorProps {
  lang: Language;
  onGenerateProposal: (ticketData: Partial<ServiceRequest>) => void;
}

export const ProjectCalculator: React.FC<ProjectCalculatorProps> = ({
  lang,
  onGenerateProposal,
}) => {
  const [platform, setPlatform] = useState<'nextjs' | 'ai' | 'mobile' | 'fullstack'>('nextjs');
  const [urgency, setUrgency] = useState<'standard' | 'rush' | 'relaxed'>('standard');
  const [addons, setAddons] = useState<string[]>(['arabic_rtl', 'supabase_rls']);
  const [submitted, setSubmitted] = useState(false);

  const t = TRANSLATIONS[lang];

  const platformBasePrices = {
    nextjs: { price: 3800, weeks: 2, label: { en: 'Next.js 14 App Router Web', ar: 'منصة ويب Next.js 14 متكاملة' } },
    ai: { price: 5200, weeks: 3, label: { en: 'AI Engineering & Vector Pipeline', ar: 'هندسة الذكاء الاصطناعي والمتجهات' } },
    mobile: { price: 4600, weeks: 3, label: { en: 'Cross-Platform React Native App', ar: 'تطبيق جوال متعدد المنصات' } },
    fullstack: { price: 8900, weeks: 4, label: { en: 'Full Ecosystem (Web + Mobile + AI)', ar: 'منظومة كاملة (ويب + جوال + AI)' } },
  };

  const urgencyMultipliers = {
    standard: { factor: 1.0, weeksMult: 1.0, label: { en: 'Standard Sprint (14 Days)', ar: 'سبرنت قياسي (14 يوماً)' } },
    rush: { factor: 1.35, weeksMult: 0.6, label: { en: 'Accelerated Priority (7 Days)', ar: 'تسريع فائق الأولوية (7 أيام)' } },
    relaxed: { factor: 0.9, weeksMult: 1.4, label: { en: 'Flexible Milestone (30 Days)', ar: 'مراحل مرنة (30 يوماً)' } },
  };

  const addonOptions = [
    { id: 'supabase_rls', price: 1200, label: { en: 'Supabase RLS & PostgreSQL Security Audit', ar: 'تدقيق وتأمين قواعد RLS في Supabase' } },
    { id: 'arabic_rtl', price: 950, label: { en: 'Full Arabic RTL & Bidirectional Styling', ar: 'تعريب ودعم كامل للغة العربية (RTL)' } },
    { id: 'terraform_iac', price: 1500, label: { en: 'Terraform IaC & Zero-Downtime CI/CD', ar: 'بنية تحتية كودية Terraform وأتمتة CI/CD' } },
    { id: 'pgvector_rag', price: 1800, label: { en: 'Custom RAG Hybrid Search with pgvector', ar: 'محرك بحث متجهات RAG هجين' } },
  ];

  const toggleAddon = (id: string) => {
    setAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Calculations
  const baseCost = platformBasePrices[platform].price;
  const addonsCost = addons.reduce((sum, id) => {
    const item = addonOptions.find(o => o.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const finalCost = Math.round((baseCost + addonsCost) * urgencyMultipliers[urgency].factor);
  const finalWeeks = Math.max(1, Math.round(platformBasePrices[platform].weeks * urgencyMultipliers[urgency].weeksMult));

  const handleProposalSubmit = () => {
    const platformLabel = platformBasePrices[platform].label[lang];
    onGenerateProposal({
      title: `${platformLabel} (${finalWeeks} ${lang === 'ar' ? 'أسابيع' : 'Weeks'})`,
      service_category: platform === 'ai' ? 'ai_engineering' : platform === 'mobile' ? 'mobile_app' : 'fullstack_web',
      budget_range: `$${finalCost.toLocaleString()}`,
      priority: urgency === 'rush' ? 'urgent' : 'high',
      details: `Generated via Scope Estimator: Platform [${platform}], Urgency [${urgency}], Addons [${addons.join(', ')}]. Estimated: $${finalCost}.`,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="calculator" className="py-24 relative border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.calculator.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Estimator Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Controls Column (8 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-8">
            
            {/* Step 1: Platform Selection */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
                1. {t.calculator.projectType}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.keys(platformBasePrices) as Array<keyof typeof platformBasePrices>).map((key) => {
                  const p = platformBasePrices[key];
                  const isSelected = platform === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setPlatform(key)}
                      className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">{p.label[lang]}</div>
                      <div className="text-[11px] font-mono text-cyan-400">
                        From ${p.price.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Urgency */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
                2. {t.calculator.timeline}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(urgencyMultipliers) as Array<keyof typeof urgencyMultipliers>).map((key) => {
                  const u = urgencyMultipliers[key];
                  const isSelected = urgency === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setUrgency(key)}
                      className={`p-3 rounded-xl text-center transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/50 border-cyan-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{u.label[lang]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add-ons */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
                3. {t.calculator.addons}
              </label>
              <div className="space-y-2.5">
                {addonOptions.map((addon) => {
                  const isChecked = addons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-cyan-950/30 border-cyan-500/40 text-white'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{addon.label[lang]}</span>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">
                        +${addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Results Summary Column (4 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-xl shadow-cyan-950/30 sticky top-28">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4" />
              <span>PROJECT SUMMARY PROJECTION</span>
            </div>

            <div className="space-y-5 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">{t.calculator.estBudget}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                    ${finalCost.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">USD</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{t.calculator.estTimeline}:</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">
                  ~{finalWeeks} {lang === 'ar' ? 'أسابيع' : 'Weeks'}
                </span>
              </div>
            </div>

            <div className="py-5 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'نوع البنية الأساسية:' : 'Base Architecture:'}</span>
                <span className="text-white font-medium">{platform.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'الإضافات المختارة:' : 'Selected Modules:'}</span>
                <span className="text-cyan-300 font-mono">{addons.length} items</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'ضمان جودة الكود:' : 'SLA & Audit:'}</span>
                <span className="text-emerald-400 font-medium">Included 100%</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleProposalSubmit}
                disabled={submitted}
                className="w-full py-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>{lang === 'ar' ? 'تم تقديم الطلب بنجاح!' : 'Proposal Request Created!'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.calculator.requestProposal}</span>
                  </>
                )}
              </button>

              {submitted && (
                <p className="text-[11px] text-emerald-400 text-center mt-3 animate-in fade-in">
                  {t.calculator.proposalSent}
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
