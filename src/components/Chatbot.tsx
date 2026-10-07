import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Bot, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Copy,
  ChevronDown,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Language } from '../lib/types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface ChatbotProps {
  lang: Language;
}

const CONTACT_INFO = {
  name: 'abusaif almasri',
  nameAr: 'أبو سيف المصري (د. خالد أبو سيف)',
  phone: '+905362515878',
  phoneFormatted: '+90 536 251 5878',
  whatsappUrl: 'https://wa.me/905362515878',
  email: 'saif.masx@gmail.com',
  locationEn: 'Bursa, Turkey',
  locationAr: 'بورصا، تركيا',
  socials: [
    { name: 'WhatsApp', url: 'https://wa.me/905362515878', icon: '💬' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/abusaif-almasri', icon: '💼' },
    { name: 'GitHub', url: 'https://github.com/saifmasx', icon: '🐙' },
    { name: 'Twitter / X', url: 'https://x.com/abusaif_almasri', icon: '🐦' },
    { name: 'Telegram', url: 'https://t.me/abusaif_almasri', icon: '✈️' },
  ],
};

export const Chatbot: React.FC<ChatbotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const initialWelcomeText = lang === 'ar'
    ? `مرحباً بك! أنا المساعد الذكي للمهندس **abusaif almasri** (د. خالد أبو سيف) في وكالة Nexus Digital للأنظمة الرقمية.

يسعدني خدمتك والإجابة على أي استفسار حول تطوير تطبيقات Next.js 14، وهندسة الذكاء الاصطناعي، وقواعد بيانات Supabase RLS.

📍 **المقر الرئيسي:** ${CONTACT_INFO.locationAr}
📱 **الهاتف والواتساب:** [${CONTACT_INFO.phoneFormatted}](${CONTACT_INFO.whatsappUrl})
✉️ **البريد الإلكتروني:** ${CONTACT_INFO.email}

كيف يمكنني مساعدتك في مشروعك اليوم؟`
    : `Hello and welcome! I am the official AI assistant for **abusaif almasri** (Dr. Khaled Abu Saif) and Nexus Digital Systems Agency.

I can assist you with full-stack Next.js 14 engineering, Supabase RLS architectures, AI RAG vector pipelines, and sprint scoping.

📍 **Headquarters:** ${CONTACT_INFO.locationEn}
📱 **Direct Phone / WhatsApp:** [${CONTACT_INFO.phoneFormatted}](${CONTACT_INFO.whatsappUrl})
✉️ **Email:** ${CONTACT_INFO.email}

How can we accelerate your software roadmap today?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: initialWelcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const quickQuestions = lang === 'ar'
    ? [
        'ما هي خدماتكم التقنية؟',
        'ما هي أسعار وخطط الاشتراكات؟',
        'معلومات التواصل والهاتف والعنوان',
        'حجز موعد استشارة مع أبو سيف',
      ]
    : [
        'What are your engineering services?',
        'What are your pricing plans?',
        'Contact info, phone & address',
        'Schedule discovery sprint with abusaif',
      ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendMessage = async (userTextToSend?: string) => {
    const text = (userTextToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 1. Try real server-side Gemini endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          const botMessage: Message = {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botMessage]);
          return;
        }
      }
      throw new Error('Fallback to local intelligent responder');
    } catch (err) {
      // 2. Intelligent local fallback so the user always receives the exact info
      setTimeout(() => {
        let replyText = '';
        const lower = text.toLowerCase();

        if (lower.includes('تواصل') || lower.includes('contact') || lower.includes('رقم') || lower.includes('phone') || lower.includes('عنوان') || lower.includes('address') || lower.includes('بورصا') || lower.includes('bursa')) {
          replyText = lang === 'ar'
            ? `إليك بيانات التواصل المباشرة مع المهندس **abusaif almasri**:

📍 **العنوان والمقر:** ${CONTACT_INFO.locationAr}
📱 **الهاتف المباشر والواتساب:** ${CONTACT_INFO.phoneFormatted}
✉️ **البريد الإلكتروني:** ${CONTACT_INFO.email}
💬 **رابط الواتساب الفوري:** ${CONTACT_INFO.whatsappUrl}

حسابات التواصل الاجتماعي:
• [WhatsApp](${CONTACT_INFO.whatsappUrl})
• [LinkedIn](https://linkedin.com/in/abusaif-almasri)
• [GitHub](https://github.com/saifmasx)
• [Twitter / X](https://x.com/abusaif_almasri)
• [Telegram](https://t.me/abusaif_almasri)`
            : `Here are the direct contact details for **abusaif almasri**:

📍 **Location:** ${CONTACT_INFO.locationEn}
📱 **Direct Phone & WhatsApp:** ${CONTACT_INFO.phoneFormatted}
✉️ **Email:** ${CONTACT_INFO.email}
💬 **Instant WhatsApp Chat:** ${CONTACT_INFO.whatsappUrl}

Social Profiles:
• [WhatsApp](${CONTACT_INFO.whatsappUrl})
• [LinkedIn](https://linkedin.com/in/abusaif-almasri)
• [GitHub](https://github.com/saifmasx)
• [Twitter / X](https://x.com/abusaif_almasri)
• [Telegram](https://t.me/abusaif_almasri)`;
        } else if (lower.includes('سعر') || lower.includes('اسعار') || lower.includes('price') || lower.includes('pricing') || lower.includes('باقة') || lower.includes('خطط')) {
          replyText = lang === 'ar'
            ? `نقدم 3 باقات اشتراك هندسية شفافة:
1. **Starter Sprint:** $1,999 شهرياً (تسليم خلال 48 ساعة، إطلاق MVP سريع).
2. **Growth Pro (الأكثر طلباً):** $4,999 شهرياً (مهندس رئيسي مخصص، تسليم 24-48 ساعة، تكاملات AI و pgvector).
3. **Enterprise Elite:** $9,999 شهرياً (فريق هندسي متعدد التخصصات، أولوية عاجلة، اتفاقية SLA 99.99%).

خصم 20% متوفر عند الدفع السنوي!`
            : `We offer 3 transparent subscription plans:
1. **Starter Sprint:** $1,999/mo (48h turnaround, rapid MVP launch).
2. **Growth Pro (Most Popular):** $4,999/mo (Dedicated Lead Architect, 24-48h velocity, pgvector AI).
3. **Enterprise Elite:** $9,999/mo (Multi-engineer squad, urgent same-day turnaround, 99.99% SLA).

20% discount applies for annual commitments!`;
        } else {
          replyText = lang === 'ar'
            ? `شكراً لرسالتك! يسعدنا تقديم حلول برمجية متكاملة عبر معمارية Next.js 14 و Supabase وبناء نماذج الذكاء الاصطناعي مع المهندس **abusaif almasri**.
يمكنك التواصل المباشر هاتفياً أو عبر واتساب على **${CONTACT_INFO.phoneFormatted}** أو مراسلتنا على **${CONTACT_INFO.email}** في مقرنا في **${CONTACT_INFO.locationAr}**.`
            : `Thank you for your message! We deliver high-throughput Next.js 14 and Supabase engineering under the leadership of **abusaif almasri**.
Feel free to call or WhatsApp directly at **${CONTACT_INFO.phoneFormatted}** or email **${CONTACT_INFO.email}** at our headquarters in **${CONTACT_INFO.locationEn}**.`;
        }

        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 p-2 pr-4 rounded-full bg-[#0b101c]/90 border border-cyan-500/40 hover:border-cyan-400 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xl"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <img
              src="/src/assets/images/abusaif_avatar_1791381724704.jpg"
              alt="abusaif almasri"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover object-top border-2 border-cyan-400 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#090D16] animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                abusaif almasri
              </span>
              <span className="text-[9px] font-mono px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-cyan-300 font-mono">
              {lang === 'ar' ? 'تحدث معي الآن • متصل' : 'Chat with Assistant • Online'}
            </p>
          </div>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[420px] bg-[#090E1A]/95 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 flex flex-col backdrop-blur-2xl transition-all ${
            isMinimized ? 'h-16' : 'h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 bg-slate-950/80 border-b border-slate-800 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/src/assets/images/abusaif_avatar_1791381724704.jpg"
                  alt="abusaif almasri"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover object-top border border-cyan-400"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    abusaif almasri
                  </h4>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold">
                    ASSISTANT
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                  <span>{lang === 'ar' ? CONTACT_INFO.locationAr : CONTACT_INFO.locationEn}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/50 transition-colors"
                title="WhatsApp Direct"
              >
                <span className="text-sm">💬</span>
              </a>

              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-950/50 transition-colors"
                title="Call abusaif"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Contact Bar */}
              <div className="px-3.5 py-2 bg-cyan-950/30 border-b border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">📱 {CONTACT_INFO.phoneFormatted}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(CONTACT_INFO.phone)}
                    className="hover:text-white flex items-center gap-1"
                    title="Copy Phone"
                  >
                    {copiedText === CONTACT_INFO.phone ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedText === CONTACT_INFO.phone ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-cyan-300 max-w-[70%]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {lang === 'ar' ? 'جارٍ التفكير...' : 'Thinking...'}
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Chips */}
              <div className="p-2 border-t border-slate-800/80 bg-slate-950/50 flex overflow-x-auto gap-1.5 scrollbar-none">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Social Channels Bar */}
              <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-slate-500">
                  {lang === 'ar' ? 'التواصل الاجتماعي:' : 'Social Channels:'}
                </span>
                <div className="flex items-center gap-2">
                  {CONTACT_INFO.socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-cyan-300 transition-colors flex items-center gap-0.5"
                    >
                      <span>{s.icon}</span>
                      <span>{s.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-slate-950/90 border-t border-slate-800 rounded-b-2xl flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'اكتب رسالتك للمهندس أبو سيف...'
                      : 'Ask abusaif about Next.js, Supabase, pricing...'
                  }
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
