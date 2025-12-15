@echo off
echo OLLAMA_BASE_URL=http://localhost:11434 > .env
echo OLLAMA_MODEL=mistral >> .env
echo. >> .env
echo CHROMA_PERSIST_DIR=./chroma_db >> .env
echo. >> .env
echo MONGODB_URI=mongodb+srv://trangiabao02032003_db_user:Jg8mwsFmEc5KlbNJ@lms-b.4ssrf0g.mongodb.net/lms-b?appName=LMS-B >> .env
echo. >> .env
echo REDIS_URL=redis://localhost:6379 >> .env
echo. >> .env
echo AI_SERVICE_PORT=8001 >> .env
echo DEBUG=True >> .env

echo .env file created successfully!
