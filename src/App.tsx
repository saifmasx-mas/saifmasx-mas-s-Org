import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesShowcase } from './components/ServicesShowcase';
import { PricingSection } from './components/PricingSection';
import { ProjectCalculator } from './components/ProjectCalculator';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { CodeExportModal } from './components/CodeExportModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { Chatbot } from './components/Chatbot';
import { 
  Language, 
  UserProfile, 
  Subscription, 
  ServiceRequest, 
  ServiceItem, 
  SubscriptionPlanId 
} from './lib/types';
import { 
  getMockUser, 
  getMockSubscription, 
  getMockRequests, 
  saveMockUser, 
  saveMockSubscription, 
  saveMockRequests, 
  DEFAULT_USER,
  DEFAULT_SUBSCRIPTION
} from './lib/supabase';
import { PRICING_PLANS } from './lib/i18n';

export default function App() {
  // Language & Direction state
  const [lang, setLang] = useState<Language>('en');

  // Application view state: 'landing' or 'dashboard'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Auth & Data state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getMockUser() || DEFAULT_USER);
  const [subscription, setSubscription] = useState<Subscription>(() => getMockSubscription());
  const [requests, setRequests] = useState<ServiceRequest[]>(() => getMockRequests());

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [supabaseConfigOpen, setSupabaseConfigOpen] = useState(false);

  // Sync HTML dir attribute on language change
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = () => {
    saveMockUser(null);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleAuthSuccess = (user: UserProfile, newSub?: Subscription) => {
    setCurrentUser(user);
    if (newSub) {
      setSubscription(newSub);
    }
    setCurrentView('dashboard');
  };

  const handleSelectPlan = (planId: SubscriptionPlanId, cycle: 'monthly' | 'yearly') => {
    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    const newSub: Subscription = {
      ...subscription,
      plan_id: planId,
      plan_name: plan.name[lang],
      billing_cycle: cycle,
      price_cents: (cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice) * 100,
      status: 'active',
    };

    saveMockSubscription(newSub);
    setSubscription(newSub);

    if (!currentUser) {
      handleOpenAuth('signup');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleRequestService = (service: ServiceItem) => {
    const newReq: ServiceRequest = {
      id: `req_${Math.random().toString(36).substring(2, 8)}`,
      user_id: currentUser ? currentUser.id : 'usr_guest',
      title: `${service.title[lang]} Sprint Engagement`,
      service_category: service.category,
      budget_range: service.startingPrice,
      priority: 'high',
      status: 'submitted',
      details: `Client expressed interest in blueprint: ${service.detailedDesc[lang]}`,
      created_at: new Date().toISOString(),
    };

    const updated = [newReq, ...requests];
    setRequests(updated);
    saveMockRequests(updated);

    if (!currentUser) {
      handleOpenAuth('signup');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleGenerateProposal = (ticketData: Partial<ServiceRequest>) => {
    const newReq: ServiceRequest = {
      id: `req_${Math.random().toString(36).substring(2, 8)}`,
      user_id: currentUser ? currentUser.id : 'usr_guest',
      title: ticketData.title || 'Custom Engineering Scope',
      service_category: ticketData.service_category || 'fullstack_web',
      budget_range: ticketData.budget_range || '$5,000 - $15,000',
      priority: ticketData.priority || 'high',
      status: 'submitted',
      details: ticketData.details || 'Scope created via interactive estimator tool.',
      created_at: new Date().toISOString(),
    };

    const updated = [newReq, ...requests];
    setRequests(updated);
    saveMockRequests(updated);
  };

  const handleScrollToPricing = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Navigation Bar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        currentUser={currentUser}
        subscription={subscription}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenCodeModal={() => setCodeModalOpen(true)}
        onOpenSupabaseConfig={() => setSupabaseConfigOpen(true)}
        currentView={currentView}
        onGoHome={() => setCurrentView('landing')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <>
            {/* Hero Section */}
            <Hero
              lang={lang}
              onOpenAuth={handleOpenAuth}
              onOpenCodeModal={() => setCodeModalOpen(true)}
              onScrollToPricing={handleScrollToPricing}
              onOpenCalculator={() => {
                document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Services Showcase */}
            <ServicesShowcase
              lang={lang}
              onRequestService={handleRequestService}
            />

            {/* Scope & Cost Calculator */}
            <ProjectCalculator
              lang={lang}
              onGenerateProposal={handleGenerateProposal}
            />

            {/* Pricing Section */}
            <PricingSection
              lang={lang}
              currentSubscription={subscription}
              onSelectPlan={handleSelectPlan}
            />

            {/* Testimonials & Proof */}
            <TestimonialsSection lang={lang} />
          </>
        ) : (
          /* Protected Dashboard View */
          currentUser && (
            <Dashboard
              lang={lang}
              user={currentUser}
              subscription={subscription}
              requests={requests}
              onUpdateSubscription={(sub) => {
                setSubscription(sub);
                saveMockSubscription(sub);
              }}
              onUpdateProfile={(profile) => {
                setCurrentUser(profile);
                saveMockUser(profile);
              }}
              onAddRequest={(req) => {
                const updated = [req, ...requests];
                setRequests(updated);
                saveMockRequests(updated);
              }}
              onOpenCodeModal={() => setCodeModalOpen(true)}
              onOpenSupabaseConfig={() => setSupabaseConfigOpen(true)}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenCodeModal={() => setCodeModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={() => {
          if (currentUser) {
            setCurrentView('dashboard');
          } else {
            handleOpenAuth('signin');
          }
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Code Export & Next.js 14 / SQL Inspector Modal */}
      <CodeExportModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        lang={lang}
      />

      {/* Supabase Config / Credentials Modal */}
      <SupabaseConfigModal
        isOpen={supabaseConfigOpen}
        onClose={() => setSupabaseConfigOpen(false)}
        lang={lang}
      />

      {/* AI Assistant Chatbot */}
      <Chatbot lang={lang} />

    </div>
  );
}
