import sys
import os
import logging

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.services.vector_store_service import get_vector_store
from app.services.llm_service import get_llm_service
from app.config import config

def test_rag():
    question = "Khóa học React của bạn dạy những gì?"
    print(f"\n❓ Testing Question: {question}")
    
    # 1. Test Retrieval
    print("\n🔎 1. Testing Retrieval...")
    try:
        vs = get_vector_store()
        docs = vs.search(question, top_k=3)
        
        if not docs:
            print("❌ No documents found!")
        else:
            print(f"✅ Found {len(docs)} documents:")
            for i, doc in enumerate(docs):
                print(f"   {i+1}. [Dist: {doc.get('distance', 'N/A'):.4f}] {doc.get('content')[:100]}...")
    except Exception as e:
        print(f"❌ Retrieval Failed: {e}")
        return

    # 2. Test LLM Generation
    print("\n🧠 2. Testing LLM Generation...")
    try:
        llm = get_llm_service()
        
        context = "\n".join([d['content'] for d in docs]) if docs else "No context"
        prompt = f"Context: {context}\n\nQuestion: {question}\n\nAnswer:"
        
        print("   Sending request to Ollama (timeout={config.LLM_TIMEOUT}s)...")
        response = llm.generate(prompt)
        print(f"\n✅ LLM Response:\n{response}")
    except Exception as e:
        print(f"❌ LLM Failed: {e}")

if __name__ == "__main__":
    test_rag()
