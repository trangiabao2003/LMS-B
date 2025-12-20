"""Fallback responses when LLM fails or times out"""

from typing import Optional

# Common fallback responses based on question keywords
FALLBACK_RESPONSES = {
    "frontend": """Để học Frontend, bạn nên theo lộ trình:
1. HTML/CSS Basics
2. JavaScript Fundamentals
3. React.js
4. Next.js hoặc Vue.js

Chúng tôi có đầy đủ các khóa học này. Hãy xem thêm tại trang Courses hoặc liên hệ support để được tư vấn chi tiết hơn.""",
    
    "backend": """Lộ trình học Backend được đề xuất:
1. JavaScript/Node.js cơ bản
2. Express.js
3. Databases (MongoDB/PostgreSQL)
4. RESTful APIs
5. Authentication & Security

Bạn có thể tìm các khóa học này trong danh sách khóa học của chúng tôi.""",
    
    "fullstack": """Khóa học Full Stack bao gồm cả Frontend và Backend:
- Frontend: React, Next.js, TypeScript
- Backend: Node.js, Express, MongoDB
- DevOps: Git, Docker, Deployment

Đây là lộ trình hoàn chỉnh từ người mới bắt đầu đến advanced.""",
    
    "price": """Giá khóa học thay đổi từ 99,000đ - 999,000đ tùy theo nội dung và độ phức tạp.
Chúng tôi thường có các chương trình khuyến mãi. Hãy kiểm tra trang khóa học để xem giá hiện tại.
Chúng tôi cũng có chính sách hoàn tiền trong 30 ngày nếu không hài lòng.""",
    
    "certificate": """Có! Khi hoàn thành khóa học, bạn sẽ nhận được chứng chỉ hoàn thành.
Chứng chỉ này được công nhận và có thể dùng để chứng minh kỹ năng của bạn.""",
    
    "support": """Bạn có thể liên hệ hỗ trợ qua:
📧 Email: support@lmsb.com
💬 Chat: Sử dụng chat widget trên website
⏰ Thời gian: 24/7

Chúng tôi luôn sẵn sàng hỗ trợ bạn!""",
    
    "refund": """Có, chúng tôi có chính sách hoàn tiền 30 ngày.
Nếu bạn không hài lòng với khóa học trong 30 ngày đầu, bạn có thể yêu cầu hoàn lại 100% tiền.
Không cần câu hỏi hay điều kiện gì."""
}

def get_fallback_response(question: str, error_type: str = "timeout") -> dict:
    """
    Get fallback response when LLM fails
    
    Args:
        question: User's question
        error_type: Type of error (timeout, no_context, error)
    
    Returns:
        dict with answer and metadata
    """
    question_lower = question.lower()
    
    # Try to find matching fallback based on keywords
    for keyword, response in FALLBACK_RESPONSES.items():
        if keyword in question_lower:
            return {
                "answer": response,
                "sources": [],
                "confidence": False,
                "fallback": True,
                "fallback_reason": error_type
            }
    
    # Generic fallback if no keyword match
    generic_response = """Xin lỗi, tôi đang gặp chút vấn đề kỹ thuật và không thể trả lời câu hỏi của bạn ngay bây giờ.

Bạn có thể:
1. Thử lại sau vài giây
2. Liên hệ support qua email: support@lmsb.com
3. Xem thêm thông tin tại trang Courses hoặc FAQ

Chúng tôi xin lỗi vì sự bất tiện này!"""
    
    return {
        "answer": generic_response,
        "sources": [],
        "confidence": False,
        "fallback": True,
        "fallback_reason": error_type
    }

def should_use_fallback(query_time: float, timeout: float = 10.0) -> bool:
    """Check if we should use fallback based on query time"""
    return query_time >= timeout
