from app.services.llm_service import get_llm_service
from app.services.vector_store_service import get_vector_store
from app.utils.logger import get_logger
from app.utils.constants import LEARNING_PATHS
from typing import Optional
import time

logger = get_logger(__name__)

class RAGService:
    """RAG (Retrieval Augmented Generation) Service"""
    
    def __init__(self):
        self.llm_service = get_llm_service()
        self.vector_store = get_vector_store()

    def query(self, question: str, course_id: Optional[str] = None) -> dict:
        """Process user question and generate answer"""
        start_time = time.time()
        
        try:
            # 1. Retrieve context from vector store
            context_docs = self.vector_store.search(
                query=question,
                top_k=5,
                course_id=course_id
            )
            
            # 2. Build context text
            context_text = self._build_context(context_docs)
            
            # 3. Create prompt
            prompt = self._create_prompt(question, context_text)
            
            # 4. Generate response from LLM
            response = self.llm_service.generate(prompt)
            
            query_time = time.time() - start_time
            
            logger.info(f"✅ Query processed in {query_time:.2f}s")
            
            return {
                "answer": response,
                "sources": context_docs,
                "confidence": len(context_docs) > 0
            }
        except Exception as e:
            logger.error(f"❌ RAG query failed: {str(e)}")
            raise

    def _build_context(self, docs: list) -> str:
        """Build context string from retrieved documents"""
        if not docs:
            return "No course information found in database."
        
        context_parts = []
        for doc in docs:
            part = f"[{doc.get('category', 'Unknown')}]\n{doc.get('content', '')}"
            context_parts.append(part)
        
        context = "\n---\n".join(context_parts)
        return context[:3000]  # Limit context size

    def _create_prompt(self, question: str, context: str) -> str:
        """Create prompt for LLM"""
        prompt = f"""Bạn là một trợ lý học tập thông minh cho nền tảng LMS-B.

Dựa trên các thông tin sau từ cơ sở dữ liệu khóa học, hãy trả lời câu hỏi của học viên một cách chi tiết, hữu ích và thân thiện.

=== THÔNG TIN KHÓA HỌC ===
{context}

=== LỘ TRÌNH HỌC ĐƯỢC KHUYÊN ===
- Frontend: HTML/CSS → JavaScript → React → Next.js
- Backend: Node.js → Express → Databases → APIs
- Full Stack: Frontend + Backend + Deployment
- Mobile: JavaScript → React Native → Deployment

=== CÂU HỎI ===
{question}

=== HƯỚNG DẪN TRẢ LỜI ===
1. Trả lời bằng tiếng Việt, tone thân thiện và hỗ trợ
2. Nếu câu hỏi về lộ trình học: gợi ý lộ trình phù hợp
3. Nếu câu hỏi về khóa học: tìm kiếm khóa học liên quan
4. Nếu không tìm thấy thông tin: nói rõ "Tôi không tìm thấy thông tin cụ thể"
5. Giới hạn câu trả lời dưới 200 từ, rõ ràng và có cấu trúc

Trả lời:"""
        return prompt

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
