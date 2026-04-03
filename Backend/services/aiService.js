import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getCodeAnalysis = async (code, language) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    return {
      error: "Mock Error: API Key missing",
      explanation: "Please configure your OpenAI API Key in the Backend's .env file.",
      patternInsight: "Missing AI Credentials",
      learningTip: "Always keep secrets in environment variables.",
      isMock: true
    };
  }

  const prompt = `
    Analyze the following ${language} code snippet and identify any syntax, logical, or stylistic errors. 
    Format the output as a JSON object with strictly these keys:
    "error": "The most significant error or 'No error found'",
    "explanation": "A detailed explanation of why it's an error and how to fix it in simple terms.",
    "patternInsight": "The common programming pattern or anti-pattern this error falls into.",
    "learningTip": "A small actionable tip for future improvement."
    
    Code:
    ${code}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return { ...result, isMock: false };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("AI analysis failed.");
  }
};
