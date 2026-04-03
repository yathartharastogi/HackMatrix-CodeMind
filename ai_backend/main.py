from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Optional
import logging

# Ensure absolute import path structure is clean
from services.agent import agent_client
from services.user_memory import memory_manager
import services.supabase_db as supabase_db

from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BackendService")

app = FastAPI(title="CodeMind REST Backend")

# Enable CORS for the frontend React/Vite connections coming later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- schemas ----------------- #
class DebugRequest(BaseModel):
    code: str
    error: str
    user_id: str
    mode: Literal["fix", "learn"] = "learn"

class CodeMindResult(BaseModel):
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

class DebugResponse(BaseModel):
    result: CodeMindResult
    message: str

# ----------------- endpoints ----------------- #
@app.post("/debug", response_model=DebugResponse)
async def debug_endpoint(req: DebugRequest):
    try:
        # 1. Fetch user pattern history from database
        user_profile = memory_manager.get_user_profile(req.user_id)
        
        # 2. Package request body for agent API call
        agent_payload = {
            "code": req.code,
            "error": req.error,
            "user_profile": user_profile,
            "mode": req.mode
        }
        
        # 3. Request logic resolution from Agent (Mocked or Real)
        raw_agent_response = agent_client.call_agent(agent_payload)
        
        # Strict Response Validation
        cleaned_result = CodeMindResult(**raw_agent_response)
        
        # 4. Track metrics across user memory safely
        memory_manager.update_user_profile(
            user_id=req.user_id,
            error_type=cleaned_result.error_type,
            new_pattern=cleaned_result.predicted_reason
        )
        
        # 4.5 Store in Supabase
        supabase_db.store_debug_history(
            user_id=req.user_id,
            code=req.code,
            error=req.error,
            mode=req.mode,
            agent_output=cleaned_result.model_dump()
        )
        
        # 5. Return Frontend Output
        return DebugResponse(
            result=cleaned_result,
            message="Debugging complete"
        )
        
    except Exception as e:
        logger.error(f"Error handling /debug route: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{user_id}")
async def get_user_debug_history(user_id: str):
    history_records = supabase_db.get_user_history(user_id)
    return {"history": history_records}

@app.get("/")
def read_root():
    return {"message": "CodeMind API Service is Running."}
