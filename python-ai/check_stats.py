"""
Script to check ChromaDB vector store statistics
Quick way to see how many documents are indexed
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.vector_store_service import get_vector_store
from app.utils.logger import get_logger

logger = get_logger(__name__)

def main():
    print("=" * 60)
    print("📊 VECTOR STORE STATISTICS")
    print("=" * 60)
    
    try:
        vector_store = get_vector_store()
        stats = vector_store.get_collection_stats()
        
        print(f"\n✅ Vector Store Ready!")
        print(f"\n📈 Stats:")
        print(f"   Total Documents: {stats.get('total_documents', 0)}")
        print(f"   Collection Name: {stats.get('collection_name', 'unknown')}")
        print(f"   Status: {'Ready' if stats.get('ready', False) else 'Not Ready'}")
        
        # Additional info
        total = stats.get('total_documents', 0)
        if total == 0:
            print(f"\n⚠️  No documents indexed!")
            print(f"   Run: python scripts/load_training_data.py --reset")
        elif total < 50:
            print(f"\n💡 Tip: You have {total} documents.")
            print(f"   - Training Q&A: ~47 items")
            print(f"   - Real courses: ~{total - 47} items (if any)")
        else:
            print(f"\n✨ Great! You have {total} documents indexed.")
        
        print("\n" + "=" * 60)
        
    except Exception as e:
        logger.error(f"❌ Failed to get stats: {str(e)}")
        print(f"\n❌ Error: {str(e)}")
        print(f"\nMake sure:")
        print(f"  1. AI service is running (python main.py)")
        print(f"  2. ChromaDB is initialized")
        print(f"  3. You've indexed some data")
        sys.exit(1)

if __name__ == "__main__":
    main()
