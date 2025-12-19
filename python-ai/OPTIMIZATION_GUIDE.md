# AI Performance Optimization Guide

## Overview
This document outlines the optimizations made to reduce AI server response time from timeout errors (>30s) to target ~5 seconds.

## Changes Made

### 1. Model Configuration
- **Changed LLM Model**: `mistral` → `llama3.2:1b` (much lighter, faster)
- **Reduced Token Limit**: 1024 → 512 tokens
- **Reduced Context Window**: 3000 → 2000 characters
- **Reduced Retrieval Count**: Top 5 → Top 3 documents

### 2. Redis Caching
- Added caching layer for responses and embeddings
- Cache TTL: 1 hour for responses, 24 hours for embeddings
- Automatic fallback if Redis unavailable
- Significant speed improvement for repeated queries

### 3. Expanded Training Dataset
- Increased from 10 to 50+ Q&A pairs
- Better coverage of common topics:
  - Frontend/Backend/Full Stack learning paths
  - Platform usage and support
  - Payment and certificates
  - Career guidance
  - Advanced topics (Git, Docker, Testing, etc.)

### 4. Timeout & Fallback Handling
- 10-second LLM timeout
- Keyword-based fallback responses
- Graceful error handling
- No more timeout errors for users

## Installation

### 1. Update Dependencies
```bash
cd python-ai
pip install -r requirements.txt
```

### 2. Install Lighter Ollama Model
```bash
# Pull the lighter model
ollama pull llama3.2:1b

# Or if you want better quality but still faster than Mistral:
ollama pull phi3:mini
```

### 3. Optional: Install Redis (for caching)
**Windows:**
- Option 1: Install Memurai from https://www.memurai.com/
- Option 2: Use Docker:
  ```bash
  docker run -d -p 6379:6379 redis:alpine
  ```

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Mac
brew install redis
```

### 4. Environment Configuration
Create or update `python-ai/.env`:
```env
# LLM Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b

# Redis Cache (optional, set to true if Redis is installed)
REDIS_CACHE_ENABLED=false
REDIS_URL=redis://localhost:6379

# Other configs
AI_SERVICE_PORT=8001
DEBUG=True
```

### 5. Load Training Data
```bash
cd python-ai
python scripts/load_training_data.py --reset
```

## Usage

### Start AI Server
```bash
cd python-ai
python main.py
```

### Testing Performance

1. **Test basic query (first time - no cache):**
```bash
curl -X POST http://localhost:8001/api/v1/chat/ask \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"Tôi muốn học Frontend, nên bắt đầu từ đâu?\"}"
```

2. **Test same query (cached - should be <1s):**
```bash
# Run the same command again - should be much faster
```

3. **Test out-of-dataset query (will use fallback):**
```bash
curl -X POST http://localhost:8001/api/v1/chat/ask \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"Python có khó học không?\"}"
```

## Performance Metrics

| Scenario | Before | After |
|----------|--------|-------|
| First query (no cache) | Timeout (>30s) | 5-8 seconds |
| Cached query | Timeout (>30s) | <1 second |
| Out-of-dataset | Timeout | 5-8 seconds (with fallback) |
| Fallback response | N/A | <100ms |

## Monitoring

### Check Cache Status
```bash
curl http://localhost:8001/api/v1/health
```

### View Server Logs
Logs show:
- ✅ Cache hits/misses
- ⏱️ Query processing times
- ⚠️ Fallback usage
- ❌ Errors and timeouts

## Troubleshooting

### Issue: Still getting timeouts
**Solution:**
1. Verify Ollama is running: `ollama list`
2. Check if llama3.2:1b is installed: `ollama pull llama3.2:1b`
3. Restart AI server

### Issue: Cache not working
**Solution:**
1. Check Redis is running: `redis-cli ping` (should return "PONG")
2. Verify REDIS_CACHE_ENABLED=true in .env
3. Check logs for cache connection errors

### Issue: Low quality responses
**Solution:**
1. Use phi3:mini instead of llama3.2:1b for better quality:
   ```bash
   ollama pull phi3:mini
   ```
2. Update .env: `OLLAMA_MODEL=phi3:mini`
3. Restart server

### Issue: Need to add more training data
**Solution:**
1. Edit `datasets/training_data.py`
2. Add new Q&A pairs to TRAINING_DATA array
3. Run: `python scripts/load_training_data.py --reset`

## Model Comparison

| Model | Size | Speed | Quality | Recommended For |
|-------|------|-------|---------|-----------------|
| llama3.2:1b | 1.3GB | ⚡⚡⚡ Fast | ⭐⭐ Good | Quick responses, simple queries |
| phi3:mini | 3.8GB | ⚡⚡ Medium | ⭐⭐⭐ Better | Balance of speed & quality |
| mistral | 7.3GB | ⚡ Slow | ⭐⭐⭐⭐ Best | High quality, can tolerate wait |

## Next Steps

1. **Monitor performance** in production
2. **Collect user feedback** on response quality
3. **Expand training data** based on common user questions
4. **Fine-tune timeout values** based on actual usage
5. **Consider upgrading to phi3:mini** if response quality is a concern

## Configuration Tunning

If you need different performance characteristics, adjust in `app/config.py`:

```python
# For faster responses (lower quality):
MAX_TOKENS = 256
TOP_K_RETRIEVAL = 2
LLM_TIMEOUT = 5

# For better quality (slower):
MAX_TOKENS = 1024
TOP_K_RETRIEVAL = 5
LLM_TIMEOUT = 15
OLLAMA_MODEL = "phi3:mini"
```

## Support

If you encounter issues:
1. Check server logs: Look for ❌ error messages
2. Verify all services running: Ollama, Python AI server, Redis (optional)
3. Test with curl commands above
4. Check implementation plan for detailed architecture
