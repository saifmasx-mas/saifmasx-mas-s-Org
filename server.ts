import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gemini SDK on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `
You are the official AI Assistant for abusaif almasri (د. خالد أبو سيف / أبو سيف المصري) and his digital engineering agency, Nexus Digital Agency.

Official Contact Information & Identity:
- Lead Architect & Founder: abusaif almasri (د. خالد أبو سيف)
- Headquarters / Location: Bursa, Turkey (بورصا، تركيا)
- Phone Number: +905362515878 (also WhatsApp: https://wa.me/905362515878)
- Email: saif.masx@gmail.com
- Social Links:
  * WhatsApp: https://wa.me/905362515878
  * LinkedIn: https://linkedin.com/in/abusaif-almasri
  * GitHub: https://github.com/saifmasx
  * Twitter/X: https://x.com/abusaif_almasri
  * Telegram: https://t.me/abusaif_almasri

Agency Capabilities & Tech Stack:
- Next.js 14 App Router, React Server Components (RSC), and Turbopack
- Supabase Auth, PostgreSQL schema design, and Row-Level Security (RLS) policies
- AI Engineering, custom LLM agents, and pgvector RAG vector search pipelines
- Cloud DevOps (Docker, Kubernetes, Terraform IaC, automated CI/CD)
- Cross-platform mobile engineering with React Native & Expo
- UI/UX Design Systems with full Arabic RTL and English LTR support

Pricing & Subscription Plans:
- Starter Sprint: $1,999/month (Rapid MVP, 48h turnaround)
- Growth Pro: $4,999/month (Dedicated Lead Architect, 24-48h turnaround, pgvector AI)
- Enterprise Elite: $9,999/month (Full multi-engineer squad, custom SLA, same-day sprints)

Guidelines:
- Respond in the language used by the user (Arabic or English).
- When responding in Arabic, use elegant, courteous, and modern Arabic (لغة عربية راقية ومرحبة).
- If the user asks for contact info, phone, email, WhatsApp, or location, provide:
  * الهاتف / واتساب: +905362515878
  * البريد الإلكتروني: saif.masx@gmail.com
  * العنوان: بورصا، تركيا (Bursa, Turkey)
  * روابط التواصل: WhatsApp, LinkedIn, GitHub, X, Telegram
- Offer to help them plan their software sprint, estimate budgets, or answer questions about Next.js 14 and Supabase.
`;

// Gemini Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message } = req.body;
    const userPrompt = message || (Array.isArray(messages) && messages[messages.length - 1]?.content);

    if (!userPrompt) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    if (!aiClient) {
      // Fallback response when GEMINI_API_KEY is not set
      return res.json({
        reply: `مرحباً بك! أنا المساعد الذكي الخاص بالمهندس abusaif almasri (أبو سيف المصري) في وكالة Nexus Digital.

يسعدني تواصلك معنا:
📍 العنوان: بورصا، تركيا (Bursa, Turkey)
📱 الهاتف والواتساب: +905362515878
✉️ البريد الإلكتروني: saif.masx@gmail.com
🌐 حسابات التواصل: WhatsApp, LinkedIn, GitHub, Telegram

كيف يمكنني مساعدتك اليوم في مشروعك التقني أو خطط Next.js 14 و Supabase؟`
      });
    }

    // Call Gemini 3.8 Flash model with timeout and fallback on error or high demand
    try {
      const geminiPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out')), 7000)
      );

      const response = await Promise.race([geminiPromise, timeoutPromise]);
      const replyText = response.text || 'I am here to assist with abusaif almasri and Nexus Digital services.';
      return res.json({ reply: replyText });
    } catch (genError: any) {
      console.warn('Gemini temporary high demand or API issue, using structured agency fallback:', genError.message);
      
      const lower = userPrompt.toLowerCase();
      let fallbackText = '';

      if (lower.includes('تواصل') || lower.includes('contact') || lower.includes('رقم') || lower.includes('phone') || lower.includes('عنوان') || lower.includes('address') || lower.includes('بورصا') || lower.includes('bursa')) {
        fallbackText = `إليك تفاصيل التواصل والمقر الخاص بالمهندس abusaif almasri (د. خالد أبو سيف):

📍 العنوان والمقر: بورصا، تركيا (Bursa, Turkey)
📱 الهاتف والواتساب: +90 536 251 5878
✉️ البريد الإلكتروني: saif.masx@gmail.com
💬 واتساب مباشر: https://wa.me/905362515878

حسابات التواصل المباشر:
• WhatsApp: https://wa.me/905362515878
• LinkedIn: https://linkedin.com/in/abusaif-almasri
• GitHub: https://github.com/saifmasx
• Twitter / X: https://x.com/abusaif_almasri
• Telegram: https://t.me/abusaif_almasri`;
      } else if (lower.includes('سعر') || lower.includes('price') || lower.includes('باقة') || lower.includes('اشتراك') || lower.includes('plan')) {
        fallbackText = `باقات الاشتراك المتاحة في Nexus Digital تحت إشراف المهندس abusaif almasri:
1. Starter Sprint: $1,999/شهرياً (تسليم خلال 48 ساعة، إطلاق MVP سريع).
2. Growth Pro: $4,999/شهرياً (الأكثر طلباً - مهندس رئيسي متفرغ، تسليم 24-48 ساعة، تكاملات AI و Supabase).
3. Enterprise Elite: $9,999/شهرياً (فريق هندسي متعدد، أولوية عاجلة، SLA 99.99%).

خصم 20% متوفر عند الدفع السنوي!`;
      } else {
        fallbackText = `أهلاً بك! أنا المساعد الذكي للمهندس abusaif almasri (د. خالد أبو سيف / أبو سيف المصري) في وكالة Nexus Digital.
نحن متخصصون في بناء أنظمة Next.js 14 App Router السريعة، وقواعد بيانات Supabase مع سياسات RLS المحكمة، وهندسة الذكاء الاصطناعي RAG.

📍 المقر: بورصا، تركيا (Bursa, Turkey)
📱 هاتف وواتساب: +90 536 251 5878
✉️ البريد الإلكتروني: saif.masx@gmail.com

يسعدنا بدء مشروعك الرقمي أو الإجابة على أي تفاصيل تقنية!`;
      }

      return res.json({ reply: fallbackText });
    }
  } catch (error: any) {
    console.error('Chat Route Error:', error);
    return res.json({
      reply: `مرحباً بك! يمكنك التواصل مباشرة مع المهندس abusaif almasri:
📍 المقر: بورصا، تركيا (Bursa, Turkey)
📱 الهاتف والواتساب: +90 536 251 5878
✉️ البريد: saif.masx@gmail.com`,
    });
  }
});

// Setup Vite in Development or Static Server in Production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexus Digital Agency server running on http://localhost:${PORT}`);
  });
}

setupServer();
