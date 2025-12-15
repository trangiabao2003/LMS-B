# Sample training data for the AI
# This can be expanded with real course data from MongoDB

TRAINING_DATA = [
    {
        "question": "Tôi muốn học Frontend, nên bắt đầu từ đâu?",
        "answer": "Để học Frontend, bạn nên theo lộ trình: HTML/CSS Basics → JavaScript Fundamentals → React Basics → Advanced React → Next.js. Chúng tôi có các khóa học cho mỗi bước này.",
        "category": "learning_path",
        "tags": ["frontend", "learning_path"]
    },
    {
        "question": "Khóa học React của bạn dạy những gì?",
        "answer": "Khóa học React của chúng tôi bao gồm: React Fundamentals, Hooks, State Management, Component Lifecycle, Context API, và Real-world Projects. Thích hợp cho những ai đã biết JavaScript cơ bản.",
        "category": "course_content",
        "tags": ["react", "frontend"]
    },
    {
        "question": "Tôi muốn học Backend, bắt đầu như thế nào?",
        "answer": "Lộ trình Backend: JavaScript/Node.js → Express.js → Databases (MongoDB/SQL) → RESTful APIs → Advanced Patterns. Chúng tôi cung cấp tất cả các khóa học này.",
        "category": "learning_path",
        "tags": ["backend", "learning_path"]
    },
    {
        "question": "Có khóa học Full Stack không?",
        "answer": "Có! Khóa học Full Stack của chúng tôi bao gồm cả Frontend (React, Next.js) và Backend (Node.js, Express, MongoDB). Đây là khóa học toàn diện từ 0->1.",
        "category": "course_content",
        "tags": ["fullstack"]
    },
    {
        "question": "Tôi không có kinh nghiệm lập trình, có học được không?",
        "answer": "Hoàn toàn có thể! Chúng tôi có các khóa học từ cơ bản nhất (HTML/CSS, JavaScript Basics). Bạn có thể bắt đầu từ 'Web Development Basics' khóa học của chúng tôi.",
        "category": "learning_path",
        "tags": ["beginner", "basics"]
    },
    {
        "question": "Làm thế nào để liên hệ với hỗ trợ?",
        "answer": "Bạn có thể liên hệ support qua email support@lmsb.com hoặc sử dụng chat support trên trang web. Chúng tôi hỗ trợ 24/7.",
        "category": "platform_guide",
        "tags": ["support", "contact"]
    },
    {
        "question": "Khóa học có chứng chỉ không?",
        "answer": "Có! Khi hoàn thành khóa học, bạn sẽ nhận được chứng chỉ hoàn thành. Chứng chỉ này được công nhận trong ngành công nghiệp.",
        "category": "enrollment",
        "tags": ["certificate", "completion"]
    },
    {
        "question": "Giá khóa học như thế nào?",
        "answer": "Giá khóa học thay đổi từ 99k - 999k VNĐ tùy theo nội dung. Chúng tôi thường có các chương trình khuyến mãi và giảm giá. Hãy kiểm tra trang khóa học để xem giá hiện tại.",
        "category": "payment",
        "tags": ["price", "payment"]
    },
    {
        "question": "Có hoàn lại tiền không?",
        "answer": "Có, chúng tôi cung cấp hoàn lại tiền 30 ngày nếu bạn không hài lòng với khóa học. Không cần câu hỏi hay điều kiện gì.",
        "category": "payment",
        "tags": ["refund", "guarantee"]
    },
    {
        "question": "Tôi đã mua khóa học, làm sao để truy cập?",
        "answer": "Sau khi thanh toán, bạn có thể truy cập khóa học ngay lập tức qua phần 'My Courses' trong tài khoản của bạn.",
        "category": "platform_guide",
        "tags": ["access", "course"]
    }
]

# Export for training
if __name__ == "__main__":
    print(f"Total training samples: {len(TRAINING_DATA)}")
    for idx, item in enumerate(TRAINING_DATA):
        print(f"{idx+1}. {item['question'][:50]}...")
