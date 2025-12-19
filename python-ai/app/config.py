import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Ollama LLM
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:1b")  # Changed to lighter model
    
    # ChromaDB Vector Store
    CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
    CHROMA_COLLECTION = "course_content"
    
    # MongoDB
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/lms-b")
    MONGODB_DB = "test"

    
    # Redis Cache
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    REDIS_CACHE_ENABLED = os.getenv("REDIS_CACHE_ENABLED", "false").lower() == "true"
    CACHE_TTL_RESPONSE = 3600  # 1 hour for responses
    CACHE_TTL_EMBEDDING = 86400  # 24 hours for embeddings
    
    # Service
    AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", 8001))
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    
    # LLM Config
    TEMPERATURE = 0.3
    MAX_TOKENS = 256  # Reduced from 512 for faster response
    TOP_K_RETRIEVAL = 3  # Reduced from 5 for faster retrieval
    LLM_TIMEOUT = 20  # 20 second timeout (llama3.2:1b can be slow)
    NUM_PREDICT = 256  # Limit prediction tokens
    
    # RAG
    CONTEXT_WINDOW = 1500  # Reduced from 2000 for faster processing
    
    # Embeddings
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

config = Config()
