import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw 
} from 'lucide-react';
import { Language } from '../lib/types';
import { TRANSLATIONS } from '../lib/i18n';
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  isConfigured, 
  saveSupabaseConfig, 
  clearSupabaseConfig 
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [url, setUrl] = useState(SUPABASE_URL);
  const [key, setKey] = useState(SUPABASE_ANON_KEY);
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) return;
    saveSupabaseConfig(url, key);
  };

  const handleReset = () => {
    clearSupabaseConfig();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0b101c] rounded-2xl border border-slate-700 shadow-2xl p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {t.supabaseModal.title}
            </h3>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              isConfigured ? 'bg-emerald-950 text-emerald-300' : 'bg-indigo-950 text-indigo-300'
            }`}>
              {isConfigured ? t.supabaseModal.statusConnected : t.supabaseModal.statusDemo}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {t.supabaseModal.subtitle}
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              {t.supabaseModal.urlLabel}
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              {t.supabaseModal.keyLabel}
            </label>
            <input
              type="password"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors cursor-pointer"
            >
              {t.supabaseModal.saveButton}
            </button>

            {isConfigured && (
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.supabaseModal.clearButton}</span>
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1"
          >
            <span>{t.supabaseModal.docsLink}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
