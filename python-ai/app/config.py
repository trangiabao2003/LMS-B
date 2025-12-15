import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Ollama LLM
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")
    
    # ChromaDB Vector Store
    CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
    CHROMA_COLLECTION = "course_content"
    
    # MongoDB
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/lms-b")
    MONGODB_DB = "test"

    
    # Redis
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Service
    AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", 8001))
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    
    # LLM Config
    TEMPERATURE = 0.3
    MAX_TOKENS = 1024
    TOP_K_RETRIEVAL = 5
    
    # RAG
    CONTEXT_WINDOW = 3000
    
    # Embeddings
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

config = Config()
