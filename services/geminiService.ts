import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from '../constants';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "Lumina," a sophisticated and helpful AI personal shopping stylist for an e-commerce store.
Your goal is to help customers find the perfect product from our catalog.

Here is our current product catalog data in JSON format:
${JSON.stringify(MOCK_PRODUCTS)}

Rules:
1. Only recommend products that are in the catalog above.
2. If a user asks for something we don't have, politely suggest the closest alternative from our catalog or explain we don't carry it.
3. Keep your answers concise, friendly, and stylish. 
4. When you mention a product, try to mention its price to be helpful.
5. Do not make up products.
`;

export const getGeminiResponse = async (userMessage: string, history: {role: 'user'|'model', text: string}[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Convert simplified history to GenAI format if needed, 
    // but for simple single-turn or short context, we can just use the chat feature.
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // A bit of creativity for style advice
      }
    });

    // In a real sophisticated app, we would sync the full history. 
    // For this demo, we'll just send the current message, assuming the system instruction is enough context 
    // or manually build the history object if utilizing multi-turn heavily. 
    // Here we strictly follow the requested structure.
    
    // To maintain context of the conversation, we'd typically pass history to the `history` param of `create`.
    // For this implementation, we will rely on the immediate query for simplicity, 
    // effectively treating each message as a fresh query with full catalog context.
    
    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "I'm having a bit of trouble connecting to my fashion senses right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm unable to reach the styling servers at the moment. Please try again.";
  }
};