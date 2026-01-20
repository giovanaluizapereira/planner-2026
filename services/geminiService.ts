
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeWheelImage = async (base64Image: string): Promise<any[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY não configurada no ambiente.");
  
  const ai = new GoogleGenAI({ apiKey });
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          parts: [
            {
              text: "Analise esta imagem da Roda da Vida. Identifique cada categoria e a pontuação preenchida (de 0 a 10). Retorne um array de objetos JSON com 'category' e 'score'."
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

    if (!response.text) throw new Error("IA não retornou dados válidos.");
    return JSON.parse(response.text);
  } catch (e: any) {
    console.error("Erro na análise da IA:", e);
    throw new Error("Falha ao analisar imagem. Verifique se o formato é válido.");
  }
};
