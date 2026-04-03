from typing import Dict, List, Any
from pydantic import BaseModel

class UserMemoryManager:
    def __init__(self):
        # In-memory database MVP
        # Example Format: {"user_123": {"skill_level": "beginner", "error_frequencies": {"IndexError": 2}, "common_patterns": []}}
        self.db: Dict[str, Dict[str, Any]] = {}
        
    def _initialize_user(self, user_id: str):
        if user_id not in self.db:
            self.db[user_id] = {
                "skill_level": "beginner", # Defaluts to beginner
                "error_frequencies": {},
                "common_patterns": []
            }
            
    def get_user_profile(self, user_id: str) -> dict:
        self._initialize_user(user_id)
        user_data = self.db[user_id]
        
        # Reconstruct past_errors list dynamically based on exact frequency logic
        sorted_errors = sorted(
            user_data["error_frequencies"].items(), 
            key=lambda item: item[1], 
            reverse=True
        )
        past_errors_list = [error for error, count in sorted_errors]
        
        return {
            "skill_level": user_data["skill_level"],
            "past_errors": past_errors_list,
            "common_patterns": user_data["common_patterns"]
        }
        
    def update_user_profile(self, user_id: str, error_type: str, new_pattern: str = None):
        self._initialize_user(user_id)
        user_data = self.db[user_id]
        
        # Update frequency tracking for past errors
        if error_type:
            user_data["error_frequencies"][error_type] = user_data["error_frequencies"].get(error_type, 0) + 1
            
        # Update patterns logical tracking
        if new_pattern and new_pattern not in user_data["common_patterns"]:
            user_data["common_patterns"].append(new_pattern)
            
memory_manager = UserMemoryManager()
