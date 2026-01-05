# LMS-B AI Chatbot - Setup Guide

## ✨ Features

- 🤖 Self-hosted AI using Ollama + Mistral model
- 📚 RAG (Retrieval-Augmented Generation) for course-based Q&A
- 🔍 Vector store for semantic search (Weaviate)
- 💾 Cached responses for performance
- 🌐 Real-time chat interface
- 📊 Multi-language support (Vietnamese, English)

## 📋 Prerequisites

Make sure you have these installed:

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
  Download: https://www.python.org/downloads/
- **Node.js 18+** - [Download](https://nodejs.org/)
  Download: https://nodejs.org/
- **Ollama** - [Download](https://ollama.ai/) (LLM Runtime)
  Download: https://ollama.ai
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
  Download: https://www.mongodb.com/try/download/community
- **Redis** - [Download](https://redis.io/download)
  Download: https://github.com/microsoftarchive/redis/releases

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Ollama & Download Model

# cd /d "D:\BYun\File Visual Studio Code\LMS-B"

```bash
# After installing Ollama, open terminal/cmd and run:
ollama pull mistral

# Check if model is ready
ollama list
# Output should show: mistral latest xxx GB
```

### Step 2: Start Required Services

**Terminal 1 - MongoDB:**

```bash
mongod
# Output: waiting for connections on port 27017
```

**Terminal 2 - Redis:**

```bash
netstat -ano | findstr :6379
taskkill /PID 4904 /F
redis-server
# Output: Ready to accept connections
```

**Terminal 3 - Ollama (if not running in background):**

```bash
ollama serve
# Output: Listening on localhost:11434
```

### Step 3: Setup Python AI Service

```bash
# Navigate to python-ai folder
cd /d "D:\BYun\File Visual Studio Code\LMS-B\python-ai"
# cd d:\BYun\File Visual Studio Code\LMS-B\python-ai

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run AI service
python main.py
# Output: Application startup complete
# Check: http://localhost:8001/docs
```

### Step 4: Start Express Backend

```bash
cd d:\BYun\File Visual Studio Code\LMS-B\server

# Install dependencies (if not done)
npm install

# Run server
npm run dev
# Output: listening on port 8000
```

### Step 5: Start React Frontend

```bash
cd d:\BYun\File Visual Studio Code\LMS-B\client

# Install dependencies (if not done)
npm install

# Run frontend
npm run dev
# Output: ready - started server on 0.0.0.0:3000
```

## ✅ Verification

Check if everything is working:

```bash
# 1. Check Ollama
curl http://localhost:11434/api/tags

# 2. Check AI Service
curl http://localhost:8001/api/v1/health/

# 3. Check Express
curl http://localhost:8000/api/v1/health (or similar)

# 4. Check MongoDB
mongosh

# 5. Check Redis
redis-cli ping
# Output: PONG
```

## 🤖 Using the AI Chatbot

1. **Open your browser**: http://localhost:3000
2. **Login** with your account
3. **Look for AI Assistant button** in the bottom-right corner
4. **Start asking questions** about courses or learning paths

### Example Questions:

- "Tôi muốn học Frontend, bắt đầu từ đâu?"
- "Khóa học React của các bạn dạy gì?"
- "Có khóa học Full Stack không?"
- "Tôi là người mới bắt đầu, nên học gì?"

## 🔧 Configuration

### AI Service (.env)

```bash
# python-ai/.env

# Ollama configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral

# For Cloud Weaviate (Recommended for simplicity):
WEAVIATE_URL=https://your-cluster.weaviate.network
WEAVIATE_API_KEY=your_api_key

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/lms-b

# Local Redis
REDIS_URL=redis://localhost:6379

# Service
AI_SERVICE_PORT=8001
```

### Express Server (.env)

```bash
# server/.env
AI_SERVICE_URL=http://localhost:8001
```

## 📚 Indexing Courses

The AI needs to learn about your courses. You can:

### Option 1: Automatic (When Creating Courses)

Update course creation to automatically index:

```typescript
// After course creation in controller
await axios.post(`${process.env.AI_SERVICE_URL}/api/v1/courses/index`, {
	course_id: course._id,
	name: course.name,
	description: course.description,
	content: course.courseData.map((d) => d.title).join(" "),
	category: course.categories,
});
```

### Option 2: Manual Indexing

```bash
curl -X POST http://localhost:8001/api/v1/courses/index \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "course_id_here",
    "name": "Course Name",
    "description": "Course Description",
    "content": "Full course content...",
    "category": "Frontend"
  }'
```

## 🎯 Customizing the Chatbot

### Change Model Size

Edit `python-ai/app/config.py`:

```python
OLLAMA_MODEL = "mistral"  # or "neural-chat", "orca-mini"
```

Available lightweight models:

- `mistral` (7B) - Recommended, fast
- `neural-chat` (7B) - Good for conversation
- `orca-mini` (3B) - Smaller, faster

### Change Personality

Edit `app/services/rag_service.py` `_create_prompt()` method:

```python
# Modify the system prompt to change AI behavior
prompt = f"""
Bạn là một trợ lý học tập... (customize here)
"""
```

## 🐛 Troubleshooting

### "AI service unavailable"

```bash
# Check if Python service is running
curl http://localhost:8001/api/v1/health/

# If not, start it:
cd python-ai
python main.py
```

### "Connection refused"

```bash
# Make sure all services are running:
1. MongoDB: mongod running?
2. Redis: redis-server running?
3. Ollama: ollama serve running?
```

### "Model not found"

```bash
ollama pull mistral
ollama list
```

### Port already in use

```bash
# Find process using port
netstat -ano | findstr :8001

# Kill process
taskkill /PID <PID> /F
```

## 📊 Monitoring

### View AI Service Logs

Logs are in the FastAPI service output. For detailed logging:

```python
# python-ai/app/utils/logger.py is configured for this
```

### Check Service Health

```bash
# Full health check
curl http://localhost:8001/api/v1/health/services
```

## 🔐 Production Deployment

For production, consider:

1. **Use Cloud Weaviate** instead of local
2. **Deploy Python service** on separate server
3. **Use production Ollama** with GPU
4. **Implement rate limiting** in Express
5. **Cache responses** in Redis (already implemented)
6. **Monitor service health** regularly

## 📖 API Endpoints

### Chat Endpoint

```
POST /api/v1/chat
Body: {
  "question": "string",
  "courseId": "optional string"
}
```

### Course Indexing

```
POST /api/v1/courses/index
Body: {
  "course_id": "string",
  "name": "string",
  "description": "string",
  "content": "string",
  "category": "string"
}
```

### Health Check

```
GET /api/v1/health/
```

## 🆘 Support

If you encounter issues:

1. Check the logs in each terminal
2. Verify all services are running
3. Check `.env` files are configured correctly
4. Try restarting the services
5. Check local firewall settings

## 📝 Next Steps

1. **Index your courses** - Add them to the vector store
2. **Customize prompts** - Adjust AI behavior for your needs
3. **Add chat history** - Implement MongoDB storage
4. **Fine-tune model** - Train on your specific data
5. **Deploy** - Move to production with Docker

---

**Happy chatting! 🚀**
