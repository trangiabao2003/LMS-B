from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag_service import get_rag_service
import logging
import time

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

@router.post("/ask", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint for Q&A with courses"""
    start_time = time.time()
    
    try:
        rag_service = get_rag_service()
        result = rag_service.query(
            question=request.question,
            course_id=request.course_id
        )
        
        query_time = time.time() - start_time
        
        # Log if fallback was used
        if result.get("fallback", False):
            logger.warning(f"⚠️ Fallback response used: {result.get('fallback_reason', 'unknown')}")
        
        return ChatResponse(
            answer=result["answer"],
            sources=result.get("sources", []),
            confidence=result.get("confidence", False),
            query_time=query_time
        )
    except Exception as e:
        logger.error(f"❌ Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def chat_history(user_id: str = Query(...)):
    """Get chat history for a user"""
    try:
        # TODO: Fetch from MongoDB
        return {"messages": []}
    except Exception as e:
        logger.error(f"❌ History error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def chat_health():
    return {"status": "healthy", "service": "chat"}
