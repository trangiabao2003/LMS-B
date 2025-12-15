from fastapi import APIRouter
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/health", tags=["health"])

@router.get("/")
async def health_check():
    return {
        "status": "healthy",
        "service": "LMS-B AI Service",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@router.get("/services")
async def services_status():
    return {
        "ollama": "configured",
        "weaviate": "configured",
        "mongodb": "configured",
        "redis": "configured"
    }
