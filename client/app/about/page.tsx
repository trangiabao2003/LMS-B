"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { Heading } from "../utils/Heading"

export default function AboutPage() {
    const [open, setOpen] = useState(false)
    const [activeItem, setActiveItem] = useState(2)
    const [route, setRoute] = useState("Login")

    return (
        <main className="min-h-screen bg-background">
            <Heading
                title="About - LearnHub"
                description="Learn more about LearnHub and our mission to provide quality education"
                keywords="about, education, learning platform, online courses"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                route={route}
                setRoute={setRoute}
            />

            <div className="w-[95%] md:w-[90%] lg:w-[85%] m-auto min-h-[70vh] py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-foreground">
                        About LearnHub
                    </h1>

                    <div className="space-y-8 text-muted-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Mission</h2>
                            <p className="text-lg leading-relaxed">
                                LearnHub is dedicated to making quality education accessible to everyone, everywhere.
                                We believe that learning should be engaging, effective, and available to all who seek knowledge.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">What We Offer</h2>
                            <div className="space-y-4">
                                <div className="bg-card p-6 rounded-lg border border-border">
                                    <h3 className="text-xl font-semibold mb-2 text-foreground">Expert Instructors</h3>
                                    <p>Learn from industry professionals with years of real-world experience.</p>
                                </div>
                                <div className="bg-card p-6 rounded-lg border border-border">
                                    <h3 className="text-xl font-semibold mb-2 text-foreground">Flexible Learning</h3>
                                    <p>Study at your own pace with lifetime access to course materials.</p>
                                </div>
                                <div className="bg-card p-6 rounded-lg border border-border">
                                    <h3 className="text-xl font-semibold mb-2 text-foreground">Interactive Content</h3>
                                    <p>Engage with hands-on projects, quizzes, and community discussions.</p>
                                </div>
                                <div className="bg-card p-6 rounded-lg border border-border">
                                    <h3 className="text-xl font-semibold mb-2 text-foreground">Certificates</h3>
                                    <p>Earn certificates upon completion to showcase your achievements.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Our Story</h2>
                            <p className="text-lg leading-relaxed">
                                Founded with a vision to democratize education, LearnHub has grown into a thriving
                                community of learners and educators. We continuously strive to improve our platform
                                and expand our course offerings to meet the evolving needs of our students.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Join Our Community</h2>
                            <p className="text-lg leading-relaxed mb-6">
                                Whether you're looking to advance your career, learn a new skill, or explore a passion,
                                LearnHub is here to support your learning journey. Join thousands of students worldwide
                                who are transforming their lives through education.
                            </p>
                            <a
                                href="/courses"
                                className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#37a39a] text-[#37a39a] dark:text-white font-semibold rounded-lg hover:bg-[#37a39a] hover:text-white transition duration-200"
                            >
                                Browse Courses
                            </a>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
