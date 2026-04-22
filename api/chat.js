import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `Actúas como el Asistente Profesional de Ivan Andres Zuniga Rada, experto en tecnología, IA, educación y consultoría basado en Pasto, Colombia. Tu rol es entender los proyectos de los clientes, guiarlos con preguntas precisas, y al final generar una propuesta inicial profesional estructurada (diagnóstico, fases, tecnologías recomendadas, estimación de tiempo y rango de inversión). Siempre ofrece redirigir al cliente a WhatsApp con Ivan para continuar.
Ivan es Director de Innovación en Zolaris. Ofrece Desarrollo Full-Stack, IA, Ciberseguridad, Mentorías (IU Training/UTP/UDEA), MGA y Analítica de datos.
Si te piden un caso de estudio, puedes referenciar Zolaris, Parquesoft, Ciberseguridad Electoral Nariño, o Talento Tech.
No des números exactos de teléfono a menos que te pidan redirigir al de Ivan (+57 3229132643).
Sé muy profesional, carismático y altamente estructurado. Responde usando notas de Markdown.`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages array' }), { status: 400 });
  }

  try {
    // 1. Try Gemini 2.5 Flash
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: SYSTEM_PROMPT });
      
      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      const chat = model.startChat({ history });
      const lastMessage = messages[messages.length - 1].content;
      
      const result = await chat.sendMessageStream(lastMessage);
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
             for await (const chunk of result.stream) {
                const text = chunk.text();
                controller.enqueue(new TextEncoder().encode(text));
             }
             controller.close();
          } catch (e) {
             console.error("Gemini Stream Error:", e);
             controller.error(e);
          }
        }
      });
      
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8' } });
    } else {
        throw new Error("GEMINI_API_KEY no configurada");
    }
  } catch (error) {
    console.warn("Gemini failed, trying Groq fallback:", error);
    
    // 2. Fallback to Groq (Llama 3)
    if (process.env.GROQ_API_KEY) {
      const groqMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ];
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          stream: true
        })
      });
      
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Both AI providers failed' }), { status: 500 });
      }
      
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n').filter(l => l.startsWith('data: ') && l !== 'data: [DONE]');
              
              for (const line of lines) {
                try {
                  const data = JSON.parse(line.replace('data: ', ''));
                  const content = data.choices[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch(e) {}
              }
            }
            controller.close();
          } catch (e) {
            console.error("Groq Stream Error:", e);
            controller.error(e);
          }
        }
      });
      
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8' } });
    }
    
    return new Response(JSON.stringify({ error: 'AI Services unavailable. Please configure keys.' }), { status: 500 });
  }
}
