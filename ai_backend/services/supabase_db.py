import os
import json
import logging
from supabase import create_client, Client

logger = logging.getLogger("CodeMindSupabase")

# Fallback to placeholders if not defined in environment
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://kmlqjwuoxlxcwhkobbwu.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "sb_publishable_smsfkMP3e2Vy7Yn1mmidFg_PPLfVXer")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    logger.error(f"Failed to initialize Supabase branch: {e}")
    supabase = None

def store_debug_history(user_id: str, code: str, error: str, mode: str, agent_output: dict):
    """Inserts a new debugging request securely into the Supabase database."""
    if not supabase:
        return
        
    try:
        # Ensure agent_output is natively JSON serializable before passing to Supabase SDK
        agent_output_json = json.loads(json.dumps(agent_output))
        
        data = {
            "user_id": user_id,
            "code": code,
            "error": error,
            "mode": mode,
            "agent_output": agent_output_json,
            "error_type": agent_output_json.get("error_type", "Unknown")
            # created_at is handled by PostgreSQL default now()
        }
        
        response = supabase.table("debug_history").insert(data).execute()
        return response.data
        
    except Exception as e:
        # Prevent tracking issues from crashing the core API responses
        logger.error(f"Failed to store debug history in Supabase: {str(e)}")
        pass

def get_user_history(user_id: str):
    """Fetches the last 20 debug histories for a specific user ID."""
    if not supabase:
        return []
        
    try:
        response = supabase.table("debug_history").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(20).execute()
        return response.data
    except Exception as e:
        logger.error(f"Failed to fetch user history from Supabase: {str(e)}")
        return []
