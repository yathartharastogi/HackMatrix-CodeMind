import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:5000';

export const getCodeAnalysis = async (code, language, userId = 'default-user') => {
  try {
    const response = await axios.post(`${AI_BACKEND_URL}/debug`, {
      code: code,
      error: `Analyzing ${language} code for potential issues.`,
      user_id: userId,
      mode: 'learn'
    });

    const aiResult = response.data.result;

    // Transform to standardized structure as requested
    return {
      explanation: aiResult.explanation,
      errorType: aiResult.error_type,
      suggestedFix: aiResult.fix,
      learningInsight: aiResult.learning_tip,
      rootCause: aiResult.root_cause || "Pending manual review",
      category: aiResult.category || "General Logic"
    };
  } catch (error) {
    console.warn("AI Backend unreachable or errored. Providing local resilient fallback...");
    
    // Safety Fallback if Python backend is down or Gemini API is 403 Forbidden
    return {
      errorType: "Analysis Timeout/Connection Error",
      explanation: "The AI analysis server is currently under maintenance or has reached its API limit.",
      suggestedFix: "// Local Node Mock Fix\nfunction solveProblem() {\n  return 'Review your logic and parameters';\n}",
      learningInsight: "Check if the Python backend is running on port 5000 and has a valid Gemini API Key.",
      rootCause: "Backend/API Unreachable",
      category: "System Error"
    };
  }
};
