
import { GoogleGenAI, Type } from "@google/genai";
import { WheelData } from "../types";

export const analyzeWheelImage = async (base64Image: string): Promise<WheelData[]> => {
  // A API_KEY será injetada automaticamente pelo Vercel via process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: `Você é um especialista em coaching e análise de dados. 
            Analise a imagem da Roda da Vida enviada:
            1. Identifique cada categoria (ex: Saúde, Finanças, Carreira).
            2. Estime a nota de 0 a 10 com base no preenchimento visual de cada fatia.
            3. Se o texto estiver difícil de ler, use termos padrão de Roda da Vida em português.
            
            Retorne um array JSON estritamente com os campos "category" e "score".`
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            score: { type: Type.NUMBER }
          },
          required: ["category", "score"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Erro no parsing da IA:", e);
    return [];
  }
};
