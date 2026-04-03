import requests
import json

url = "http://localhost:5000/debug"
data = {
    "code": "print(x)",
    "error": "undefined variable",
    "user_id": "test-user-123",
    "mode": "learn"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
