"""
Setup and verification script for AI service
Checks all dependencies and configurations
"""

import sys
import os
import subprocess

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def print_check(name, status, message=""):
    icon = "✅" if status else "❌"
    print(f"{icon} {name:<30} {message}")
    return status

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    is_ok = version.major == 3 and version.minor >= 9
    msg = f"Python {version.major}.{version.minor}.{version.micro}"
    return print_check("Python Version", is_ok, msg)

def check_pip_packages():
    """Check if required packages are installed"""
    required_packages = [
        "fastapi",
        "uvicorn",
        "langchain",
        "chromadb",
        "sentence_transformers",
        "pymongo",
        "redis"
    ]
    
    try:
        import pkg_resources
        installed = {pkg.key for pkg in pkg_resources.working_set}
        missing = []
        
        for package in required_packages:
            if package.lower() not in installed:
                missing.append(package)
        
        if missing:
            print_check("Python Packages", False, f"Missing: {', '.join(missing)}")
            print(f"   💡 Run: pip install -r requirements.txt")
            return False
        else:
            print_check("Python Packages", True, f"All {len(required_packages)} packages installed")
            return True
    except Exception as e:
        print_check("Python Packages", False, str(e))
        return False

def check_ollama():
    """Check if Ollama is running"""
    try:
        import requests
        response = requests.get("http://localhost:11434/api/tags", timeout=2)
        if response.status_code == 200:
            models = response.json().get("models", [])
            model_names = [m.get("name", "") for m in models]
            
            has_mistral = any("mistral" in name for name in model_names)
            
            if has_mistral:
                print_check("Ollama + Mistral", True, "Running with Mistral model")
                return True
            else:
                print_check("Ollama", True, "Running but no Mistral model")
                print(f"   💡 Run: ollama pull mistral")
                return False
        else:
            print_check("Ollama", False, "Not responding")
            return False
    except Exception as e:
        print_check("Ollama", False, "Not running")
        print(f"   💡 Start it: ollama serve")
        return False

def check_mongodb():
    """Check MongoDB connection"""
    try:
        from pymongo import MongoClient
        from dotenv import load_dotenv
        load_dotenv()
        
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/lms-b")
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        client.server_info()
        
        # Count courses
        db_name = mongo_uri.split("/")[-1]
        db = client[db_name]
        course_count = db.courses.count_documents({})
        
        print_check("MongoDB", True, f"Connected ({course_count} courses)")
        return True
    except Exception as e:
        print_check("MongoDB", False, "Not connected")
        print(f"   💡 Start it: mongod")
        return False

def check_redis():
    """Check Redis connection"""
    try:
        import redis
        from dotenv import load_dotenv
        load_dotenv()
        
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        r = redis.from_url(redis_url, socket_connect_timeout=2)
        r.ping()
        print_check("Redis", True, "Connected")
        return True
    except Exception as e:
        print_check("Redis", False, "Not connected")
        print(f"   💡 Start it: redis-server")
        return False

def check_chromadb():
    """Check ChromaDB setup"""
    try:
        import chromadb
        from dotenv import load_dotenv
        load_dotenv()
        
        persist_dir = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
        
        if not os.path.exists(persist_dir):
            os.makedirs(persist_dir)
            print_check("ChromaDB", True, "Directory created")
        else:
            # Try to open it
            client = chromadb.PersistentClient(path=persist_dir)
            collections = client.list_collections()
            print_check("ChromaDB", True, f"{len(collections)} collection(s)")
        return True
    except Exception as e:
        print_check("ChromaDB", False, str(e))
        return False

def check_env_file():
    """Check .env file"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    
    if os.path.exists(env_path):
        print_check(".env file", True, "Found")
        return True
    else:
        print_check(".env file", False, "Not found")
        print(f"   💡 Create .env file with required variables")
        return False

def main():
    """Main setup check"""
    print_header("🚀 LMS-B AI Service Setup Check")
    
    results = {}
    
    # Core checks
    print("\n📦 Core Dependencies:")
    results['python'] = check_python_version()
    results['packages'] = check_pip_packages()
    results['env'] = check_env_file()
    
    # Service checks
    print("\n🔧 Services:")
    results['ollama'] = check_ollama()
    results['mongodb'] = check_mongodb()
    results['redis'] = check_redis()
    results['chromadb'] = check_chromadb()
    
    # Summary
    print_header("📊 Summary")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    print(f"\nPassed: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 All checks passed! You're ready to run the AI service!")
        print("\n💡 Next steps:")
        print("   1. Run: python main.py")
        print("   2. Visit: http://localhost:8001/docs")
        print("   3. Index courses: python scripts/index_courses.py")
    else:
        print("\n⚠️  Some checks failed. Please fix the issues above.")
        print("\n💡 Quick fixes:")
        print("   - Install packages: pip install -r requirements.txt")
        print("   - Start Ollama: ollama serve")
        print("   - Pull model: ollama pull mistral")
        print("   - Start MongoDB: mongod")
        print("   - Start Redis: redis-server")
    
    print("\n" + "="*60)
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
