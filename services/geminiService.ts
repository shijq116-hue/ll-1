import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ChatMessage, PronunciationFeedback } from "../types";

// Helper to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePronunciation = async (
  audioBlob: Blob,
  referenceText?: string
): Promise<PronunciationFeedback> => {
  const ai = getAIClient();
  const base64Audio = await blobToBase64(audioBlob);

  const prompt = `
    You are an expert Phonetics Coach for Chinese learners of English.
    Analyze the attached audio recording. 
    ${referenceText ? `The user is trying to say: "${referenceText}"` : "Identify what the user is saying."}
    
    Focus on:
    1. Rhythm and Stress (Is it syllable-timed instead of stress-timed?)
    2. Specific Chinese speaker issues (L/R confusion, th-sounds, missing final consonants, no linking).
    3. Intonation (Is it too flat or using Chinese tones?).

    Return the response in JSON format.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER, description: "Overall pronunciation score 0-100" },
      transcription: { type: Type.STRING, description: "What you heard" },
      issues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific issues found" },
      suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable advice for improvement" },
    },
    required: ["score", "transcription", "issues", "suggestions"],
  };

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/webm', data: base64Audio } }, // Assuming webm from browser recorder
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for consistent analysis
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as PronunciationFeedback;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      score: 0,
      transcription: "Error processing audio",
      issues: ["Could not analyze audio."],
      suggestions: ["Please try recording again clearly."]
    };
  }
};

export const chatWithCoach = async (
  history: ChatMessage[],
  newMessage: string,
  audioBlob?: Blob
): Promise<ChatMessage> => {
  const ai = getAIClient();
  
  // Format history for the API (simplified for generateContent, 
  // normally would use chats.create but keeping it stateless here for simplicity in demo or use single-turn with context)
  // For a proper chat, we will use ai.chats.create
  
  // System Instruction specifically for Chinese Learners
  const systemInstruction = `
    You are "Echo", a friendly English Coach for Chinese native speakers.
    Your goal is to have a natural conversation but gently correct their English.
    
    Style:
    - Encouraging and casual.
    - If they make a grammar mistake common to Chinese speakers (e.g., he/she confusion, tense), correct it briefly then continue the topic.
    - Use simple, idiomatic English (CEFR B1/B2 level).
    - If the user uses Chinese, reply in English but acknowledge understanding.
  `;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
    history: history.filter(h => h.id !== 'temp').map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const parts: any[] = [{ text: newMessage }];
  if (audioBlob) {
    const base64Audio = await blobToBase64(audioBlob);
    parts.unshift({ inlineData: { mimeType: 'audio/webm', data: base64Audio } });
  }

  const result = await chat.sendMessage({
    parts: parts
  });

  return {
    id: Date.now().toString(),
    role: 'model',
    text: result.text || "I didn't catch that."
  };
};
