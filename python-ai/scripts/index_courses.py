"""
Script to index all courses from MongoDB into ChromaDB
Run this script after setting up the AI service
"""

import sys
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.vector_store_service import get_vector_store
from app.config import config
from app.utils.logger import get_logger

logger = get_logger(__name__)

def connect_mongodb():
    """Connect to MongoDB"""
    try:
        client = MongoClient(config.MONGODB_URI)
        db = client[config.MONGODB_DB]
        logger.info(f"✅ Connected to MongoDB: {config.MONGODB_DB}")
        return db
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {str(e)}")
        return None

def fetch_courses(db):
    """Fetch all courses from MongoDB"""
    try:
        courses = list(db.courses.find({}))
        logger.info(f"📚 Found {len(courses)} courses")
        return courses
    except Exception as e:
        logger.error(f"❌ Failed to fetch courses: {str(e)}")
        return []

def index_course(vector_store, course):
    """Index a single course into vector store"""
    try:
        course_id = str(course.get("_id", "unknown"))
        name = course.get("name", "")
        description = course.get("description", "")
        category = course.get("category", "Unknown")
        
        # Create documents for different parts of the course
        documents = []
        
        # 1. Course overview
        overview_content = f"""
Khóa học: {name}
Mô tả: {description}
Danh mục: {category}
        """.strip()
        
        documents.append({
            "course_id": course_id,
            "content": overview_content,
            "category": category,
            "type": "overview"
        })
        
        # 2. Course benefits (if exists)
        if "benefits" in course and isinstance(course["benefits"], list):
            benefits_text = "Lợi ích của khóa học: " + ", ".join([
                b.get("title", "") for b in course["benefits"]
            ])
            documents.append({
                "course_id": course_id,
                "content": benefits_text,
                "category": category,
                "type": "benefits"
            })
        
        # 3. Course prerequisites (if exists)
        if "prerequisites" in course and isinstance(course["prerequisites"], list):
            prereq_text = "Yêu cầu trước khóa học: " + ", ".join([
                p.get("title", "") for p in course["prerequisites"]
            ])
            documents.append({
                "course_id": course_id,
                "content": prereq_text,
                "category": category,
                "type": "prerequisites"
            })
        
        # 4. Course data (detailed content)
        if "courseData" in course and isinstance(course["courseData"], list):
            for idx, section in enumerate(course["courseData"]):
                section_title = section.get("videoTitle", f"Section {idx + 1}")
                section_desc = section.get("description", "")
                
                section_content = f"""
Section: {section_title}
Content: {section_desc}
Khóa học: {name}
                """.strip()
                
                documents.append({
                    "course_id": course_id,
                    "content": section_content,
                    "category": category,
                    "type": f"section_{idx}"
                })
        
        # Add documents to vector store
        if documents:
            vector_store.add_documents_batch(documents)
            logger.info(f"✅ Indexed course '{name}' with {len(documents)} documents")
            return True
        else:
            logger.warning(f"⚠️ No content to index for course '{name}'")
            return False
            
    except Exception as e:
        logger.error(f"❌ Failed to index course: {str(e)}")
        return False

def main():
    """Main function"""
    logger.info("="*60)
    logger.info("🚀 Starting course indexing process")
    logger.info("="*60)
    
    # Connect to MongoDB
    db = connect_mongodb()
    if db is None:
        logger.error("❌ Cannot proceed without MongoDB connection")
        return
    
    # Fetch courses
    courses = fetch_courses(db)
    if not courses:
        logger.warning("⚠️ No courses found to index")
        return
    
    # Initialize vector store
    try:
        vector_store = get_vector_store()
        logger.info(f"✅ Vector store initialized")
    except Exception as e:
        logger.error(f"❌ Vector store initialization failed: {str(e)}")
        return
    
    # Index each course
    successful = 0
    failed = 0
    
    for idx, course in enumerate(courses, 1):
        logger.info(f"\n[{idx}/{len(courses)}] Processing: {course.get('name', 'Unknown')}")
        
        if index_course(vector_store, course):
            successful += 1
        else:
            failed += 1
    
    # Summary
    logger.info("\n" + "="*60)
    logger.info("📊 INDEXING SUMMARY")
    logger.info("="*60)
    logger.info(f"✅ Successful: {successful}")
    logger.info(f"❌ Failed: {failed}")
    logger.info(f"📚 Total: {len(courses)}")
    
    # Show vector store stats
    stats = vector_store.get_collection_stats()
    logger.info(f"\n📈 Vector Store Stats:")
    logger.info(f"   Total documents: {stats.get('total_documents', 0)}")
    logger.info(f"   Collection: {stats.get('collection_name', 'unknown')}")
    logger.info("="*60)
    
    logger.info("🎉 Indexing completed!")

if __name__ == "__main__":
    load_dotenv()
    main()
