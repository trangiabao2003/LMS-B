"""
Script to index manual training data (Q&A) into ChromaDB
"""

import sys
import os
from langchain_community.embeddings import HuggingFaceEmbeddings

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.vector_store_service import get_vector_store
from datasets.training_data import TRAINING_DATA
from app.utils.logger import get_logger

logger = get_logger(__name__)

def main():
    logger.info("="*60)
    logger.info("🚀 Starting training data indexing")
    logger.info("="*60)
    
    try:
        vector_store = get_vector_store()
        
        documents = []
        for item in TRAINING_DATA:
            # Create content string
            question = item["question"]
            answer = item["answer"]
            category = item["category"]
            tags = ", ".join(item.get("tags", []))
            
            # Format content for optimal retrieval
            content = f"Question: {question}\nAnswer: {answer}\nTags: {tags}"
            
            documents.append({
                "course_id": "faq",  # Special ID for FAQs
                "content": content,
                "category": f"FAQ - {category}",
                "type": "qa_pair"
            })
            
        if documents:
            vector_store.add_documents_batch(documents)
            logger.info(f"✅ Indexed {len(documents)} Q&A pairs")
        else:
            logger.warning("⚠️ No training data found")
            
        # Show stats
        stats = vector_store.get_collection_stats()
        logger.info(f"\n📈 Vector Store Stats:")
        logger.info(f"   Total documents: {stats.get('total_documents', 0)}")
        
        logger.info("🎉 Training data indexing completed!")
        
    except Exception as e:
        logger.error(f"❌ Indexing failed: {str(e)}")

if __name__ == "__main__":
    main()
