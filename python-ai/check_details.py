"""
Script to check detailed breakdown of documents in ChromaDB
Shows what types of documents are indexed
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.vector_store_service import get_vector_store

def main():
    print("=" * 60)
    print("🔍 DETAILED DOCUMENT BREAKDOWN")
    print("=" * 60)
    
    try:
        vector_store = get_vector_store()
        collection = vector_store.collection
        
        # Get all documents with metadata
        results = collection.get(
            include=['metadatas']
        )
        
        total = len(results['ids'])
        print(f"\n📊 Total Documents: {total}")
        
        # Group by course_id
        course_breakdown = {}
        type_breakdown = {}
        category_breakdown = {}
        
        for metadata in results['metadatas']:
            # By course_id
            course_id = metadata.get('course_id', 'unknown')
            course_breakdown[course_id] = course_breakdown.get(course_id, 0) + 1
            
            # By type
            doc_type = metadata.get('type', 'unknown')
            type_breakdown[doc_type] = type_breakdown.get(doc_type, 0) + 1
            
            # By category
            category = metadata.get('category', 'unknown')
            category_breakdown[category] = category_breakdown.get(category, 0) + 1
        
        # Display breakdown
        print("\n📚 By Course ID:")
        for course_id, count in sorted(course_breakdown.items(), key=lambda x: x[1], reverse=True):
            print(f"   {course_id}: {count} docs")
        
        print("\n📝 By Document Type:")
        for doc_type, count in sorted(type_breakdown.items(), key=lambda x: x[1], reverse=True):
            print(f"   {doc_type}: {count} docs")
        
        print("\n🏷️  By Category:")
        for category, count in sorted(category_breakdown.items(), key=lambda x: x[1], reverse=True):
            print(f"   {category}: {count} docs")
        
        # Analysis
        print("\n" + "=" * 60)
        print("💡 ANALYSIS:")
        print("=" * 60)
        
        training_count = course_breakdown.get('training_data', 0)
        faq_count = course_breakdown.get('faq', 0)
        other_count = total - training_count - faq_count
        
        print(f"\n✓ Training Q&A (from training_data.py): {training_count}")
        print(f"✓ FAQ items: {faq_count}")
        print(f"✓ Other documents (courses, etc): {other_count}")
        print(f"\nTotal: {training_count} + {faq_count} + {other_count} = {total}")
        
        if other_count > 0:
            print("\n💡 You have real courses indexed from MongoDB!")
        
        if training_count + faq_count > 47:
            print("\n⚠️  Possible duplicate! You may have run both:")
            print("   - load_training_data.py")
            print("   - index_training_data.py")
            print("\n   Solution: python scripts/load_training_data.py --reset")
        
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
