import requests
import time
import json
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL = os.getenv("OLLAMA_MODEL", "mistral")

def test_ollama():
    print(f"🚀 Testing connection to Ollama at {OLLAMA_URL} with model '{MODEL}'...")
    
    start_time = time.time()
    try:
        # Simple generation
        payload = {
            "model": MODEL,
            "prompt": "Hello via Python test script. Reply with 'ACK'.",
            "stream": False
        }
        
        print("⏳ Sending request...")
        response = requests.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=120)
        
        if response.status_code == 200:
            result = response.json()
            duration = time.time() - start_time
            print(f"✅ Success! Response: {result.get('response', '').strip()}")
            print(f"⏱️ Duration: {duration:.2f} seconds")
        else:
            print(f"❌ Failed. Status: {response.status_code}, Msg: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_ollama()
