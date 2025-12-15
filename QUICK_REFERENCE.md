# ⚡ Quick Reference - LMS-B AI System

## 🎯 5-Minute Start

```bash
# Terminal 1
ollama serve

# Terminal 2
mongod

# Terminal 3
redis-server

# Terminal 4
cd python-ai && python main.py

# Terminal 5
cd server && npm run dev

# Terminal 6
cd client && npm run dev

# Open: http://localhost:3000
```

## 📍 Service URLs

| Service    | URL                        | Purpose        |
| ---------- | -------------------------- | -------------- |
| Frontend   | http://localhost:3000      | React app      |
| Backend    | http://localhost:8000      | Express API    |
| AI Service | http://localhost:8001      | Python FastAPI |
| Ollama     | http://localhost:11434     | LLM            |
| MongoDB    | mongodb://localhost:27017  | Database       |
| Redis      | redis://localhost:6379     | Cache          |
| API Docs   | http://localhost:8001/docs | Swagger UI     |

## 🔑 Key Commands

### Python AI Service

```bash
# Setup
cd python-ai
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run
python main.py

# Test
curl http://localhost:8001/api/v1/health/
```

### Express Server

```bash
# Setup
cd server
npm install

# Run
npm run dev

# Test
curl http://localhost:8000/test
```

### React Client

```bash
# Setup
cd client
npm install

# Run
npm run dev

# Build
npm run build
```

### Ollama

```bash
# Install model
ollama pull mistral

# List models
ollama list

# Serve
ollama serve

# Alternative models:
ollama pull neural-chat
ollama pull orca-mini
```

## 📡 Main API Endpoints

### Chat

```bash
POST /api/v1/chat
Body: { "question": "...", "courseId": "..." }
Headers: { "Authorization": "Bearer TOKEN" }
```

### Index Course

```bash
POST /api/v1/courses/index
Body: {
  "course_id": "...",
  "name": "...",
  "description": "...",
  "content": "...",
  "category": "..."
}
```

### Health Check

```bash
GET /api/v1/health
GET /api/v1/health/services
```

## 🛠️ Environment Files

### `python-ai/.env`

```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
WEAVIATE_URL=https://...weaviate.network  (or local)
MONGODB_URI=mongodb://localhost:27017/lms-b
REDIS_URL=redis://localhost:6379
AI_SERVICE_PORT=8001
```

### `server/.env`

```bash
AI_SERVICE_URL=http://localhost:8001
```

## 🚨 Common Issues & Fixes

| Issue                    | Fix                                    |
| ------------------------ | -------------------------------------- |
| "AI service unavailable" | Start Python service: `python main.py` |
| "Model not found"        | `ollama pull mistral`                  |
| "Port already in use"    | Kill process: `taskkill /PID <ID> /F`  |
| "Connection refused"     | Check if MongoDB/Redis are running     |
| "Module not found"       | `pip install -r requirements.txt`      |
| "Cannot find module"     | `npm install`                          |

## 📚 Documentation

- **Setup**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **API**: [API_DOCS.md](./API_DOCS.md)
- **AI System**: [python-ai/README.md](./python-ai/README.md)
- **Complete**: [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)

## 🎮 Testing Chatbot

```bash
# Login to http://localhost:3000
# Click AI Assistant button (bottom-right)
# Ask questions:

"Tôi muốn học Frontend"
"Khóa học React dạy gì?"
"Lộ trình Full Stack?"
"Tôi là người mới bắt đầu"
```

## 🔍 Check Service Status

```bash
# All services
curl http://localhost:8001/api/v1/health/services

# Just AI
curl http://localhost:8001/

# Ollama
curl http://localhost:11434/api/tags

# Redis
redis-cli ping

# MongoDB
mongosh
```

## 💾 File Locations

```
python-ai/
├── main.py           ← Start AI service here
├── requirements.txt  ← Install Python deps
└── app/              ← AI code

server/
├── routes/ai.route.ts  ← AI endpoints
└── .env               ← Config

client/
├── components/chat/ai-chatbot.tsx  ← Chat UI
└── .env                             ← Config
```

## 🎯 Next Steps After Setup

1. **✅ Verify all services running**
2. **✅ Test chatbot with sample questions**
3. **✅ Read IMPLEMENTATION_COMPLETE.md**
4. **✅ Index your courses**
5. **✅ Customize AI prompts**

## 📊 Performance Tips

- First query: ~1-2 seconds (slow)
- Cached query: ~100-200ms (fast)
- Keep Redis running for caching
- GPU speeds up LLM ~10x
- Smaller models = faster responses

## 🔐 Security Checklist

- ✅ JWT required for chat
- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Input validation on
- ✅ Error messages safe
- ✅ No API keys exposed

## 🌟 Key Features

- 🤖 Self-hosted AI
- 📚 RAG-powered answers
- 🔍 Semantic search
- 💬 Real-time chat
- 📱 Mobile responsive
- ⚡ Fast (cached)
- 🛡️ Secure (JWT)
- 🌐 Multi-language ready

## 🆘 Get Help

1. **Check logs** in each terminal
2. **Read documentation** files
3. **Review comments** in code
4. **Check if services running**: See "Check Service Status"
5. **Read error messages** carefully

## 🎓 Learn More

- [LangChain Docs](https://python.langchain.com/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Ollama Models](https://ollama.ai/)
- [Weaviate RAG](https://weaviate.io/)

## 🚀 Quick Deploy

```bash
# Build production
cd server && npm run build
cd client && npm run build

# Use Docker
docker-compose up -d

# See SETUP_GUIDE.md for full deployment
```

---

**Everything you need in one place!** 📋

**Having issues?** → Check SETUP_GUIDE.md
**Want API details?** → Check API_DOCS.md
**Need full overview?** → Check IMPLEMENTATION_COMPLETE.md
