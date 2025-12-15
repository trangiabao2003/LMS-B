from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    question: str
    course_id: Optional[str] = None
    user_id: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]
    confidence: bool
    query_time: float

class CourseIndexRequest(BaseModel):
    course_id: str
    name: str
    description: str
    content: str
    category: str
    level: Optional[str] = "beginner"

class CourseIndexResponse(BaseModel):
    success: bool
    message: str
    course_id: str

class DocumentSource(BaseModel):
    content: str
    course_id: str
    category: str
    type: str
    distance: float

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: datetime
