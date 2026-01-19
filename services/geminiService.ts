import { GoogleGenAI, Type } from "@google/genai";
import { WheelData } from "../types";

export const analyzeWheelImage = async (base64Image: string): Promise<WheelData[]> => {
  // A API_KEY deve estar configurada no Vercel (Settings > Environment Variables)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY não encontrada no ambiente.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Extrair o MIME type e os dados puros do base64
  const mimeTypeMatch = base64Image.match(/data:(.*?);/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview', // Modelo otimizado para multimodalidade
      contents: [
        {
          parts: [
            {
              text: `Analise esta imagem da Roda da Vida. 
              Extraia as categorias e as notas (de 0 a 10). 
              Se as notas não estiverem explícitas, estime pelo preenchimento visual.
              Retorne APENAS um array JSON puro, sem formatação markdown, seguindo este esquema:
              [{"category": "Nome", "score": 7.5}]`
            },
            {
              inlineData: {
                mimeType: mimeType,
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

    const textResponse = response.text || "";
    // Limpeza extra caso a IA ignore o responseMimeType e envie markdown
    const jsonString = textResponse.replace(/```json|```/g, "").trim();
    
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Erro detalhado na análise da IA:", e);
    throw e;
  }
};
