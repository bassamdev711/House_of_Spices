// app/api/chat-agent/route.ts
import { NextResponse } from 'next/server';
import { getAgentPrompt } from '@/lib/agent-prompt';

// دالة ذكية لتدوير المفاتيح (Key Rotation) لرفع حدود الاستخدام وتفادي خطأ 429
function getGeminiApiKey(): string {
  const keys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY // كخيار احتياطي أساسي (Fallback)
  ].filter(Boolean) as string[];

  if (keys.length === 0) {
    return '';
  }

  // اختيار مفتاح عشوائي من المفاتيح المتاحة
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();
    const systemPrompt = getAgentPrompt(message);

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      console.error('Kiro Error: No Gemini API Key found in environment variables.');
      return NextResponse.json(
        { reply: 'عذراً، كيرو يواجه مشكلة في التهيئة حالياً. حاول مرة أخرى.', action: null },
        { status: 500 }
      );
    }

    // ✅ استخدام النموذج الاقتصادي الخفيف والسريع gemini-2.5-flash-lite
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    let historyText = '';
    // بناء سجل الذاكرة الذكية
    if (Array.isArray(history) && history.length > 0) {
      historyText = 'سجل الحوار السابق بين العميل وكيرو (مستشار طيف للعطور):\n' +
        history.map((m: any) => 
          `${m.sender === 'user' ? 'العميل' : 'كيرو'}: ${m.text}`
        ).join('\n') +
        '\n\n';
    }

    // دمج التعليمات، الذاكرة، والرسالة الجديدة لضمان الفهم الأقصى للسياق
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { 
            role: 'user', 
            parts: [{ 
              text: `${systemPrompt}\n\n${historyText}العميل كتب الآن: "${message}"\nرد كيرو الفاخر المباشر (بدون تكرار ترحيب سابق إذا كان قد رحب به في السجل):` 
            }] 
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Gemini API error (v1):', data?.error);
      return NextResponse.json(
        { reply: 'عذراً، كيرو يواجه مشكلة تقنية مؤقتة. حاول مرة أخرى.', action: null },
        { status: 500 }
      );
    }

    let reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'عذراً، لم أفهم بشكل جيد. هل يمكنك إعادة صياغة سؤالك؟';

    // استخراج الأوامر الذكية (Smart Actions)
    let action = null;
    if (reply.includes('[طلب-الآن:')) {
      const match = reply.match(/\[طلب-الآن:(.*?)\]/);
      if (match) action = { type: 'order', product: match[1] };
      reply = reply.replace(/\[طلب-الآن:.*?\]/, '').trim();
    } else if (reply.includes('[تواصل-مع-الدعم]')) {
      action = { type: 'support' };
      reply = reply.replace('[تواصل-مع-الدعم]', '').trim();
    }

    return NextResponse.json({ reply, action });
  } catch (error: any) {
    console.error('Kiro Error (v1 Fetch):', error?.message || error);
    return NextResponse.json(
      { reply: 'عذراً، كيرو يواجه مشكلة تقنية مؤقتة. حاول مرة أخرى.', action: null },
      { status: 500 }
    );
  }
}

