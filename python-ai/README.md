# LMS-B AI Service

Self-hosted AI chatbot system using RAG (Retrieval-Augmented Generation) architecture.

## 🎯 Overview

This AI service provides intelligent course recommendations and learning path guidance for the LMS-B platform using:

- **LLM**: Ollama with Mistral 7B model
- **Vector Store**: ChromaDB (self-hosted)
- **Embeddings**: HuggingFace sentence-transformers
- **Backend**: FastAPI
- **Caching**: Redis
- **Database**: MongoDB

## 📂 Project Structure

```
python-ai/
├── app/
│   ├── config.py              # Configuration settings
│   ├── routes/
│   │   ├── chat_routes.py     # Chat API endpoints
│   │   ├── course_routes.py   # Course indexing endpoints
│   │   └── health_routes.py   # Health check endpoints
│   ├── services/
│   │   ├── llm_service.py     # Ollama LLM integration
│   │   ├── vector_store_service.py  # ChromaDB operations
│   │   └── rag_service.py     # RAG pipeline
│   ├── models/
│   │   └── schemas.py         # Pydantic data models
│   └── utils/
│       ├── logger.py          # Logging utilities
│       └── constants.py       # Constants
├── datasets/
│   └── training_data.py       # Sample Q&A data
├── scripts/
│   └── index_courses.py       # Course indexing script
├── chroma_db/                 # ChromaDB storage (auto-created)
├── main.py                    # FastAPI application entry
├── setup_check.py             # Environment verification
├── requirements.txt           # Python dependencies
└── .env                       # Configuration (gitignored)
```

## 🚀 Quick Start

### 1. Prerequisites

- **Python 3.9+** - [Download](https://python.org)
- **Ollama** - [Download](https://ollama.ai)
- **MongoDB** - Running at `mongodb://localhost:27017`
- **Redis** - Running at `redis://localhost:6379`

### 2. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### 3. Download Ollama Model

```bash
ollama pull mistral
```

### 4. Configure Environment

Create `.env` file:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
MONGODB_URI=mongodb://localhost:27017/lms-b
REDIS_URL=redis://localhost:6379
AI_SERVICE_PORT=8001
CHROMA_PERSIST_DIR=./chroma_db
```

### 5. Verify Setup

```bash
python setup_check.py
```

This will check all dependencies and configurations.

### 6. Start AI Service

```bash
python main.py
```

The service will start at `http://localhost:8001`

API documentation: `http://localhost:8001/docs`

### 7. Index Courses

```bash
python scripts/index_courses.py
```

This will load all courses from MongoDB into ChromaDB.

## 📡 API Endpoints

### Chat

**POST** `/api/v1/chat/ask`

Ask a question to the AI.

```json
{
  "question": "Tôi muốn học Frontend?",
  "user_id": "user123",
  "course_id": "optional_course_id"
}
```

**Response:**
```json
{
  "answer": "Để học Frontend, bạn nên...",
  "sources": [
    {
      "content": "...",
      "course_id": "...",
      "category": "Frontend"
    }
  ],
  "confidence": true
}
```

### Course Indexing

**POST** `/api/v1/courses/index`

Index a new course.

```json
{
  "course_id": "course123",
  "name": "React Complete Course",
  "description": "Learn React from scratch",
  "content": "Course content...",
  "category": "Frontend"
}
```

**POST** `/api/v1/courses/reindex/{course_id}`

Update an existing course in the index.

### Health

**GET** `/api/v1/health/`

Check service health.

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `mistral` | LLM model name |
| `MONGODB_URI` | `mongodb://localhost:27017/lms-b` | MongoDB connection |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `AI_SERVICE_PORT` | `8001` | Service port |
| `CHROMA_PERSIST_DIR` | `./chroma_db` | ChromaDB data directory |

### LLM Settings (in `config.py`)

- `TEMPERATURE`: 0.3 (lower = more focused)
- `MAX_TOKENS`: 1024 (response length)
- `TOP_K_RETRIEVAL`: 5 (documents to retrieve)
- `CONTEXT_WINDOW`: 3000 (max context size)

## 🧪 Testing

### Test Health Endpoint

```bash
curl http://localhost:8001/api/v1/health/
```

### Test Chat

```bash
curl -X POST http://localhost:8001/api/v1/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Tôi muốn học Frontend?",
    "user_id": "test_user"
  }'
```

### Test Course Indexing

```bash
curl -X POST http://localhost:8001/api/v1/courses/index \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "test123",
    "name": "Test Course",
    "description": "A test course",
    "content": "This is test content",
    "category": "Programming"
  }'
```

## 📊 Architecture

```
User Question
    ↓
[Chat API Endpoint]
    ↓
[RAG Service]
    ↓
1. Vector Search (ChromaDB)
   - Find relevant course content
   - Get top K similar documents
    ↓
2. Context Building
   - Combine retrieved documents
   - Format for LLM
    ↓
3. LLM Generation (Ollama/Mistral)
   - Generate natural answer
   - Include sources
    ↓
Response + Sources
```

## 🆘 Troubleshooting

### "Connection refused" to Ollama

- Make sure Ollama is running: `ollama serve`
- Check if model is downloaded: `ollama list`
- Pull Mistral if missing: `ollama pull mistral`

### "ChromaDB error"

- Check if `chroma_db` directory exists
- Try deleting `chroma_db` and restarting
- Check disk space

### "MongoDB connection failed"

- Verify MongoDB is running: `mongod`
- Check MongoDB URI in `.env`
- Test connection: `mongosh`

### "Redis connection failed"

- Start Redis: `redis-server`
- Check Redis URL in `.env`
- Test: `redis-cli ping`

### Slow responses

- First query is always slower (model loading)
- Use GPU for 10x faster inference
- Reduce `MAX_TOKENS` for faster generation
- Try smaller model: `ollama pull phi`

## 🔐 Security Notes

- This is a **self-hosted** service (no external APIs)
- **No API keys** stored (fully offline after setup)
- **Rate limiting** should be implemented in production
- **Authentication** is handled by Express backend

## 📈 Performance

| Metric | Value | Notes |
|--------|-------|-------|
| First query | 1-2s | Ollama startup |
| Subsequent queries | 300-500ms | Typical |
| With GPU | 100-200ms | Much faster |
| Memory usage | ~4GB | Mistral model |
| Disk space | ~5GB | Model + embeddings |

## 🎓 For Development

### Add New Training Data

Edit `datasets/training_data.py`:

```python
TRAINING_DATA.append({
    "question": "Your question",
    "answer": "Your answer",
    "category": "category_name",
    "tags": ["tag1", "tag2"]
})
```

### Customize AI Prompts

Edit `app/services/rag_service.py` → `_create_prompt()` method

### Change Embedding Model

Edit `app/config.py`:

```python
EMBEDDING_MODEL = "keepitreal/vietnamese-sbert"  # Better Vietnamese
```

### Use Different LLM

```bash
ollama pull llama2
```

Then update `.env`:
```env
OLLAMA_MODEL=llama2
```

## 📝 License

Part of LMS-B Learning Platform

## 🙏 Credits

- **Ollama** - LLM inference
- **ChromaDB** - Vector database
- **LangChain** - RAG framework
- **FastAPI** - Web framework
- **HuggingFace** - Embeddings

---

**Built with ❤️ for LMS-B**
