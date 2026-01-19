import { GoogleGenAI, Type } from "@google/genai";
import { WheelData } from "../types";

export const analyzeWheelImage = async (base64Image: string): Promise<WheelData[]> => {
  // Inicializamos dentro da função para garantir que pegamos a chave do process.env.API_KEY 
  // mesmo que ela seja injetada via window.aistudio.openSelectKey() após o carregamento inicial.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mimeTypeMatch = base64Image.match(/data:(.*?);/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    // Usamos o modelo Pro para análise de gráficos e texto em imagens
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            text: `Analise detalhadamente esta Roda da Vida. 
            Identifique as categorias escritas e as notas de 0 a 10 atribuídas (baseado no preenchimento visual se necessário). 
            Retorne APENAS um array JSON puro:
            [{"category": "Nome da Área", "score": 7.5}]`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      },
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

    const textResponse = response.text;
    if (!textResponse) throw new Error("Resposta vazia da IA.");

    const jsonString = textResponse.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (e: any) {
    console.error("Erro na API Gemini:", e);
    // Se o erro indicar que a entidade não foi encontrada ou erro de auth, 
    // pode ser que a chave selecionada não tenha permissão.
    throw e;
  }
};
