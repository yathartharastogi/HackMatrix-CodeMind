import { getCodeAnalysis } from '../services/aiService.js';
import { supabase } from '../config/supabase.js';

export const analyzeCode = async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code content is required for analysis." });
  }

  try {
    const analysis = await getCodeAnalysis(code, language || 'JavaScript');

    // Optional: Log to Supabase for pattern tracking
    await supabase.from('AnalysisLogs').insert([
      { 
        code_snippet: code, 
        language: language, 
        error_pattern: analysis.patternInsight,
        created_at: new Date()
      }
    ]);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ 
      error: "INTERNAL_SERVER_ERROR", 
      message: "An error occurred during code analysis. Please try again later." 
    });
  }
};
