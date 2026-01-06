
import { GoogleGenAI } from "@google/genai";

export const generateAuraImage = async (prompt: string, imageBase64?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const parts: any[] = [
    {
      text: `Create a professional cinematic photograph following this aesthetic: ${prompt}. 
      Style requirements: Raw paparazzi aesthetic, harsh on-camera flash, grainy film texture, 35mm look, deep shadows, high contrast, candid composition, 2000s underground fashion vibe.`
    }
  ];

  if (imageBase64) {
    // Extract mime type and base64 data
    const mimeType = imageBase64.split(';')[0].split(':')[1];
    const data = imageBase64.split(',')[1];
    parts.unshift({
      inlineData: {
        mimeType,
        data
      }
    });
  }

  // Using gemini-2.5-flash-image for high-quality specialized image generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: parts,
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image was returned from the model.");
};
