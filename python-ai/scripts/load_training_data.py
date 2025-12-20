"""
Script to load training data into ChromaDB vector store
Run this after modifying training_data.py to update the vector store
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datasets.training_data import TRAINING_DATA
from app.services.vector_store_service import get_vector_store
from app.utils.logger import get_logger

logger = get_logger(__name__)

def load_training_data():
    """Load all training data into vector store"""
    try:
        vector_store = get_vector_store()
        
        logger.info(f"📊 Loading {len(TRAINING_DATA)} training samples...")
        
        # Prepare documents for batch insert
        documents = []
        for idx, item in enumerate(TRAINING_DATA):
            doc = {
                "course_id": "training_data",
                "content": f"Q: {item['question']}\nA: {item['answer']}",
                "category": item['category'],
                "type": "qa_pair"
            }
            documents.append(doc)
        
        # Add in batch
        vector_store.add_documents_batch(documents)
        
        # Get stats
        stats = vector_store.get_collection_stats()
        logger.info(f"✅ Training data loaded successfully!")
        logger.info(f"📈 Total documents in store: {stats['total_documents']}")
        
        return True
    except Exception as e:
        logger.error(f"❌ Failed to load training data: {str(e)}")
        return False

def reset_and_reload():
    """Reset vector store and reload all data"""
    try:
        vector_store = get_vector_store()
        
        logger.warning("⚠️  Resetting vector store...")
        vector_store.reset_collection()
        
        logger.info("📊 Reloading training data...")
        return load_training_data()
    except Exception as e:
        logger.error(f"❌ Failed to reset and reload: {str(e)}")
        return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Load training data into vector store")
    parser.add_argument("--reset", action="store_true", help="Reset vector store before loading")
    args = parser.parse_args()
    
    if args.reset:
        success = reset_and_reload()
    else:
        success = load_training_data()
    
    sys.exit(0 if success else 1)
