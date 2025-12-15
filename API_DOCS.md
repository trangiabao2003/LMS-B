# LMS-B AI API Documentation

## Base URLs

- **Python AI Service**: `http://localhost:8001`
- **Express Server**: `http://localhost:8000`
- **React Frontend**: `http://localhost:3000`

## Authentication

Most endpoints require JWT token in headers:

```
Authorization: Bearer <token>
```

## Python AI Service Endpoints

### 1. Health Check

**GET** `/api/v1/health/`

Check if AI service is running.

**Response:**

```json
{
	"status": "healthy",
	"service": "LMS-B AI Service",
	"version": "1.0.0",
	"timestamp": "2024-01-01T12:00:00"
}
```

### 2. Chat with AI

**POST** `/api/v1/chat/ask`

Send a question to the chatbot.

**Request Body:**

```json
{
	"question": "Tôi muốn học Frontend?",
	"course_id": "optional_course_id",
	"user_id": "user_id_123"
}
```

**Response:**

```json
{
	"answer": "Để học Frontend, bạn nên...",
	"sources": [
		{
			"content": "React is...",
			"course_id": "course_123",
			"category": "Frontend",
			"type": "content",
			"distance": 0.123
		}
	],
	"confidence": true,
	"query_time": 2.35
}
```

### 3. Index Course

**POST** `/api/v1/courses/index`

Add/update course to vector store for AI to learn from.

**Request Body:**

```json
{
	"course_id": "course_123",
	"name": "Learn React",
	"description": "Master React.js from basics to advanced",
	"content": "Chapter 1: Introduction... Chapter 2: Components...",
	"category": "Frontend",
	"level": "beginner"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Course course_123 indexed successfully",
	"course_id": "course_123"
}
```

### 4. Reindex Course

**POST** `/api/v1/courses/reindex/{course_id}`

Update existing course data in vector store.

**Same as Index Course endpoint**

## Express Server Endpoints

### 1. Chat API

**POST** `/api/v1/chat`

Chat endpoint proxying to Python AI service.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
	"question": "Tôi muốn học Frontend?",
	"courseId": "optional_course_id"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "answer": "...",
    "sources": [...],
    "confidence": true,
    "query_time": 2.35
  },
  "cached": false
}
```

**Status Codes:**

- `200` - Success
- `400` - Missing required fields
- `500` - Server error
- `503` - AI service unavailable

### 2. Chat History

**GET** `/api/v1/history`

Get chat history for authenticated user.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
	"success": true,
	"data": [
		{
			"id": "message_id_123",
			"question": "...",
			"answer": "...",
			"timestamp": "2024-01-01T12:00:00"
		}
	]
}
```

### 3. Index Course (Express Proxy)

**POST** `/api/v1/index-course`

Proxy to Python AI service.

**Same as Python endpoint**

### 4. Reindex Course (Express Proxy)

**POST** `/api/v1/reindex-course/:courseId`

Proxy to Python AI service.

**Same as Python endpoint**

### 5. AI Health Check (Express Proxy)

**GET** `/api/v1/health`

Check both Express and AI service health.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "LMS-B AI Service",
    ...
  }
}
```

## Error Responses

### Standard Error Format

```json
{
	"success": false,
	"message": "Error description"
}
```

### Common Errors

| Status | Error                           | Solution                           |
| ------ | ------------------------------- | ---------------------------------- |
| 400    | "Question and user ID required" | Include question and user auth     |
| 500    | "AI service error"              | Check if Python service is running |
| 503    | "AI service unavailable"        | Start Python AI service            |

## Rate Limiting

- Chat endpoint: 10 requests per minute per user
- Course indexing: 5 requests per minute
- No limits on read operations

## Caching

Responses are cached for:

- Chat responses: 1 hour (per question per user)
- Course data: 24 hours
- Health checks: 5 minutes

## Webhooks

Currently not implemented. Can be added for:

- Course updates
- Chat completions
- Error notifications

## Examples

### Example 1: Ask a Question

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Tôi muốn học Frontend",
    "courseId": null
  }'
```

### Example 2: Index a Course

```bash
curl -X POST http://localhost:8001/api/v1/courses/index \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "react_basics_001",
    "name": "React Basics",
    "description": "Learn React from scratch",
    "content": "Introduction to React... Components... State...",
    "category": "Frontend"
  }'
```

### Example 3: Check Health

```bash
curl http://localhost:8001/api/v1/health/
```

## WebSocket Events (Optional Future)

Can be implemented for real-time chat:

```javascript
socket.emit("chat:message", {
	question: "...",
	userId: "...",
});

socket.on("chat:response", (data) => {
	console.log(data.answer);
});
```

## Rate Limit Headers

Response headers include:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1609459200
```

## Pagination

Chat history supports pagination:

```
GET /api/v1/history?page=1&limit=20
```

## Versioning

Current API version: `1.0.0`

All endpoints use `/api/v1/` prefix.

Future versions will use `/api/v2/`, etc.

---

**Last Updated**: December 2024
