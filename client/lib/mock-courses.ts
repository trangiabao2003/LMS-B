export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  image: string
  price: number
  rating: number
  students: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  lessons: number
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
    instructor: "Sarah Johnson",
    image: "/web-development-course.png",
    price: 49.99,
    rating: 4.8,
    students: 15420,
    duration: "8 weeks",
    level: "Beginner",
    category: "Web Development",
    lessons: 42,
  },
  {
    id: "2",
    title: "React Advanced Patterns",
    description: "Master advanced React patterns including hooks, context, and performance optimization.",
    instructor: "Mike Chen",
    image: "/react-programming.png",
    price: 79.99,
    rating: 4.9,
    students: 8932,
    duration: "6 weeks",
    level: "Advanced",
    category: "Web Development",
    lessons: 38,
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and user experience design.",
    instructor: "Emma Davis",
    image: "/ui-ux-design-concept.png",
    price: 59.99,
    rating: 4.7,
    students: 12105,
    duration: "7 weeks",
    level: "Beginner",
    category: "Design",
    lessons: 35,
  },
  {
    id: "4",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js and Express.",
    instructor: "Alex Rodriguez",
    image: "/nodejs-backend.png",
    price: 69.99,
    rating: 4.6,
    students: 9847,
    duration: "8 weeks",
    level: "Intermediate",
    category: "Web Development",
    lessons: 45,
  },
  {
    id: "5",
    title: "TypeScript Mastery",
    description: "Deep dive into TypeScript and learn how to write type-safe JavaScript applications.",
    instructor: "Lisa Wang",
    image: "/typescript-programming.png",
    price: 54.99,
    rating: 4.8,
    students: 11203,
    duration: "5 weeks",
    level: "Intermediate",
    category: "Web Development",
    lessons: 32,
  },
  {
    id: "6",
    title: "Mobile App Development with React Native",
    description: "Create cross-platform mobile applications using React Native.",
    instructor: "James Wilson",
    image: "/react-native-mobile.png",
    price: 89.99,
    rating: 4.7,
    students: 7654,
    duration: "10 weeks",
    level: "Advanced",
    category: "Mobile Development",
    lessons: 52,
  },
  {
    id: "7",
    title: "CSS Grid & Flexbox Mastery",
    description: "Master modern CSS layout techniques with Grid and Flexbox.",
    instructor: "Rachel Green",
    image: "/css-layout-design.jpg",
    price: 39.99,
    rating: 4.9,
    students: 18932,
    duration: "4 weeks",
    level: "Beginner",
    category: "Web Development",
    lessons: 28,
  },
  {
    id: "8",
    title: "Database Design & SQL",
    description: "Learn database design principles and master SQL for data management.",
    instructor: "David Kumar",
    image: "/database-sql.jpg",
    price: 64.99,
    rating: 4.6,
    students: 10234,
    duration: "7 weeks",
    level: "Intermediate",
    category: "Backend",
    lessons: 40,
  },
]
