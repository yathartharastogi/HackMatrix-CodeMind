import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List, Literal

try:
    from backend.services.supabase_db import store_debug_history
except ImportError:
    pass

# Note: It's generally not recommended to hardcode keys, but doing so for local testing!
os.environ["GEMINI_API_KEY"] = "AIzaSyBrdwZDOb9M2GfE-B1PoXaVi7sNyNjPonI"

# Define the Pydantic schema to enforce the JSON structure required by the prompt
class CodeMindResponse(BaseModel):
    error_type: str
    category: str
    explanation: str
    root_cause: str
    is_repeat_mistake: bool
    predicted_reason: str
    future_risks: List[str]
    learning_tip: str
    fix: str
    confidence: float

SYSTEM_INSTRUCTION = """
Create an AI agent named "CodeMind – Intelligent Debugging Copilot".

This agent is NOT a generic coding assistant. It is a learning-focused debugging system that helps users understand their mistakes, improve their thinking, and reduce repeated errors over time.

----------------------------------------
OBJECTIVE
----------------------------------------
Design the agent to:
- Analyze code and error messages
- Explain errors clearly
- Identify root causes
- Detect repeated mistake patterns from user history
- Predict likely future errors
- Adapt explanations based on user skill level
- Support two modes: "Fix" and "Learn"

The agent should prioritize teaching over simply giving answers.

----------------------------------------
INPUT SCHEMA
----------------------------------------
The agent will receive structured input in this format:
{
  "code": "string",
  "error": "string",
  "user_profile": {
    "skill_level": "beginner | intermediate | advanced",
    "past_errors": ["..."],
    "common_patterns": ["..."]
  },
  "mode": "fix | learn"
}

----------------------------------------
EXPECTED CAPABILITIES
----------------------------------------
1. Error Classification (Identify type, categorize)
2. Root Cause Analysis (Pinpoint issue, explain why)
3. Personalization (Adjust depth based on skill level)
4. Pattern Awareness (Compare with past errors, infer behavioral cause)
5. Prediction Engine (Predict 1–2 likely future mistakes)
6. Learning Guidance (Suggest concepts to focus on)
7. Fix Generation (Minimal correct fix)

----------------------------------------
MODE BEHAVIOR
----------------------------------------
Fix Mode: Short explanation (max 2–3 lines), Focus on solution
Learn Mode: Deeper explanation, Include reasoning and concepts

----------------------------------------
CONSTRAINTS
----------------------------------------
- Do not behave like a generic chatbot
- Do not give vague advice
- Do not hallucinate errors
- Do not rewrite full code unless required
- Always connect mistakes to thinking patterns
- Be precise and structured
"""

class CodeMindAgent:
    def __init__(self):
        # We use Gemini 1.5 Flash to support System Instructions and Structured Outputs and avoid Free Tier quota issues
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        self.model_name = "gemini-2.5-flash"
        # Mock database of user patterns (Memory / Training Behavior)
        self.mock_db = {}
        
    def _update_memory(self, user_id: str, new_error_type: str, new_predicted_pattern: str):
        """Simulates updating the user's mistake history in a database."""
        if user_id not in self.mock_db:
             self.mock_db[user_id] = {
                 "skill_level": "beginner", 
                 "past_errors": [], 
                 "common_patterns": []
             }
             
        user_profile = self.mock_db[user_id]
        if new_error_type not in user_profile["past_errors"]:
            user_profile["past_errors"].append(new_error_type)
        if new_predicted_pattern not in user_profile["common_patterns"]:
            user_profile["common_patterns"].append(new_predicted_pattern)
            
    def get_user_profile(self, user_id: str) -> dict:
        return self.mock_db.get(user_id, {
            "skill_level": "beginner",
            "past_errors": [],
            "common_patterns": []
        })

    def run(self, user_id: str, code: str, error: str, mode: Literal["fix", "learn"]) -> CodeMindResponse:
        # 1. Fetch memory (past user mistakes)
        user_profile = self.get_user_profile(user_id)
        
        # 2. Prepare payload
        payload = {
            "code": code,
            "error": error,
            "user_profile": user_profile,
            "mode": mode
        }
        
        # 3. Call Gemini
        prompt_json = json.dumps(payload, indent=2)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt_json,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=CodeMindResponse,
                    temperature=0.7,
                )
            )
        except Exception as e:
            print(f"\n[!] API Error encountered: {str(e)}")
            print("[!] If this is a 429 Quota Exceeded error, your API key has hit the free tier rate limit. Please wait ~15 seconds and try again.")
            return None
        
        # 4. Parse the structured output
        result_json = json.loads(response.text)
        structured_response = CodeMindResponse(**result_json)
        
        # 5. Update Memory/Database based on LLM response findings
        self._update_memory(
            user_id=user_id, 
            new_error_type=structured_response.error_type,
            new_predicted_pattern=structured_response.predicted_reason
        )
        
        return structured_response

if __name__ == "__main__":
    print("="*50)
    print("🤖 CodeMind Agent Initialized")
    print("="*50)
    
    agent = CodeMindAgent()
    user_id = input("Enter a User ID (e.g., user_123): ").strip() or "user_123"
    
    print(f"\n[?] Select Skill Level for {user_id} (beginner / intermediate / advanced)")
    skill_level = input("Skill Level [beginner]: ").strip().lower() or "beginner"
    
    print("\n[?] Enter your code snippet (Type 'END' on a new empty line to finish):")
    code_lines = []
    while True:
        try:
            line = input()
            if line.strip() == "END":
                break
            code_lines.append(line)
        except EOFError:
            break
    code_example = "\n".join(code_lines)
    
    print("\n[?] Enter the Error Message you received:")
    error_example = input("Error: ").strip()
    
    print("\n[?] Select Mode")
    mode_input = input("Mode (Press Enter for 'learn', or type 'fix'): ").strip().lower() or "learn"
    if mode_input not in ["fix", "learn"]:
        mode_input = "learn"
    
    # Initialize mock profile with chosen skill level
    if user_id not in agent.mock_db:
        agent.mock_db[user_id] = {"skill_level": skill_level, "past_errors": [], "common_patterns": []}
    else:
         agent.mock_db[user_id]["skill_level"] = skill_level
    
    print(f"\n--- Sending Task to CodeMind (Mode: {mode_input.upper()}) ---")
    print("Thinking...")
    result = agent.run(user_id, code_example, error_example, mode=mode_input)
    
    if result:
        # Push securely to Supabase
        try:
            store_debug_history(
                user_id=user_id,
                code=code_example,
                error=error_example,
                mode=mode_input,
                agent_output=result.model_dump()
            )
        except Exception:
            pass
        print("\n" + "="*60)
        print(f"✅ ANALYSIS COMPLETE | {result.error_type}")
        print("="*60)
        
        print("\n🔍 ROOT CAUSE:")
        print(f"   {result.root_cause}")
        
        print("\n💡 EXPLANATION:")
        print(f"   {result.explanation}")
        
        print("\n🛠️  HOW TO FIX IT:")
        print(f"   {result.fix}")
        
        print("\n📈 LEARNING TIP:")
        print(f"   {result.learning_tip}")

        print("\n🧠 THINKING PATTERNS:")
        if result.is_repeat_mistake:
            print(f"   [!] This is a repeated mistake from your tracked history!")
        print(f"   Behavioral Cause: {result.predicted_reason}")
        
        print("\n⚠️  FUTURE RISKS TO WATCH OUT FOR:")
        for risk in result.future_risks:
            print(f"   - {risk}")
            
        print("\n" + "-"*60)
        print(f"💾 Updating CodeMind Memory for '{user_id}'...")
        profile = agent.get_user_profile(user_id)
        print(f"   Tracked Errors: {', '.join(profile['past_errors'])}")
        print(f"   Identified Thinking Patterns: {len(profile['common_patterns'])}")
        print("="*60 + "\n")
    else:
        print("\n[!] Execution halted due to API error.")

