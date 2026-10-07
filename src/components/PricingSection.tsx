import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { Language, PricingPlan, SubscriptionPlanId, Subscription } from '../lib/types';
import { TRANSLATIONS, PRICING_PLANS } from '../lib/i18n';

interface PricingSectionProps {
  lang: Language;
  currentSubscription: Subscription;
  onSelectPlan: (planId: SubscriptionPlanId, cycle: 'monthly' | 'yearly') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  lang,
  currentSubscription,
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const t = TRANSLATIONS[lang];

  return (
    <section id="pricing" className="py-24 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.pricing.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            {t.pricing.subtitle}
          </p>

          {/* Billing Switch */}
          <div className="inline-flex items-center p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.pricing.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{t.pricing.yearly}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                billingCycle === 'yearly' ? 'bg-slate-950 text-cyan-300' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
              }`}>
                {t.pricing.saveBadge}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const isCurrentPlan = currentSubscription.plan_id === plan.id;
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'glass-panel border-cyan-500/50 shadow-2xl shadow-cyan-500/10 p-8 scale-100 lg:-translate-y-2'
                    : 'glass-panel border-slate-800/90 p-7 hover:border-slate-700'
                }`}
              >
                {/* Popular / Max Velocity Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/30">
                    {plan.badge[lang]}
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name[lang]}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {plan.tagline[lang]}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-slate-400 text-2xl font-bold font-mono">$</span>
                      <span className="text-5xl font-black text-white font-mono tracking-tight">
                        {price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {billingCycle === 'monthly' ? t.pricing.perMonth : t.pricing.perYear}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                        {lang === 'ar' ? 'يتم الدفع سنوياً - وفرت 20%' : 'Billed annually • 20% discount applied'}
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
                      {lang === 'ar' ? 'المزايا المشمولة في الباقة:' : "WHAT'S INCLUDED:"}
                    </span>
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 text-xs ${
                          feature.included ? 'text-slate-200' : 'text-slate-600 line-through'
                        }`}
                      >
                        <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                          feature.included 
                            ? feature.highlight ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-cyan-400'
                            : 'bg-slate-900 text-slate-600'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className={feature.highlight ? 'font-semibold text-white' : ''}>
                          {feature.title[lang]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan CTA Button */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan.id, billingCycle)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCurrentPlan
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span>
                      {isCurrentPlan ? t.pricing.currentPlan : t.pricing.subscribeNow}
                    </span>
                    {!isCurrentPlan && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-3 font-mono">
                    {lang === 'ar' ? 'إيقاف مؤقت أو إلغاء بأي وقت' : 'Pause or cancel anytime'}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Security & Money Back Pill */}
        <div className="mt-14 max-w-2xl mx-auto p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center flex items-center justify-center gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{t.pricing.moneyBack}</span>
        </div>

      </div>
    </section>
  );
};
