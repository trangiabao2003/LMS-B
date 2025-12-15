@echo off
cd /d "%~dp0"

echo 🛑 Stopping Next.js server on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo 🗑️ Clearing .next cache...
if exist .next rmdir /s /q .next

echo 🚀 Starting Next.js server...
npm run dev
