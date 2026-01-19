import { GoogleGenAI, Type } from "@google/genai";
import { WheelData } from "../types";

export const analyzeWheelImage = async (base64Image: string): Promise<WheelData[]> => {
  // A API_KEY deve estar configurada no Vercel (Settings > Environment Variables)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY não encontrada no ambiente. Verifique as configurações do Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Extrair o MIME type e os dados puros do base64
  const mimeTypeMatch = base64Image.match(/data:(.*?);/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    // Usando gemini-3-flash-preview conforme diretrizes para tarefas básicas de texto/visão
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            text: `Analise esta imagem de uma Roda da Vida. 
            Identifique as categorias escritas e as notas de 0 a 10 atribuídas a cada uma. 
            Ignore qualquer texto que não seja uma categoria da roda.
            Retorne APENAS um array JSON puro com o seguinte formato:
            [{"category": "Nome da Área", "score": 7}]`
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
    if (!textResponse) {
      throw new Error("A IA retornou uma resposta vazia.");
    }

    // Limpeza de possíveis formatações markdown que a IA possa incluir por engano
    const jsonString = textResponse.replace(/```json|```/g, "").trim();
    
    return JSON.parse(jsonString);
  } catch (e: any) {
    console.error("ERRO DETALHADO GEMINI:", e);
    // Repassa o erro com mensagem amigável
    throw new Error(e.message || "Falha na comunicação com a IA.");
  }
};
