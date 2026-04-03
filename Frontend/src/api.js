export const analyzeCode = async (code, language) => {
  try {
    const response = await fetch("http://localhost:8000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Call Failed:", error);
    
    // Fallback Mock Response for development speed when backend is down
    return {
      error: "Connection Refused: Backend Offline",
      explanation: "Please ensure your Backend server is running at http://localhost:8000.",
      patternInsight: "Local Environment Connectivity",
      learningTip: "Run 'npm run dev' inside the /Backend directory to start the server.",
      isMock: true
    };
  }
};
