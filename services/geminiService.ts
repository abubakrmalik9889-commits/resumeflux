
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSAnalysis, WorkExperience } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ATS_AUDITOR_INSTRUCTION = `You are an AI-powered ATS resume analyzer. 
Analyze the provided resume against a job description (if provided).
Focus on:
1. ATS Score (0-100%): Keyword match, presence of critical sections, and ATS-friendly formatting (no tables, images, or complex headers).
2. Keyword Analysis: Match skills from the job description.
3. Section Feedback: Critique Summary, Experience, Skills, and Formatting.
4. AI Suggestions: Rewrite or optimize bullet points and summaries.
5. Structural Audit: Identify competitive strengths and parsing vulnerabilities.
6. Strategic Roadmap: Provide actionable suggestions for improvement.

YOU MUST RETURN VALID JSON ONLY with the exact keys: score, match_score, matched_keywords, missing_keywords, section_feedback, ai_suggestions, strengths, weaknesses, suggestions.`;

export const optimizeContent = async (text: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite the following resume content to be more impactful, using action verbs and quantifiable results. 
      Context: ${context}. 
      Original Content: ${text}`,
      config: {
        systemInstruction: "You are an expert resume writer. Focus on achievements, metrics, and industry-standard keywords.",
      }
    });
    return response.text || text;
  } catch (error) {
    console.error("AI Optimization failed:", error);
    return text;
  }
};

export const generateCoverLetter = async (resume: ResumeData, jobDesc: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a highly professional cover letter based on this resume and job description.
      Resume: ${JSON.stringify(resume)}
      Job Description: ${jobDesc}`,
      config: {
        systemInstruction: "You are an expert career coach. Write a persuasive, tailored cover letter that highlights the most relevant skills from the resume for the specific job description.",
      }
    });
    return response.text || "Failed to generate cover letter.";
  } catch (error) {
    return "AI service unavailable for cover letter generation.";
  }
};

const ATS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    match_score: { type: Type.NUMBER },
    matched_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    missing_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    section_feedback: {
      type: Type.OBJECT,
      properties: {
        Summary: { type: Type.STRING },
        Experience: { type: Type.STRING },
        Skills: { type: Type.STRING },
        Formatting: { type: Type.STRING }
      },
      required: ["Summary", "Experience", "Skills", "Formatting"]
    },
    ai_suggestions: {
      type: Type.OBJECT,
      properties: {
        Experience: { type: Type.ARRAY, items: { type: Type.STRING } },
        Summary: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["Experience", "Summary"]
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["score", "match_score", "matched_keywords", "missing_keywords", "section_feedback", "ai_suggestions", "strengths", "weaknesses", "suggestions"]
};

export const analyzeATS = async (resume: ResumeData, jobDesc?: string): Promise<ATSAnalysis> => {
  try {
    const resumeString = JSON.stringify(resume);
    const prompt = jobDesc 
      ? `Analyze this resume for JobMentis-style audit.\nResume: ${resumeString}\nJob Description: ${jobDesc}`
      : `Analyze this resume for general ATS optimization.\nResume: ${resumeString}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: ATS_AUDITOR_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ATS_SCHEMA
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("ATS Analysis failed:", error);
    return createEmptyAnalysis();
  }
};

export const analyzeATSWithFile = async (base64File: string, mimeType: string, jobDesc: string): Promise<ATSAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64File,
              mimeType: mimeType,
            },
          },
          {
            text: `Run JobMentis-style audit on this file against JD: ${jobDesc}`,
          },
        ],
      },
      config: {
        systemInstruction: ATS_AUDITOR_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ATS_SCHEMA
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("File-based ATS Analysis failed:", error);
    throw error;
  }
};

export const getSkillSuggestions = async (jobTitle: string, experiences: WorkExperience[]): Promise<string[]> => {
  try {
    const expSummary = experiences.map(e => `${e.role} at ${e.company}`).join(', ');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the job title "${jobTitle}" and experience "${expSummary}", suggest 10 relevant professional skills. Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

function createEmptyAnalysis(): ATSAnalysis {
  return {
    score: 0,
    match_score: 0,
    matched_keywords: [],
    missing_keywords: [],
    section_feedback: { Summary: "", Experience: "", Skills: "", Formatting: "" },
    ai_suggestions: { Experience: [], Summary: [] },
    strengths: [],
    weaknesses: [],
    suggestions: []
  };
}
