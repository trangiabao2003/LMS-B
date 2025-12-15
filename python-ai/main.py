from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

# Import routers
from app.routes import health_routes, chat_routes, course_routes

# Import services
from app.services.llm_service import get_llm_service
from app.services.vector_store_service import get_vector_store

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 AI Service starting...")
    try:
        # Initialize services
        llm = get_llm_service()
        vector_store = get_vector_store()
        logger.info("✅ All services initialized")
    except Exception as e:
        logger.error(f"❌ Startup failed: {str(e)}")
    
    yield
    
    # Shutdown
    logger.info("🛑 AI Service stopping...")
    try:
        vector_store = get_vector_store()
        vector_store.close()
    except:
        pass

app = FastAPI(
    title="LMS-B AI Service",
    description="AI-powered chatbot for learning platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Error handler
@app.middleware("http")
async def error_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )

# Include routers
app.include_router(health_routes.router)
app.include_router(chat_routes.router)
app.include_router(course_routes.router)

@app.get("/")
async def root():
    return {
        "message": "🤖 LMS-B AI Service",
        "status": "running",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.on_event("startup")
async def startup_event():
    logger.info("📦 Service startup event")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("📦 Service shutdown event")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8001))
    logger.info(f"Starting on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
