# Sample training data for the AI
# This can be expanded with real course data from MongoDB

TRAINING_DATA = [
    # Learning Paths - Frontend
    {
        "question": "Tôi muốn học Frontend, nên bắt đầu từ đâu?",
        "answer": "Để học Frontend, bạn nên theo lộ trình: HTML/CSS Basics → JavaScript Fundamentals → React Basics → Advanced React → Next.js. Chúng tôi có các khóa học cho mỗi bước này.",
        "category": "learning_path",
        "tags": ["frontend", "learning_path"]
    },
    {
        "question": "HTML/CSS có khó học không?",
        "answer": "HTML/CSS là nền tảng của web development và khá dễ học cho người mới bắt đầu. HTML xử lý cấu trúc, CSS xử lý giao diện. Bạn có thể học thành thạo trong 2-4 tuần với khóa học của chúng tôi.",
        "category": "learning_path",
        "tags": ["frontend", "html", "css", "beginner"]
    },
    {
        "question": "JavaScript có khó không?",
        "answer": "JavaScript là ngôn ngữ lập trình nên sẽ có độ khó hơn HTML/CSS, nhưng với lộ trình học đúng đắn, bạn hoàn toàn có thể nắm vững. Khóa học JavaScript Fundamentals của chúng tôi được thiết kế cho người mới bắt đầu.",
        "category": "learning_path",
        "tags": ["javascript", "beginner"]
    },
    {
        "question": "React khác gì JavaScript?",
        "answer": "React là một thư viện JavaScript để xây dựng giao diện người dùng. Bạn cần biết JavaScript trước khi học React. React giúp bạn xây dựng ứng dụng web phức tạp dễ dàng và hiệu quả hơn.",
        "category": "course_content",
        "tags": ["react", "javascript", "frontend"]
    },
    {
        "question": "Khóa học React của bạn dạy những gì?",
        "answer": "Khóa học React của chúng tôi bao gồm: React Fundamentals, Hooks, State Management, Component Lifecycle, Context API, và Real-world Projects. Thích hợp cho những ai đã biết JavaScript cơ bản.",
        "category": "course_content",
        "tags": ["react", "frontend"]
    },
    {
        "question": "Next.js là gì?",
        "answer": "Next.js là framework React mạnh mẽ cho production, hỗ trợ Server-Side Rendering (SSR), Static Site Generation (SSG), và nhiều tính năng khác. Bạn nên học React trước khi học Next.js.",
        "category": "course_content",
        "tags": ["nextjs", "react", "frontend"]
    },
    {
        "question": "TypeScript có cần thiết không?",
        "answer": "TypeScript giúp code JavaScript của bạn an toàn và dễ maintain hơn. Mặc dù không bắt buộc, TypeScript rất được ưa chuộng trong các dự án lớn. Chúng tôi dạy TypeScript trong khóa Advanced Frontend.",
        "category": "course_content",
        "tags": ["typescript", "javascript", "frontend"]
    },
    
    # Learning Paths - Backend
    {
        "question": "Tôi muốn học Backend, bắt đầu như thế nào?",
        "answer": "Lộ trình Backend: JavaScript/Node.js → Express.js → Databases (MongoDB/SQL) → RESTful APIs → Advanced Patterns. Chúng tôi cung cấp tất cả các khóa học này.",
        "category": "learning_path",
        "tags": ["backend", "learning_path"]
    },
    {
        "question": "Node.js là gì?",
        "answer": "Node.js là runtime environment cho phép chạy JavaScript ở phía server. Nó rất phổ biến cho backend development vì hiệu suất cao và cộng đồng lớn. Khóa học Node.js của chúng tôi dạy từ cơ bản đến nâng cao.",
        "category": "course_content",
        "tags": ["nodejs", "backend", "javascript"]
    },
    {
        "question": "Express.js khó học không?",
        "answer": "Express.js là framework Node.js đơn giản và dễ học. Nếu bạn đã biết JavaScript và Node.js cơ bản, bạn có thể học Express trong 1-2 tuần.",
        "category": "learning_path",
        "tags": ["express", "nodejs", "backend"]
    },
    {
        "question": "MongoDB hay SQL nên học cái nào?",
        "answer": "MongoDB (NoSQL) dễ bắt đầu và linh hoạt, phù hợp cho dự án startup. SQL (PostgreSQL/MySQL) cần cấu trúc rõ ràng, phù hợp cho dữ liệu phức tạp. Chúng tôi khuyên học cả hai, bắt đầu với MongoDB.",
        "category": "learning_path",
        "tags": ["database", "mongodb", "sql", "backend"]
    },
    {
        "question": "RESTful API là gì?",
        "answer": "RESTful API là cách thiết kế API theo chuẩn REST, sử dụng HTTP methods (GET, POST, PUT, DELETE). Đây là kiến thức cốt lõi cho backend developer. Khóa học Backend của chúng tôi có chuyên mục về RESTful API.",
        "category": "course_content",
        "tags": ["api", "backend", "rest"]
    },
    
    # Full Stack
    {
        "question": "Có khóa học Full Stack không?",
        "answer": "Có! Khóa học Full Stack của chúng tôi bao gồm cả Frontend (React, Next.js) và Backend (Node.js, Express, MongoDB). Đây là khóa học toàn diện từ 0->1.",
        "category": "course_content",
        "tags": ["fullstack"]
    },
    {
        "question": "Full Stack developer làm gì?",
        "answer": "Full Stack developer có thể làm việc với cả Frontend (giao diện người dùng) và Backend (server, database, API). Họ có khả năng xây dựng ứng dụng web hoàn chỉnh từ đầu đến cuối.",
        "category": "learning_path",
        "tags": ["fullstack"]
    },
    {
        "question": "Học Full Stack mất bao lâu?",
        "answer": "Với lộ trình của chúng tôi, bạn có thể trở thành Full Stack developer trong 6-12 tháng tùy vào thời gian học. Khóa học Full Stack bao gồm tất cả kiến thức cần thiết và dự án thực tế.",
        "category": "learning_path",
        "tags": ["fullstack", "timeline"]
    },
    
    # Beginner Questions
    {
        "question": "Tôi không có kinh nghiệm lập trình, có học được không?",
        "answer": "Hoàn toàn có thể! Chúng tôi có các khóa học từ cơ bản nhất (HTML/CSS, JavaScript Basics). Bạn có thể bắt đầu từ 'Web Development Basics' khóa học của chúng tôi.",
        "category": "learning_path",
        "tags": ["beginner", "basics"]
    },
    {
        "question": "Tôi cần máy tính cấu hình cao để học lập trình không?",
        "answer": "Không cần! Máy tính cơ bản (4GB RAM, i3 trở lên) là đủ để học web development. Để chạy các công cụ nặng hơn, 8GB RAM sẽ tốt hơn.",
        "category": "platform_guide",
        "tags": ["beginner", "setup"]
    },
    {
        "question": "Học online có hiệu quả không?",
        "answer": "Có! Học online cho phép bạn học theo tốc độ của mình, xem lại bài giảng nhiều lần. Khóa học của chúng tôi có video, bài tập thực hành, và support community để đảm bảo bạn học hiệu quả.",
        "category": "platform_guide",
        "tags": ["online", "learning"]
    },
    {
        "question": "Có cần học tiếng Anh để lập trình không?",
        "answer": "Tiếng Anh cơ bản sẽ giúp ích rất nhiều vì tài liệu lập trình chủ yếu bằng tiếng Anh. Tuy nhiên, khóa học của chúng tôi được giảng bằng tiếng Việt, phù hợp cho người mới bắt đầu.",
        "category": "learning_path",
        "tags": ["beginner", "language"]
    },
    {
        "question": "Tôi nên học ngôn ngữ lập trình nào trước?",
        "answer": "Cho web development, JavaScript là lựa chọn tốt nhất vì có thể dùng cho cả Frontend và Backend. Bạn nên bắt đầu với HTML/CSS, sau đó học JavaScript.",
        "category": "learning_path",
        "tags": ["beginner", "programming"]
    },
    
    # Platform & Support
    {
        "question": "Làm thế nào để liên hệ với hỗ trợ?",
        "answer": "Bạn có thể liên hệ support qua email support@lmsb.com hoặc sử dụng chat support trên trang web. Chúng tôi hỗ trợ 24/7.",
        "category": "platform_guide",
        "tags": ["support", "contact"]
    },
    {
        "question": "Tôi quên mật khẩu, phải làm sao?",
        "answer": "Bạn có thể reset mật khẩu bằng cách click 'Forgot Password' ở trang login, nhập email và làm theo hướng dẫn. Nếu gặp vấn đề, liên hệ support@lmsb.com.",
        "category": "platform_guide",
        "tags": ["account", "password"]
    },
    {
        "question": "Làm sao để cập nhật thông tin cá nhân?",
        "answer": "Đăng nhập vào tài khoản, vào phần 'Profile' hoặc 'Account Settings', bạn có thể cập nhật tên, email, ảnh đại diện và các thông tin khác.",
        "category": "platform_guide",
        "tags": ["account", "profile"]
    },
    {
        "question": "Tôi có thể học trên mobile không?",
        "answer": "Có! Nền tảng của chúng tôi responsive và hoạt động tốt trên mobile. Bạn có thể xem video, làm bài tập trên điện thoại hoặc tablet.",
        "category": "platform_guide",
        "tags": ["mobile", "access"]
    },
    
    # Certificates & Completion
    {
        "question": "Khóa học có chứng chỉ không?",
        "answer": "Có! Khi hoàn thành khóa học, bạn sẽ nhận được chứng chỉ hoàn thành. Chứng chỉ này được công nhận trong ngành công nghiệp.",
        "category": "enrollment",
        "tags": ["certificate", "completion"]
    },
    {
        "question": "Chứng chỉ có giá trị không?",
        "answer": "Chứng chỉ của chúng tôi xác nhận bạn đã hoàn thành khóa học và nắm vững kiến thức. Nhiều nhà tuyển dụng đánh giá cao các chứng chỉ từ nền tảng học online uy tín.",
        "category": "enrollment",
        "tags": ["certificate", "value"]
    },
    {
        "question": "Làm thế nào để hoàn thành khóa học?",
        "answer": "Bạn cần xem hết tất cả video bài giảng, hoàn thành các bài tập và pass bài kiểm tra cuối khóa (nếu có) để nhận chứng chỉ.",
        "category": "enrollment",
        "tags": ["completion", "requirements"]
    },
    {
        "question": "Có giới hạn thời gian học không?",
        "answer": "Không! Sau khi mua khóa học, bạn có quyền truy cập vĩnh viễn. Bạn có thể học theo tốc độ của mình và xem lại bất cứ lúc nào.",
        "category": "enrollment",
        "tags": ["access", "lifetime"]
    },
    
    # Payment & Pricing
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
        "question": "Chấp nhận hình thức thanh toán nào?",
        "answer": "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ, ví điện tử (Momo, ZaloPay), và chuyển khoản ngân hàng.",
        "category": "payment",
        "tags": ["payment", "methods"]
    },
    {
        "question": "Có thể trả góp không?",
        "answer": "Hiện tại chúng tôi chưa hỗ trợ trả góp. Tuy nhiên, chúng tôi thường có các chương trình giảm giá để khóa học trở nên phải chăng hơn.",
        "category": "payment",
        "tags": ["payment", "installment"]
    },
    {
        "question": "Tôi đã mua khóa học, làm sao để truy cập?",
        "answer": "Sau khi thanh toán, bạn có thể truy cập khóa học ngay lập tức qua phần 'My Courses' trong tài khoản của bạn.",
        "category": "platform_guide",
        "tags": ["access", "course"]
    },
    {
        "question": "Có thể mua nhiều khóa học cùng lúc không?",
        "answer": "Có! Bạn có thể thêm nhiều khóa học vào giỏ hàng và thanh toán một lần. Đôi khi mua bundle còn được giảm giá thêm.",
        "category": "payment",
        "tags": ["purchase", "bundle"]
    },
    {
        "question": "Có giảm giá cho sinh viên không?",
        "answer": "Có! Chúng tôi có chương trình giảm giá cho sinh viên. Vui lòng liên hệ support@lmsb.com với thẻ sinh viên để được hỗ trợ.",
        "category": "payment",
        "tags": ["discount", "student"]
    },
    
    # Career & Jobs
    {
        "question": "Sau khi học xong có tìm được việc không?",
        "answer": "Khóa học của chúng tôi trang bị kiến thức và kỹ năng thực tế cần thiết cho công việc. Nhiều học viên của chúng tôi đã tìm được việc sau khi hoàn thành khóa học.",
        "category": "enrollment",
        "tags": ["career", "job"]
    },
    {
        "question": "Có hỗ trợ tìm việc không?",
        "answer": "Chúng tôi cung cấp hướng dẫn viết CV, chuẩn bị phỏng vấn và chia sẻ cơ hội việc làm trong community. Support team luôn sẵn sàng tư vấn career path.",
        "category": "enrollment",
        "tags": ["career", "support"]
    },
    {
        "question": "Lương developer như thế nào?",
        "answer": "Junior developer thường có mức lương 8-15 triệu, Mid-level 15-30 triệu, Senior 30-60+ triệu VNĐ. Tùy vào kỹ năng, kinh nghiệm và công ty.",
        "category": "learning_path",
        "tags": ["career", "salary"]
    },
    {
        "question": "Có cần bằng cấp để làm developer không?",
        "answer": "Không bắt buộc! Nhiều developer thành công không có bằng IT. Quan trọng là kỹ năng thực tế, portfolio projects, và khả năng giải quyết vấn đề.",
        "category": "learning_path",
        "tags": ["career", "degree"]
    },
    
    # Projects & Practice
    {
        "question": "Khóa học có dự án thực tế không?",
        "answer": "Có! Mỗi khóa học đều bao gồm các dự án thực tế để bạn áp dụng kiến thức đã học. Bạn sẽ xây dựng portfolio projects để showcase cho nhà tuyển dụng.",
        "category": "course_content",
        "tags": ["project", "practice"]
    },
    {
        "question": "Tôi có thể download source code không?",
        "answer": "Có! Tất cả source code của dự án trong khóa học đều có thể download. Bạn có thể tham khảo và customize cho dự án của mình.",
        "category": "course_content",
        "tags": ["code", "resource"]
    },
    {
        "question": "Có bài tập để practice không?",
        "answer": "Có rất nhiều! Mỗi module có bài tập thực hành, challenges, và quizzes để củng cố kiến thức. Learning by doing là phương pháp chính của chúng tôi.",
        "category": "course_content",
        "tags": ["practice", "exercise"]
    },
    
    # Advanced Topics
    {
        "question": "Có dạy về deployment không?",
        "answer": "Có! Khóa học Full Stack bao gồm cả deployment lên các platform như Vercel, Netlify, Heroku, và AWS. Bạn sẽ học cách deploy ứng dụng production-ready.",
        "category": "course_content",
        "tags": ["deployment", "devops"]
    },
    {
        "question": "Có dạy về Git/GitHub không?",
        "answer": "Có! Git và GitHub là công cụ thiết yếu cho developer. Chúng tôi dạy Git từ cơ bản đến nâng cao, bao gồm branching, merging, pull requests, và collaboration.",
        "category": "course_content",
        "tags": ["git", "github", "tools"]
    },
    {
        "question": "Docker có cần học không?",
        "answer": "Docker rất hữu ích cho deployment và containerization. Chúng tôi giới thiệu Docker trong khóa Advanced Backend và DevOps Basics.",
        "category": "course_content",
        "tags": ["docker", "devops"]
    },
    {
        "question": "Có dạy về testing không?",
        "answer": "Có! Testing là kỹ năng quan trọng. Chúng tôi dạy Unit Testing, Integration Testing với Jest, React Testing Library, và best practices.",
        "category": "course_content",
        "tags": ["testing", "quality"]
    },
    {
        "question": "GraphQL có học không?",
        "answer": "Có! GraphQL là một phần của khóa Advanced Backend. Bạn sẽ học cách xây dựng GraphQL API với Apollo Server và integration với React.",
        "category": "course_content",
        "tags": ["graphql", "api", "backend"]
    }
]

# Export for training
if __name__ == "__main__":
    print(f"Total training samples: {len(TRAINING_DATA)}")
    
    # Count by category
    categories = {}
    for item in TRAINING_DATA:
        cat = item['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nBreakdown by category:")
    for cat, count in categories.items():
        print(f"  {cat}: {count}")
    
    print("\nSample questions:")
    for idx, item in enumerate(TRAINING_DATA[:5]):
        print(f"{idx+1}. {item['question']}")
