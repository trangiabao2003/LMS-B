import chromadb
from chromadb.config import Settings
from langchain_community.embeddings import HuggingFaceEmbeddings
from app.config import config
from app.utils.logger import get_logger
from typing import List, Optional
import os

logger = get_logger(__name__)

class VectorStoreService:
    """Service for managing vector store (ChromaDB)"""
    
    def __init__(self):
        try:
            # Ensure persist directory exists
            os.makedirs(config.CHROMA_PERSIST_DIR, exist_ok=True)
            
            # Initialize ChromaDB client
            self.client = chromadb.PersistentClient(
                path=config.CHROMA_PERSIST_DIR,
                settings=Settings(
                    anonymized_telemetry=False,
                    allow_reset=True
                )
            )
            
            # Initialize embeddings
            self.embeddings = HuggingFaceEmbeddings(
                model_name=config.EMBEDDING_MODEL,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            
            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name=config.CHROMA_COLLECTION,
                metadata={"description": "LMS Course content for RAG"}
            )
            
            logger.info(f"✅ ChromaDB initialized with {self.collection.count()} documents")
        except Exception as e:
            logger.error(f"❌ Failed to initialize ChromaDB: {str(e)}")
            raise

    def add_document(self, course_id: str, content: str, category: str, doc_type: str):
        """Add document to vector store"""
        try:
            # Generate unique ID
            doc_id = f"{course_id}_{doc_type}_{hash(content) % 1000000}"
            
            # Create embedding
            embedding = self.embeddings.embed_query(content)
            
            # Add to collection
            self.collection.add(
                embeddings=[embedding],
                documents=[content],
                metadatas=[{
                    "course_id": course_id,
                    "category": category,
                    "type": doc_type
                }],
                ids=[doc_id]
            )
            
            logger.info(f"✅ Document added for course: {course_id}")
        except Exception as e:
            logger.error(f"❌ Failed to add document: {str(e)}")
            raise

    def add_documents_batch(self, documents: List[dict]):
        """Add multiple documents at once"""
        try:
            if not documents:
                return
            
            doc_ids = []
            embeddings_list = []
            contents = []
            metadatas = []
            
            for doc in documents:
                course_id = doc.get("course_id", "unknown")
                content = doc.get("content", "")
                category = doc.get("category", "Unknown")
                doc_type = doc.get("type", "general")
                
                doc_id = f"{course_id}_{doc_type}_{hash(content) % 1000000}"
                embedding = self.embeddings.embed_query(content)
                
                doc_ids.append(doc_id)
                embeddings_list.append(embedding)
                contents.append(content)
                metadatas.append({
                    "course_id": course_id,
                    "category": category,
                    "type": doc_type
                })
            
            self.collection.add(
                embeddings=embeddings_list,
                documents=contents,
                metadatas=metadatas,
                ids=doc_ids
            )
            
            logger.info(f"✅ Added {len(documents)} documents in batch")
        except Exception as e:
            logger.error(f"❌ Batch add failed: {str(e)}")
            raise

    def search(self, query: str, limit: int = 5, top_k: int = 5, course_id: Optional[str] = None) -> List[dict]:
        """Search documents in vector store
        Args:
            query: Search query
            limit: Alias for top_k (for compatibility)
            top_k: Number of results to return
            course_id: Optional course ID filter
        """
        # Use limit if top_k is default, otherwise use top_k
        n_results = limit if limit != 5 else top_k
        
        try:
            # Create query embedding
            query_embedding = self.embeddings.embed_query(query)
            
            # Build where filter if course_id specified
            where_filter = None
            if course_id:
                where_filter = {"course_id": course_id}
            
            # Query ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where_filter
            )
            
            # Format results
            documents = []
            if results and results['documents'] and len(results['documents']) > 0:
                for i in range(len(results['documents'][0])):
                    documents.append({
                        "content": results['documents'][0][i],
                        "course_id": results['metadatas'][0][i].get('course_id', 'unknown'),
                        "category": results['metadatas'][0][i].get('category', 'Unknown'),
                        "type": results['metadatas'][0][i].get('type', 'general'),
                        "distance": results['distances'][0][i] if results.get('distances') else 0
                    })
            
            logger.info(f"✅ Found {len(documents)} documents for query")
            return documents
        except Exception as e:
            logger.error(f"❌ Search failed: {str(e)}")
            return []

    def delete_by_course_id(self, course_id: str):
        """Delete all documents for a course"""
        try:
            # Get all documents with this course_id
            results = self.collection.get(
                where={"course_id": course_id}
            )
            
            # Delete by IDs
            if results and results['ids']:
                self.collection.delete(ids=results['ids'])
                logger.info(f"✅ Deleted {len(results['ids'])} documents for course: {course_id}")
            else:
                logger.info(f"⚠️ No documents found for course: {course_id}")
        except Exception as e:
            logger.error(f"❌ Delete failed: {str(e)}")

    def get_collection_stats(self) -> dict:
        """Get statistics about the collection"""
        try:
            count = self.collection.count()
            return {
                "total_documents": count,
                "collection_name": config.CHROMA_COLLECTION,
                "persist_directory": config.CHROMA_PERSIST_DIR
            }
        except Exception as e:
            logger.error(f"❌ Failed to get stats: {str(e)}")
            return {}

    def reset_collection(self):
        """Reset/clear all documents in collection (use with caution!)"""
        try:
            self.client.delete_collection(name=config.CHROMA_COLLECTION)
            self.collection = self.client.create_collection(
                name=config.CHROMA_COLLECTION,
                metadata={"description": "LMS Course content for RAG"}
            )
            logger.warning("⚠️ Collection reset - all documents deleted")
        except Exception as e:
            logger.error(f"❌ Reset failed: {str(e)}")

    def close(self):
        """Close vector store connection"""
        # ChromaDB auto-persists, no explicit close needed
        logger.info("📦 ChromaDB connection closed")

# Singleton instance
_vector_store = None

def get_vector_store() -> VectorStoreService:
    """Get or create vector store instance"""
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStoreService()
    return _vector_store
