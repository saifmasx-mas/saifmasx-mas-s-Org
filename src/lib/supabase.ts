import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { UserProfile, Subscription, ServiceRequest } from './types';

// Check for runtime or saved credentials
const savedUrl = typeof window !== 'undefined' ? localStorage.getItem('nexus_supabase_url') : null;
const savedKey = typeof window !== 'undefined' ? localStorage.getItem('nexus_supabase_anon_key') : null;

export const SUPABASE_URL = savedUrl || import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = savedKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project'));

let supabaseInstance: SupabaseClient | null = null;

if (isConfigured) {
  try {
    supabaseInstance = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export const supabase = supabaseInstance;

// Initial mock database state for demo / standalone preview mode
const DEFAULT_USER: UserProfile = {
  id: 'usr_784912fa',
  email: 'saif.masx@gmail.com',
  full_name: 'abusaif almasri',
  company_name: 'Al-Masri Digital Systems',
  avatar_url: '/src/assets/images/abusaif_avatar_1791381724704.jpg',
  phone: '+905362515878',
  role: 'client',
  created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
};

const DEFAULT_SUBSCRIPTION: Subscription = {
  id: 'sub_9921_pro',
  user_id: 'usr_784912fa',
  status: 'active',
  plan_id: 'growth_pro',
  plan_name: 'Growth Pro',
  billing_cycle: 'monthly',
  price_cents: 499900,
  current_period_start: new Date(Date.now() - 12 * 86400000).toISOString(),
  current_period_end: new Date(Date.now() + 18 * 86400000).toISOString(),
  cancel_at_period_end: false,
};

const DEFAULT_REQUESTS: ServiceRequest[] = [
  {
    id: 'req_101',
    user_id: 'usr_784912fa',
    title: 'Enterprise Next.js 14 E-Commerce Architecture with Algolia',
    service_category: 'fullstack_web',
    budget_range: '$10,000 - $25,000',
    status: 'in_progress',
    priority: 'high',
    details: 'Migrating legacy monolith to App Router with edge caching, streaming SSR, and Arabic RTL checkout.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'req_102',
    user_id: 'usr_784912fa',
    title: 'Custom LLM Fine-Tuning & RAG Pipeline for Arabic Financial Docs',
    service_category: 'ai_engineering',
    budget_range: '$25,000 - $50,000',
    status: 'in_review',
    priority: 'urgent',
    details: 'Vector database indexing with pgvector on Supabase, hybrid search, and LangChain orchestration.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'req_103',
    user_id: 'usr_784912fa',
    title: 'Zero-Trust Cloud Audit & Kubernetes Multi-Region Cluster',
    service_category: 'cloud_devops',
    budget_range: '$5,000 - $10,000',
    status: 'completed',
    priority: 'medium',
    details: 'Terraform IaC scripts and automated CI/CD deployment pipelines on GCP and Supabase.',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
];

// Helper to save Supabase custom config
export function saveSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nexus_supabase_url', url.trim());
    localStorage.setItem('nexus_supabase_anon_key', key.trim());
    window.location.reload();
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nexus_supabase_url');
    localStorage.removeItem('nexus_supabase_anon_key');
    window.location.reload();
  }
}

// Local mock store management
const STORAGE_KEYS = {
  USER: 'nexus_mock_user',
  SUB: 'nexus_mock_sub',
  REQS: 'nexus_mock_requests',
  AUTH_TOKEN: 'nexus_auth_token',
};

export function getMockUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return DEFAULT_USER; // Default to abusaif almasri session
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return DEFAULT_USER;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.avatar_url || parsed.avatar_url.includes('unsplash') || parsed.full_name === 'Saif Al-Mansoor' || parsed.phone !== '+905362515878') {
      parsed.avatar_url = DEFAULT_USER.avatar_url;
      parsed.full_name = DEFAULT_USER.full_name;
      parsed.company_name = DEFAULT_USER.company_name;
      parsed.email = DEFAULT_USER.email;
      parsed.phone = DEFAULT_USER.phone;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_USER;
  }
}

export function getMockSubscription(): Subscription {
  if (typeof window === 'undefined') return DEFAULT_SUBSCRIPTION;
  const raw = localStorage.getItem(STORAGE_KEYS.SUB);
  return raw ? JSON.parse(raw) : DEFAULT_SUBSCRIPTION;
}

export function getMockRequests(): ServiceRequest[] {
  if (typeof window === 'undefined') return DEFAULT_REQUESTS;
  const raw = localStorage.getItem(STORAGE_KEYS.REQS);
  return raw ? JSON.parse(raw) : DEFAULT_REQUESTS;
}

export function saveMockUser(user: UserProfile | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } else {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo_session_active');
  }
}

export function saveMockSubscription(sub: Subscription) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SUB, JSON.stringify(sub));
}

export function saveMockRequests(reqs: ServiceRequest[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.REQS, JSON.stringify(reqs));
}

export { DEFAULT_USER, DEFAULT_SUBSCRIPTION, DEFAULT_REQUESTS };
