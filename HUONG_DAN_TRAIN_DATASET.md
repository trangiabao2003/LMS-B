# 🎯 HƯỚNG DẪN TRAIN DATASET CHO AI CHATBOT

## 📌 LƯU Ý QUAN TRỌNG
- Chatbot **KHÔNG train model LLM**
- Chỉ **INDEX dataset** vào ChromaDB (Vector Store)
- LLM (llama3.2:1b) đã được train sẵn

---

## 🔍 KIỂM TRA ĐÃ INDEX CHƯA

### Cách 1: Dùng script check_stats.py ⭐ (KHUYẾN NGHỊ)
```bash
cd "d:\BYun\File Visual Studio Code\LMS-B\python-ai"
python check_stats.py
```

**Output:**
```
============================================================
📊 VECTOR STORE STATISTICS
============================================================
✅ Vector Store Ready!

📈 Stats:
   Total Documents: 47
   Collection Name: course_content
   Status: Ready
============================================================
```

### Cách 2: Check qua API
```bash
curl http://localhost:8001/api/v1/health
```

**Lưu ý:** API này chỉ trả về basic health, KHÔNG có stats chi tiết.

### Cách 3: Check thư mục
```bash
dir "d:\BYun\File Visual Studio Code\LMS-B\python-ai\chroma_db"
```
Có file → Đã index

---

## ➕ THÊM Q&A MỚI

### Bước 1: Mở file
```bash
code "d:\BYun\File Visual Studio Code\LMS-B\python-ai\datasets\training_data.py"
```

### Bước 2: Thêm vào cuối mảng TRAINING_DATA
```python
TRAINING_DATA = [
    # ... 47 items hiện tại ...
    
    # THÊM MỚI DƯỚI ĐÂY
    {
        "question": "Câu hỏi của bạn?",
        "answer": "Câu trả lời chi tiết (150-200 từ max)...",
        "category": "learning_path",  # hoặc: course_content, platform_guide, enrollment, payment
        "tags": ["tag1", "tag2"]
    },
]
```

### Bước 3: Lưu file (Ctrl + S)

---

## 🔄 INDEX DATASET

### Cách A: Chỉ thêm mới (KHÔNG sửa/xóa cũ)
```bash
cd "d:\BYun\File Visual Studio Code\LMS-B\python-ai"
python scripts\load_training_data.py
```

### Cách B: Reset và index lại (KHUYẾN NGHỊ)
```bash
cd "d:\BYun\File Visual Studio Code\LMS-B\python-ai"
python scripts\load_training_data.py --reset
```

**Lưu ý:** `--reset` xóa HẾT dữ liệu cũ (kể cả courses)

### Nếu có courses từ MongoDB, index lại:
```bash
python scripts\index_courses.py
```

---

## 🧪 TEST SAU KHI INDEX

```bash
curl -X POST http://localhost:8001/api/v1/chat/ask ^
  -H "Content-Type: application/json" ^
  -d "{\"question\": \"Câu hỏi vừa thêm\"}"
```

**Kết quả mong đợi:**
- ✅ Có `answer` chính xác
- ✅ Có `sources` kèm theo
- ✅ `confidence: true`

---

## 📊 CHECK THỐNG KÊ

```bash
cd "d:\BYun\File Visual Studio Code\LMS-B\python-ai"
python datasets\training_data.py
```

Output:
```
Total training samples: 47
Breakdown by category:
  learning_path: 11
  course_content: 15
  ...
```

---

## 🎯 WORKFLOW HOÀN CHỈNH

```
1. Thêm Q&A vào training_data.py
   ↓
2. python scripts\load_training_data.py --reset
   ↓
3. python scripts\index_courses.py (nếu có courses)
   ↓
4. curl http://localhost:8001/api/v1/health (check)
   ↓
5. Test câu hỏi mới
   ↓
✅ DONE!
```

---

## ⚠️ LƯU Ý

### DOs ✅
- Thêm Q&A cho câu hỏi phổ biến
- Answer ngắn gọn (150-200 từ)
- Category rõ ràng
- Luôn index sau khi sửa file

### DON'Ts ❌
- Không quên index sau khi thêm
- Không để answer quá dài
- Không hardcode thông tin cũ (giá, ngày tháng)
- Không duplicate Q&A

---

## 🔧 TROUBLESHOOTING

### Thêm rồi nhưng chatbot không trả lời
```bash
# 1. Index lại
python scripts\load_training_data.py --reset

# 2. Restart AI service
python main.py

# 3. Test lại
```

### ChromaDB lỗi
```bash
# Xóa và rebuild
rmdir /s chroma_db
python scripts\load_training_data.py --reset
```

---

## 📝 CATEGORIES

- `learning_path`: Lộ trình học
- `course_content`: Nội dung khóa học
- `platform_guide`: Hướng dẫn platform
- `enrollment`: Đăng ký, chứng chỉ
- `payment`: Thanh toán, giá

---

**Cập nhật:** 01/01/2026
