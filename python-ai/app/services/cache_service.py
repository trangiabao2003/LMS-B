import redis
import json
import hashlib
from typing import Optional
from app.config import config
from app.utils.logger import get_logger

logger = get_logger(__name__)

class CacheService:
    """Redis caching service for LLM responses and embeddings"""
    
    def __init__(self):
        self.enabled = config.REDIS_CACHE_ENABLED
        self.client = None
        
        if self.enabled:
            try:
                self.client = redis.from_url(
                    config.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=2
                )
                # Test connection
                self.client.ping()
                logger.info("✅ Redis cache connected")
            except Exception as e:
                logger.warning(f"⚠️ Redis not available, caching disabled: {str(e)}")
                self.enabled = False
                self.client = None
    
    def _generate_key(self, prefix: str, data: str) -> str:
        """Generate cache key from data"""
        hash_obj = hashlib.md5(data.encode())
        return f"{prefix}:{hash_obj.hexdigest()}"
    
    def get_response(self, question: str, course_id: Optional[str] = None) -> Optional[dict]:
        """Get cached response for a question"""
        if not self.enabled or not self.client:
            return None
        
        try:
            key_data = f"{question}:{course_id or 'all'}"
            key = self._generate_key("response", key_data)
            
            cached = self.client.get(key)
            if cached:
                logger.info(f"✅ Cache hit for question")
                return json.loads(cached)
            
            logger.debug("Cache miss for question")
            return None
        except Exception as e:
            logger.warning(f"⚠️ Cache get failed: {str(e)}")
            return None
    
    def set_response(self, question: str, response_data: dict, course_id: Optional[str] = None):
        """Cache a response"""
        if not self.enabled or not self.client:
            return
        
        try:
            key_data = f"{question}:{course_id or 'all'}"
            key = self._generate_key("response", key_data)
            
            self.client.setex(
                key,
                config.CACHE_TTL_RESPONSE,
                json.dumps(response_data)
            )
            logger.debug(f"✅ Response cached")
        except Exception as e:
            logger.warning(f"⚠️ Cache set failed: {str(e)}")
    
    def get_embedding(self, text: str) -> Optional[list]:
        """Get cached embedding for text"""
        if not self.enabled or not self.client:
            return None
        
        try:
            key = self._generate_key("embedding", text)
            cached = self.client.get(key)
            
            if cached:
                logger.debug("✅ Embedding cache hit")
                return json.loads(cached)
            
            return None
        except Exception as e:
            logger.warning(f"⚠️ Embedding cache get failed: {str(e)}")
            return None
    
    def set_embedding(self, text: str, embedding: list):
        """Cache an embedding"""
        if not self.enabled or not self.client:
            return
        
        try:
            key = self._generate_key("embedding", text)
            self.client.setex(
                key,
                config.CACHE_TTL_EMBEDDING,
                json.dumps(embedding)
            )
            logger.debug("✅ Embedding cached")
        except Exception as e:
            logger.warning(f"⚠️ Embedding cache set failed: {str(e)}")
    
    def clear_all(self):
        """Clear all cache (use with caution)"""
        if not self.enabled or not self.client:
            return
        
        try:
            # Delete all keys matching our patterns
            for pattern in ["response:*", "embedding:*"]:
                keys = self.client.keys(pattern)
                if keys:
                    self.client.delete(*keys)
            logger.warning("⚠️ All cache cleared")
        except Exception as e:
            logger.error(f"❌ Cache clear failed: {str(e)}")
    
    def get_stats(self) -> dict:
        """Get cache statistics"""
        if not self.enabled or not self.client:
            return {"enabled": False}
        
        try:
            info = self.client.info()
            return {
                "enabled": True,
                "connected": True,
                "used_memory": info.get("used_memory_human"),
                "total_keys": self.client.dbsize()
            }
        except Exception as e:
            return {"enabled": True, "connected": False, "error": str(e)}

# Singleton instance
_cache_service = None

def get_cache_service() -> CacheService:
    """Get or create cache service instance"""
    global _cache_service
    if _cache_service is None:
        _cache_service = CacheService()
    return _cache_service
