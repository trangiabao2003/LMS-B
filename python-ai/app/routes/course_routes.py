from fastapi import APIRouter, HTTPException
from app.models.schemas import CourseIndexRequest, CourseIndexResponse
from app.services.vector_store_service import get_vector_store
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/courses", tags=["courses"])

@router.post("/index", response_model=CourseIndexResponse)
async def index_course(request: CourseIndexRequest):
    """Index a course to vector store"""
    try:
        vector_store = get_vector_store()
        
        # Index course name
        vector_store.add_document(
            course_id=request.course_id,
            content=request.name,
            category="course_name",
            doc_type="metadata"
        )
        
        # Index description
        vector_store.add_document(
            course_id=request.course_id,
            content=request.description,
            category="description",
            doc_type="metadata"
        )
        
        # Index content
        vector_store.add_document(
            course_id=request.course_id,
            content=request.content,
            category=request.category,
            doc_type="content"
        )
        
        logger.info(f"✅ Course {request.course_id} indexed successfully")
        
        return CourseIndexResponse(
            success=True,
            message=f"Course {request.course_id} indexed successfully",
            course_id=request.course_id
        )
    except Exception as e:
        logger.error(f"❌ Indexing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reindex/{course_id}")
async def reindex_course(course_id: str, request: CourseIndexRequest):
    """Reindex a course (update existing)"""
    try:
        vector_store = get_vector_store()
        
        # Delete old documents
        vector_store.delete_by_course_id(course_id)
        
        # Index new documents
        vector_store.add_document(
            course_id=course_id,
            content=request.name,
            category="course_name",
            doc_type="metadata"
        )
        
        vector_store.add_document(
            course_id=course_id,
            content=request.description,
            category="description",
            doc_type="metadata"
        )
        
        vector_store.add_document(
            course_id=course_id,
            content=request.content,
            category=request.category,
            doc_type="content"
        )
        
        logger.info(f"✅ Course {course_id} reindexed successfully")
        
        return CourseIndexResponse(
            success=True,
            message=f"Course {course_id} reindexed successfully",
            course_id=course_id
        )
    except Exception as e:
        logger.error(f"❌ Reindexing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
