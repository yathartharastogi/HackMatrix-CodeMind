export const analyzeCode = async (code, language, userId) => {
  try {
    const response = await fetch("http://localhost:8000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, language, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Call Failed:", error);
    
    // Detailed local fallback for testing UI during dev
    return {
      errorType: "Connection Error",
      explanation: "The CodeMind backend is currently unreachable. " + error.message,
      suggestedFix: "Ensure both Node.js (8000) and Python (5000) backends are running.",
      learningInsight: "Check the 'Backend' and 'ai_backend' folders for start commands.",
      isMock: true
    };
  }
};
