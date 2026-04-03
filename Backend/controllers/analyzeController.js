import { getCodeAnalysis } from '../services/aiService.js';
import { supabase } from '../config/supabase.js';

export const analyzeCode = async (req, res) => {
  const { code, language, userId } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code content is required for analysis." });
  }

  try {
    // 1. Logic Orchestration: Call the AI backend (Python) via service bridge
    const analysis = await getCodeAnalysis(code, language || 'JavaScript', userId || 'guest-user');

    // 2. Database Integration: Store in Supabase as requested
    // Ensure accurate field mapping based on requirements
    const logData = { 
      user_id: userId || 'anonymous',
      input_code: code, 
      language: language || 'JavaScript', 
      error_type: analysis.errorType,
      explanation: analysis.explanation,
      suggested_fix: analysis.suggestedFix,
      learning_insight: analysis.learningInsight,
      timestamp: new Date().toISOString()
    };

    const { data: dbResult, error: dbError } = await supabase
      .from('analysis_history')
      .insert([logData]);

    if (dbError) {
      console.warn("Database storage warning:", dbError.message);
      // We don't throw here to avoid preventing response returning if database fails
    }

    // 3. Return structured JSON response to frontend
    return res.status(200).json(analysis);

  } catch (error) {
    console.error("Analyze Controller Error:", error);
    return res.status(500).json({ 
      error: "AI_ORCHESTRATION_ERROR", 
      message: error.message || "An error occurred during code analysis orchestration." 
    });
  }
};
