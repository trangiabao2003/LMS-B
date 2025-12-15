from langchain_community.llms import Ollama
from langchain_community.embeddings import HuggingFaceEmbeddings
from app.config import config
from app.utils.logger import get_logger

logger = get_logger(__name__)

class LLMService:
    """Service for LLM interactions using Ollama"""
    
    def __init__(self):
        try:
            self.llm = Ollama(
                base_url=config.OLLAMA_BASE_URL,
                model=config.OLLAMA_MODEL,
                temperature=config.TEMPERATURE
            )
            logger.info(f"✅ LLM initialized: {config.OLLAMA_MODEL}")
        except Exception as e:
            logger.error(f"❌ Failed to initialize LLM: {str(e)}")
            raise

    def generate(self, prompt: str) -> str:
        """Generate response from prompt"""
        try:
            response = self.llm.invoke(prompt)
            return response
        except Exception as e:
            logger.error(f"❌ LLM generation failed: {str(e)}")
            raise

    def generate_stream(self, prompt: str):
        """Generate response with streaming"""
        try:
            for chunk in self.llm.stream(prompt):
                yield chunk
        except Exception as e:
            logger.error(f"❌ LLM streaming failed: {str(e)}")
            raise

    @staticmethod
    def get_embeddings():
        """Get embedding model"""
        return HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

# Singleton instance
_llm_service = None

def get_llm_service() -> LLMService:
    """Get or create LLM service instance"""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
