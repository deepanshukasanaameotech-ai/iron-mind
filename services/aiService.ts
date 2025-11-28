import { AI_SYSTEM_INSTRUCTION } from "../constants";

const GROQ_API_URL = "/api/groq/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const checkKey = () => {
  if (!GROQ_API_KEY) {
    console.warn("VITE_GROQ_API_KEY missing. AI features disabled.");
    return false;
  }
  return true;
};

async function queryGroq(messages: any[]) {
  const response = await fetch(GROQ_API_URL, {
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: messages,
      temperature: 0.7,
      max_tokens: 150
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API Error: ${response.status} - ${err}`);
  }

  const result = await response.json();
  return result;
}

export const generateBrutalAdvice = async (context: string, topic: string): Promise<string> => {
  if (!checkKey()) return "API KEY MISSING. GET YOUR FREE GROQ KEY.";

  try {
    const messages = [
      { role: "system", content: AI_SYSTEM_INSTRUCTION },
      { role: "user", content: `Context: ${context}. Topic: ${topic}. Give me feedback.` }
    ];
    
    const result = await queryGroq(messages);
    return result.choices[0]?.message?.content || "SILENCE IS WEAKNESS.";
  } catch (error) {
    console.error("AI Error:", error);
    return "FAILURE IN THE SYSTEM. REBOOT AND RELOAD.";
  }
};

export const analyzePerformance = async (data: any, type: string): Promise<string> => {
  if (!checkKey()) return "DATA UNREADABLE.";

  try {
    const dataStr = JSON.stringify(data);
    const messages = [
      { role: "system", content: AI_SYSTEM_INSTRUCTION },
      { role: "user", content: `Here is my ${type} performance data: ${dataStr}. Analyze trends. Be harsh.` }
    ];

    const result = await queryGroq(messages);
    return result.choices[0]?.message?.content || "NO ANALYSIS AVAILABLE.";
  } catch (e) {
    console.error("AI Analysis Error:", e);
    return "ERROR PROCESSING METRICS.";
  }
};
