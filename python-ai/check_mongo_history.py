import sys
import os
from pymongo import MongoClient
import json

# Thêm đường dẫn để import config
sys.path.insert(0, r"d:\BYun\File Visual Studio Code\LMS-B\python-ai")
from app.config import config

def check_mongo():
    try:
        client = MongoClient(config.MONGODB_URI)
        db = client.get_default_database()
        collection = db.chathistories
        
        print(f"--- Kết nối MongoDB: {config.MONGODB_URI} ---")
        
        # Tìm 3 bản ghi mới nhất
        recent_chats = list(collection.find().sort("createdAt", -1).limit(3))
        
        if not recent_chats:
            print("❌ Không tìm thấy lịch sử chat nào trong MongoDB.")
            return

        print(f"✅ Tìm thấy {len(recent_chats)} bản ghi chat gần đây:")
        for chat in recent_chats:
            print(f"\nID: {chat['_id']}")
            print(f"User: {chat['userId']}")
            print(f"Session: {chat['sessionId']}")
            print(f"Số tin nhắn: {len(chat['messages'])}")
            if chat['messages']:
                last_msg = chat['messages'][-1]
                print(f"Tin nhắn cuối ({last_msg['role']}): {last_msg['content'][:50]}...")

    except Exception as e:
        print(f"❌ Lỗi khi kiểm tra MongoDB: {str(e)}")

if __name__ == "__main__":
    check_mongo()
