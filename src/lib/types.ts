export type Language = 'en' | 'ar';

export type UserRole = 'client' | 'agency_member' | 'admin';

export type SubscriptionPlanId = 'starter' | 'growth_pro' | 'enterprise';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'free';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  avatar_url: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  plan_id: SubscriptionPlanId;
  plan_name: string;
  billing_cycle: 'monthly' | 'yearly';
  price_cents: number;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface ServiceRequest {
  id: string;
  user_id: string;
  title: string;
  service_category: 'ai_engineering' | 'fullstack_web' | 'cloud_devops' | 'ui_ux_design' | 'mobile_app' | 'security_audit';
  budget_range: string;
  status: 'submitted' | 'in_review' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  details: string;
  created_at: string;
}

export interface PlanFeature {
  title: { en: string; ar: string };
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: SubscriptionPlanId;
  name: { en: string; ar: string };
  tagline: { en: string; ar: string };
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  badge?: { en: string; ar: string };
  features: PlanFeature[];
}

export interface ServiceItem {
  id: string;
  category: ServiceRequest['service_category'];
  title: { en: string; ar: string };
  shortDesc: { en: string; ar: string };
  detailedDesc: { en: string; ar: string };
  iconName: string;
  techStack: string[];
  deliverables: { en: string[]; ar: string[] };
  startingPrice: string;
  turnaroundTime: { en: string; ar: string };
}

export interface TestimonialItem {
  id: string;
  quote: { en: string; ar: string };
  author: string;
  role: { en: string; ar: string };
  company: string;
  rating: number;
  avatar: string;
  metric: { en: string; ar: string };
}
