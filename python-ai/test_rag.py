import sys
import os
import time
from dotenv import load_dotenv

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

try:
    from app.services.vector_store_service import get_vector_store
    
    def test_rag():
        print("🚀 Testing Vector Store Retrieval...")
        
        start_time = time.time()
        try:
            vector_store = get_vector_store()
            init_time = time.time()
            print(f"✅ Vector Store Init: {init_time - start_time:.2f}s")
            
            # Search
            query = "React"
            print(f"🔍 Searching for: '{query}'")
            results = vector_store.search(query, limit=3)
            
            search_time = time.time() - init_time
            print(f"✅ Search completed in {search_time:.2f}s")
            print(f"📚 Found {len(results)} results")
            for res in results:
                print(f"   - {res['content'][:50]}...")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")

    if __name__ == "__main__":
        test_rag()
        
except ImportError as e:
    print(f"❌ Import Error: {e}. Make sure you run this from 'python-ai' directory.")
