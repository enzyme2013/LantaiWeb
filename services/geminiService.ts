
import { GoogleGenAI, Type } from "@google/genai";
import { BiographyData, LanguageVariant } from "../types";

const getSystemInstruction = (variant: LanguageVariant) => {
  const isTraditional = variant === 'zh-hant';
  return `You are a Master Scholar of Chinese History and Classical Literature. 
  Your goal is to help users understand classical texts (Wenyanwen). 
  ALWAYS output in ${isTraditional ? 'Traditional Chinese (繁體中文)' : 'Simplified Chinese (简体中文)'}.
  Provide translations into modern Chinese, explain historical context, define archaic terms, and identify allusions. 
  Keep your tone respectful, scholarly, and insightful.`;
};

export const interpretHistoricalText = async (text: string, userQuery: string, variant: LanguageVariant) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Text context: "${text.substring(0, 2000)}..." \n\n User Question: "${userQuery}"`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: getSystemInstruction(variant),
    },
  });

  return response.text;
};

export const chatWithScholar = async (history: { role: string, content: string }[], variant: LanguageVariant) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a Master Scholar of Chinese History. You help researchers find information in classical texts. 
      ALWAYS respond in ${variant === 'zh-hant' ? 'Traditional Chinese (繁體中文)' : 'Simplified Chinese (简体中文)'}. 
      Your name is Lantai Assistant (蘭台助手/兰台助手).`,
    },
  });

  const lastMessage = history[history.length - 1].content;
  const response = await chat.sendMessage({ message: lastMessage });
  return response.text;
};

export const fetchBiography = async (query: string, variant: LanguageVariant): Promise<BiographyData | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isTraditional = variant === 'zh-hant';

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze if "${query}" is a historical Chinese figure. If so, provide their biographical details in JSON format. 
    Strictly ensure all field values (name, courtesyName, bio, historicalSignificance) are in ${isTraditional ? 'Traditional Chinese (繁體中文)' : 'Simplified Chinese (简体中文)'}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isPerson: { type: Type.BOOLEAN, description: "Whether the query refers to a specific historical person" },
          name: { type: Type.STRING },
          courtesyName: { type: Type.STRING, description: "Courtesy name (字) or Art name (號/号)" },
          years: { type: Type.STRING, description: "Birth and death years" },
          bio: { type: Type.STRING, description: "Biographical overview in Chinese" },
          historicalSignificance: { type: Type.STRING, description: "Key contribution to history in Chinese" }
        },
        required: ["isPerson"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data.isPerson ? data : null;
  } catch (e) {
    return null;
  }
};

/**
 * Visualizes a new flooring material in a room image using Gemini 2.5 Flash Image.
 * This function processes a base64 image and a material description to return an edited image.
 */
export const visualizeFlooring = async (image: string, materialDescription: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Extract mime type and base64 data from the data URL string
  const matches = image.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid image format. Expected a base64 data URL.");
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `Please redesign the flooring in this room using the following material: ${materialDescription}. 
          Ensure the perspective, shadows, and reflections are consistent with the original environment. 
          Keep the furniture and room layout unchanged. Respond with the updated image.`,
        },
      ],
    },
  });

  // Find and return the image part from the response candidates
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  return null;
};
