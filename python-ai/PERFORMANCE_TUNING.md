# Quick Performance Tuning Guide

## Current Status
- Response time: 10-15 seconds (still too slow)
- Frequent timeouts causing fallback responses

## Latest Optimizations Applied

### 1. Token Limits (CRITICAL for speed)
```python
MAX_TOKENS = 256          # Was 512, now 256 (50% reduction)
NUM_PREDICT = 256         # NEW: Hard limit on generation
CONTEXT_WINDOW = 1500     # Was 2000, now 1500
```

### 2. Timeout Increased
```python
LLM_TIMEOUT = 20          # Was 10s, now 20s to avoid premature fallback
```

### 3. Prompt Optimization
- Removed verbose instructions
- Shortened from ~450 tokens to ~100 tokens (77% reduction)
- Kept only essential context

### 4. Ollama Configuration
Added `num_predict=256` to force Ollama to stop at 256 tokens

## Expected Results After Restart
- Response time: **5-10 seconds** (down from 10-15s)
- Fewer timeout fallbacks
- Shorter but adequate responses

## Next Steps

### 1. Restart Server (REQUIRED)
```bash
# Press Ctrl+C in python main.py terminal
python main.py
```

### 2. Test Performance
```bash
curl -X POST http://localhost:8001/api/v1/chat/ask \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"Tôi muốn học Frontend, nên bắt đầu từ đâu?\"}"
```

### 3. Monitor Logs
Look for:
- ✅ Response time < 10 seconds
- ✅ Fewer timeout warnings
- ⚠️ If still slow, see additional options below

## Additional Options If Still Slow

### Option 1: Enable Caching (Recommended)
Install Redis for instant cached responses:
```bash
# Windows: Download Memurai or use Docker
docker run -d -p 6379:6379 redis:alpine
```

Update `.env`:
```env
REDIS_CACHE_ENABLED=true
```

**Benefit:** Cached queries return in <1 second

### Option 2: Use Smaller Model
If quality is acceptable, try even lighter model:
```bash
ollama pull qwen2:0.5b
```

Update `.env`:
```env
OLLAMA_MODEL=qwen2:0.5b
```

**Benefit:** ~2-3 second responses, but lower quality

### Option 3: Further Reduce Tokens
Edit `config.py`:
```python
MAX_TOKENS = 128
NUM_PREDICT = 128
CONTEXT_WINDOW = 1000
```

**Benefit:** Faster but very short responses

### Option 4: Upgrade Hardware (Long-term)
llama3.2:1b requires decent CPU:
- Recommended: 8GB+ RAM, 4+ cores
- Ideal: 16GB RAM, 8+ cores

Or consider cloud deployment (Ollama on better hardware)

## Performance Comparison

| Config | Response Time | Quality | Recommended For |
|--------|---------------|---------|-----------------|
| Current (256 tokens) | 5-10s | Good | General use |
| With Redis cache | <1s (cached) | Good | Production |
| 128 tokens | 3-6s | Fair | Speed critical |
| qwen2:0.5b | 2-3s | Fair | Speed critical |
| phi3:mini | 8-15s | Better | Quality critical |

## Troubleshooting

### Still Getting Timeouts?
1. Check Ollama is running: `ollama list`
2. Check CPU usage during query
3. Try increasing timeout to 30s temporarily
4. Consider caching or lighter model

### Responses Too Short?
1. Increase MAX_TOKENS to 384
2. Update prompt to request more detail
3. Accept longer response times

### Quality Issues?
1. Consider phi3:mini (slower but better)
2. Add more training data
3. Improve prompt engineering
