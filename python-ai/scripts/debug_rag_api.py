import requests
import json
import time

def test_api():
    url = "http://localhost:8001/api/v1/chat/ask"
    question = "Khóa học React của bạn dạy những gì?"
    
    payload = {
        "question": question,
        "user_id": "debug_user",
        "course_id": None
    }
    
    print(f"🚀 Sending request to {url}...")
    print(f"❓ Question: {question}")
    
    start_time = time.time()
    try:
        response = requests.post(url, json=payload, timeout=70) # 70s timeout
        duration = time.time() - start_time
        
        print(f"⏱️ Duration: {duration:.2f}s")
        print(f"📡 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Response Data:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            if data.get("fallback"):
                print("\n⚠️ FALLBACK DETECTED!")
                print("Possible reasons: Timeout, LLM Error, or No Context Found.")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request Failed: {e}")

if __name__ == "__main__":
    test_api()
