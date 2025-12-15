"""
Debug script to check MongoDB connection and collections
"""

from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# Connect to MongoDB
mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/lms-b")
print(f"🔗 Connecting to: {mongo_uri[:50]}...")

try:
    client = MongoClient(mongo_uri)
    
    # List all databases
    print("\n📚 Available databases:")
    for db_name in client.list_database_names():
        print(f"   - {db_name}")
    
    # Get database name from URI or use default
    if "mongodb.net/" in mongo_uri:
        # Extract from Atlas URI
        db_name = mongo_uri.split("mongodb.net/")[1].split("?")[0]
        if not db_name:
            db_name = "test"  # Default for Atlas
    else:
        db_name = mongo_uri.split("/")[-1]
    
    print(f"\n🎯 Using database: {db_name}")
    
    db = client[db_name]
    
    # List collections
    print(f"\n📦 Collections in '{db_name}':")
    collections = db.list_collection_names()
    for coll in collections:
        count = db[coll].count_documents({})
        print(f"   - {coll}: {count} documents")
    
    # Try different collection names
    print(f"\n🔍 Searching for course collections:")
    possible_names = ['courses', 'course', 'Course', 'Courses']
    for name in possible_names:
        if name in collections:
            count = db[name].count_documents({})
            print(f"   ✅ Found '{name}': {count} documents")
            
            # Show first document
            if count > 0:
                sample = db[name].find_one()
                print(f"\n📄 Sample document from '{name}':")
                print(f"   Fields: {list(sample.keys())}")
        else:
            print(f"   ❌ '{name}' not found")
    
    print("\n✅ MongoDB connection successful!")
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
