
import { GoogleGenAI, Type } from "@google/genai";
import { StudentInput, WellnessResponse, GUIDES } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getWellnessGuidance = async (input: StudentInput): Promise<WellnessResponse> => {
  const selectedGuide = GUIDES.find(g => g.type === input.guide);
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The student is checking in. 
    Selected Guide: ${selectedGuide?.name} (${selectedGuide?.type}) - Tone: ${selectedGuide?.tone}.
    Mental State: ${input.mentalState}. 
    Detailed Feelings: ${input.description || 'Not provided'}. 
    Field of Study: ${input.fieldOfStudy}. 
    Energy Level: ${input.energyLevel}.
    Task Preference: ${input.taskPreference}.`,
    config: {
      systemInstruction: `You are an empathetic AI assistant student wellness companion.
      You are speaking AS the selected guide. Use their specific tone and personality.
      
      Requirements:
      1. Validation: Empathize with the student's current state.
      2. Growth Insight: Connect their struggle to their field of study (${input.fieldOfStudy}) or general learning growth.
      3. Small Task: Suggest a small task based on energy (${input.energyLevel}) and preference (${input.taskPreference}).
      4. Recovery Action: Suggest a physical or mindful relaxation action.
      5. Encouraging Note: A warm closing message.
      6. Guide Comment: A short personal remark from the guide.
      7. Lighter Task: Provide a backup task that is even easier, requiring almost zero energy (e.g., just noticing a color or taking one deep breath).

      Tone: Gentle, supportive, non-clinical.
      Respond ONLY in valid JSON matching the schema.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          validation: { type: Type.STRING },
          growthInsight: { type: Type.STRING },
          smallTask: { type: Type.STRING },
          recoveryAction: { type: Type.STRING },
          encouragingNote: { type: Type.STRING },
          guideComment: { type: Type.STRING },
          lighterTask: { type: Type.STRING }
        },
        required: ["validation", "growthInsight", "smallTask", "recoveryAction", "encouragingNote", "guideComment", "lighterTask"]
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as WellnessResponse;
};
