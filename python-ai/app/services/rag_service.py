from app.services.llm_service import get_llm_service
from app.services.vector_store_service import get_vector_store
from app.services.cache_service import get_cache_service
from app.utils.logger import get_logger
from app.utils.constants import LEARNING_PATHS
from app.utils.fallback_handler import get_fallback_response
from app.config import config
from typing import Optional
import time
import asyncio

logger = get_logger(__name__)

class RAGService:
    """RAG (Retrieval Augmented Generation) Service"""
    
    def __init__(self):
        self.llm_service = get_llm_service()
        self.vector_store = get_vector_store()
        self.cache_service = get_cache_service()

    def query(self, question: str, course_id: Optional[str] = None) -> dict:
        """Process user question and generate answer with caching and timeout"""
        start_time = time.time()
        
        try:
            # 1. Try to get from cache first
            cached_response = self.cache_service.get_response(question, course_id)
            if cached_response:
                query_time = time.time() - start_time
                logger.info(f"✅ Query served from cache in {query_time:.2f}s")
                return cached_response
            
            # 2. Retrieve context from vector store
            context_docs = self.vector_store.search(
                query=question,
                top_k=config.TOP_K_RETRIEVAL,
                course_id=course_id
            )
            
            # 3. Build context text
            context_text = self._build_context(context_docs)
            
            # 4. Create prompt
            prompt = self._create_prompt(question, context_text)
            
            # 5. Generate response from LLM with timeout handling
            try:
                response = self.llm_service.generate(prompt, timeout=config.LLM_TIMEOUT)
            except Exception as llm_error:
                # LLM failed or timed out, use fallback
                logger.warning(f"⚠️ LLM failed, using fallback: {str(llm_error)}")
                fallback = get_fallback_response(question, "error")
                return fallback
            
            query_time = time.time() - start_time
            
            # Check if query took too long
            if query_time >= config.LLM_TIMEOUT:
                logger.warning(f"⚠️ Query exceeded timeout, using fallback")
                return get_fallback_response(question, "timeout")
            
            logger.info(f"✅ Query processed in {query_time:.2f}s")
            
            result = {
                "answer": response,
                "sources": context_docs,
                "confidence": len(context_docs) > 0,
                "fallback": False
            }
            
            # 6. Cache the response
            self.cache_service.set_response(question, result, course_id)
            
            return result
        except Exception as e:
            logger.error(f"❌ RAG query failed: {str(e)}")
            return get_fallback_response(question, "error")

    def _build_context(self, docs: list) -> str:
        """Build context string from retrieved documents"""
        if not docs:
            return "No course information found in database."
        
        context_parts = []
        for doc in docs:
            part = f"[{doc.get('category', 'Unknown')}]\n{doc.get('content', '')}"
            context_parts.append(part)
        
        context = "\n---\n".join(context_parts)
        return context[:config.CONTEXT_WINDOW]  # Use config limit

    def _create_prompt(self, question: str, context: str) -> str:
        """The simplest prompt possible for llama3.2:1b"""
        return f"Dựa vào nội dung này: '{context}'. Hãy trả lời câu hỏi: '{question}' bằng tiếng Việt ngắn gọn."

    def search_courses(self, query: str) -> list:
        """Search for courses related to query"""
        try:
            results = self.vector_store.search(query, top_k=10)
            logger.info(f"✅ Found {len(results)} courses")
            return results
        except Exception as e:
            logger.error(f"❌ Course search failed: {str(e)}")
            return []

# Singleton instance
_rag_service = None

def get_rag_service() -> RAGService:
    """Get or create RAG service instance"""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
