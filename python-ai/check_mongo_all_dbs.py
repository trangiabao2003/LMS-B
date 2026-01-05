import sys
import os
from pymongo import MongoClient

# Thêm đường dẫn để import config
sys.path.insert(0, r"d:\BYun\File Visual Studio Code\LMS-B\python-ai")
from app.config import config

def check_all_dbs():
    try:
        # Sử dụng URI mặc định nếu không lấy được từ env
        uri = config.MONGODB_URI or "mongodb://localhost:27017"
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        
        print(f"--- Đang kiểm tra server MongoDB: {uri} ---")
        
        # Liệt kê tất cả các DB
        dbs = client.list_database_names()
        print(f"Các database hiện có: {dbs}")
        
        for db_name in dbs:
            if db_name in ['admin', 'local', 'config']:
                continue
            
            db = client[db_name]
            collections = db.list_collection_names()
            print(f"\n[DB: {db_name}] Các collections: {collections}")
            
            for coll_name in collections:
                if 'chat' in coll_name.lower() or 'history' in coll_name.lower():
                    count = db[coll_name].count_documents({})
                    print(f"  -> Collection '{coll_name}': {count} bản ghi")
                    
                    if count > 0:
                        recent = list(db[coll_name].find().sort("createdAt", -1).limit(1))
                        print(f"     Bản ghi mới nhất: {recent[0].get('sessionId', 'N/A')}")

    except Exception as e:
        print(f"❌ Lỗi: {str(e)}")

if __name__ == "__main__":
    check_all_dbs()
