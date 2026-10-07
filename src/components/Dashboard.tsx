import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Layers, 
  Key, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Download, 
  Copy, 
  Check, 
  Database, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';
import { 
  Language, 
  UserProfile, 
  Subscription, 
  ServiceRequest, 
  SubscriptionPlanId 
} from '../lib/types';
import { TRANSLATIONS, PRICING_PLANS } from '../lib/i18n';
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  isConfigured, 
  saveMockUser, 
  saveMockSubscription, 
  saveMockRequests 
} from '../lib/supabase';

interface DashboardProps {
  lang: Language;
  user: UserProfile;
  subscription: Subscription;
  requests: ServiceRequest[];
  onUpdateSubscription: (sub: Subscription) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onAddRequest: (req: ServiceRequest) => void;
  onOpenCodeModal: () => void;
  onOpenSupabaseConfig: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lang,
  user,
  subscription,
  requests,
  onUpdateSubscription,
  onUpdateProfile,
  onAddRequest,
  onOpenCodeModal,
  onOpenSupabaseConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'requests' | 'apikeys' | 'profile'>('overview');
  
  // Profile edit state
  const [fullName, setFullName] = useState(user.full_name);
  const [companyName, setCompanyName] = useState(user.company_name);
  const [phone, setPhone] = useState(user.phone || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // New ticket state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<ServiceRequest['service_category']>('fullstack_web');
  const [ticketPriority, setTicketPriority] = useState<ServiceRequest['priority']>('high');
  const [ticketBudget, setTicketBudget] = useState('$5,000 - $10,000');
  const [ticketDetails, setTicketDetails] = useState('');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      full_name: fullName,
      company_name: companyName,
      phone: phone,
    };
    saveMockUser(updated);
    onUpdateProfile(updated);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    const newReq: ServiceRequest = {
      id: `req_${Math.random().toString(36).substring(2, 8)}`,
      user_id: user.id,
      title: ticketTitle,
      service_category: ticketCategory,
      priority: ticketPriority,
      budget_range: ticketBudget,
      status: 'submitted',
      details: ticketDetails,
      created_at: new Date().toISOString(),
    };

    onAddRequest(newReq);
    setShowNewTicketModal(false);
    setTicketTitle('');
    setTicketDetails('');
  };

  const handleTierSwitch = (planId: SubscriptionPlanId) => {
    const plan = PRICING_PLANS.find(p => p.id === planId);
    if (!plan) return;

    const updatedSub: Subscription = {
      ...subscription,
      plan_id: planId,
      plan_name: plan.name[lang],
      price_cents: (subscription.billing_cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice) * 100,
    };
    saveMockSubscription(updatedSub);
    onUpdateSubscription(updatedSub);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner / Verification Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar_url}
            alt={user.full_name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t.dashboard.welcome}, {user.full_name}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Session Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.company_name} • <span className="text-cyan-400 font-mono">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCodeModal}
            className="px-3 py-2 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.dashboard.viewSchemaBtn}</span>
          </button>
          <button
            onClick={onOpenSupabaseConfig}
            className="px-3 py-2 rounded-xl text-xs font-mono bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isConfigured ? 'Supabase Live' : 'Supabase Demo'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-3 mb-8 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{t.dashboard.tabOverview}</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t.dashboard.tabSubscription}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300 font-mono">
            {subscription.plan_id.toUpperCase()}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.dashboard.tabRequests}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-white font-mono">
            {requests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('apikeys')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'apikeys'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>{t.dashboard.tabApiKeys}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t.dashboard.tabProfile}</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Top 3 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Active Subscription Status */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                <span>{t.dashboard.activeSubscription}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-2xl font-black text-white capitalize mb-1">
                {subscription.plan_id.replace('_', ' ')}
              </div>
              <div className="text-xs text-slate-400 font-mono mb-4">
                ${(subscription.price_cents / 100).toLocaleString()} / {subscription.billing_cycle}
              </div>
              <button
                onClick={() => setActiveTab('billing')}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
              >
                {t.dashboard.manageBilling} →
              </button>
            </div>

            {/* Active Sprints */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                <span>ACTIVE SPRINTS</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white mb-1">
                {requests.filter(r => r.status === 'in_progress').length} In Progress
              </div>
              <div className="text-xs text-slate-400 font-mono mb-4">
                {requests.length} Total Tickets Handled
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.dashboard.newTicket}</span>
              </button>
            </div>

            {/* Enterprise Security */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                <span>SECURITY & RLS</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 mb-1">
                Protected
              </div>
              <div className="text-xs text-slate-400 font-mono mb-4">
                Row-Level Security Active
              </div>
              <button
                onClick={onOpenCodeModal}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Inspect PostgreSQL RLS →
              </button>
            </div>

          </div>

          {/* Active Tickets Table Preview */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{t.dashboard.recentTickets}</span>
              </h3>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.dashboard.newTicket}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/50 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">{t.dashboard.ticketId}</th>
                    <th className="p-4">Title & Details</th>
                    <th className="p-4">{t.dashboard.serviceType}</th>
                    <th className="p-4">{t.dashboard.priority}</th>
                    <th className="p-4">{t.dashboard.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 font-mono text-cyan-400">{req.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{req.title}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{req.details}</div>
                      </td>
                      <td className="p-4 font-mono text-slate-400 uppercase text-[11px]">
                        {req.service_category.replace('_', ' ')}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          req.priority === 'urgent'
                            ? 'bg-red-950/80 text-red-300 border border-red-500/30'
                            : req.priority === 'high'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          req.status === 'completed'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : req.status === 'in_progress'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                            : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Billing & Subscription Management */}
      {activeTab === 'billing' && (
        <div className="space-y-8 animate-in fade-in">
          
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-2">
              {t.dashboard.activeSubscription}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t.dashboard.upgradePrompt}
            </p>

            {/* Current Subscription Card */}
            <div className="p-6 rounded-xl bg-slate-900 border border-cyan-500/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase text-slate-400">
                    {t.dashboard.currentTierLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30 uppercase">
                    {subscription.status}
                  </span>
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {subscription.plan_name}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {t.dashboard.renewDateLabel}: <strong className="text-white font-mono">{new Date(subscription.current_period_end).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-white font-mono">
                  ${(subscription.price_cents / 100).toLocaleString()}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {subscription.billing_cycle === 'monthly' ? '/ month' : '/ year'}
                </span>
              </div>
            </div>

            {/* Change Subscription Plan Simulation */}
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-4 tracking-wider">
              {lang === 'ar' ? 'تغيير باقة الاشتراك فوراً:' : 'SWITCH TO ANOTHER ACTIVE TIER:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRICING_PLANS.map((plan) => {
                const isSelected = subscription.plan_id === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500'
                        : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-sm">{plan.name[lang]}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="text-xs font-mono text-cyan-400 mb-3">
                      ${plan.monthlyPrice.toLocaleString()}/mo
                    </div>
                    <button
                      onClick={() => handleTierSwitch(plan.id)}
                      disabled={isSelected}
                      className={`w-full py-2 rounded-lg text-xs font-bold cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                      }`}
                    >
                      {isSelected ? 'Active Plan' : 'Select Tier'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invoices List */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-950/60">
              <h3 className="text-sm font-bold text-white">
                {t.dashboard.invoices}
              </h3>
            </div>
            <div className="divide-y divide-slate-800">
              {[
                { id: 'INV-2026-081', date: 'Oct 01, 2026', amount: '$4,999.00', status: 'Paid' },
                { id: 'INV-2026-074', date: 'Sep 01, 2026', amount: '$4,999.00', status: 'Paid' },
                { id: 'INV-2026-068', date: 'Aug 01, 2026', amount: '$4,999.00', status: 'Paid' },
              ].map((inv) => (
                <div key={inv.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-mono font-bold text-white">{inv.id}</div>
                      <div className="text-slate-400 text-[11px]">{inv.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-white font-bold">{inv.amount}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-mono text-[10px] border border-emerald-500/20">
                      {inv.status}
                    </span>
                    <button
                      onClick={() => alert(`Downloading ${inv.id}.pdf`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                      title={t.dashboard.downloadInvoice}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Service Tickets */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {t.dashboard.recentTickets}
            </h3>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.dashboard.newTicket}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-bold">{req.id}</span>
                    <span className="text-slate-500">•</span>
                    <h4 className="text-sm font-bold text-white">{req.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 uppercase">
                      {req.priority}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      req.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : req.status === 'in_progress'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4">{req.details}</p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-800/80">
                  <span>Category: <strong className="text-slate-400">{req.service_category}</strong></span>
                  <span>Budget: <strong className="text-cyan-400">{req.budget_range}</strong></span>
                  <span>Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: API & Environment */}
      {activeTab === 'apikeys' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <span>Supabase API & Environment Credentials</span>
              </h3>
              <button
                onClick={onOpenSupabaseConfig}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 cursor-pointer"
              >
                Update Credentials
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Use these values in your Next.js 14 <code className="text-cyan-300 font-mono">.env.local</code> file to run queries against this Supabase project.
            </p>

            <div className="space-y-4">
              {/* URL */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  NEXT_PUBLIC_SUPABASE_URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={SUPABASE_URL || 'https://demo-nexus-supabase.supabase.co'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(SUPABASE_URL || 'https://demo-nexus-supabase.supabase.co', 'url')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {copiedKey === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* ANON KEY */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2VfaWQiOiJuZXh1cy1kZW1vIn0...'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 'key')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {copiedKey === 'key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 max-w-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              {t.dashboard.tabProfile}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Manage your personal and company contact details for sprint invoicing.
            </p>

            {profileSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.dashboard.profileUpdated}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  {t.auth.fullNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  {t.auth.companyLabel}
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  {t.auth.phoneLabel}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  User ID (Supabase Auth UID)
                </label>
                <input
                  type="text"
                  readOnly
                  value={user.id}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 py-3 px-6 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors cursor-pointer"
              >
                {t.dashboard.saveChanges}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0b101c] rounded-2xl border border-slate-700 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-1">
              {t.dashboard.newTicket}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Submit your engineering scope or bug request for our sprint team.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Sprint Title / Project Focus
                </label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="e.g. Next.js 14 App Router Checkout Integration"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Service Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="fullstack_web">Next.js 14 Web</option>
                    <option value="ai_engineering">AI & RAG Pipeline</option>
                    <option value="cloud_devops">Cloud & DevOps</option>
                    <option value="ui_ux_design">UI/UX Design</option>
                    <option value="mobile_app">Mobile App</option>
                    <option value="security_audit">Security Audit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Priority
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent Sprint</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Budget Projection
                </label>
                <input
                  type="text"
                  value={ticketBudget}
                  onChange={(e) => setTicketBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Technical Specifications & Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  placeholder="Detail the repo requirements, libraries, or API keys needed..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
