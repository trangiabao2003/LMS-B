"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { Heading } from "../utils/Heading"

export default function PoliciesPage() {
    const [open, setOpen] = useState(false)
    const [activeItem, setActiveItem] = useState(3)
    const [route, setRoute] = useState("Login")

    return (
        <main className="min-h-screen bg-background">
            <Heading
                title="Policies - LearnHub"
                description="Read our terms of service, privacy policy, and other important policies"
                keywords="policies, terms of service, privacy policy, refund policy"
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
                        Our Policies
                    </h1>

                    <div className="space-y-8 text-muted-foreground">
                        {/* Privacy Policy */}
                        <section className="bg-card p-8 rounded-lg border border-border">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Privacy Policy</h2>
                            <div className="space-y-4">
                                <p className="leading-relaxed">
                                    At LearnHub, we take your privacy seriously. We collect and use your personal information
                                    only to provide you with the best learning experience possible.
                                </p>
                                <h3 className="text-lg font-semibold text-foreground">Information We Collect</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Account information (name, email, password)</li>
                                    <li>Course progress and completion data</li>
                                    <li>Payment information (processed securely through Stripe)</li>
                                    <li>Usage data and analytics</li>
                                </ul>
                                <h3 className="text-lg font-semibold text-foreground">How We Use Your Information</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>To provide and improve our services</li>
                                    <li>To process your course enrollments and payments</li>
                                    <li>To send you important updates and notifications</li>
                                    <li>To personalize your learning experience</li>
                                </ul>
                            </div>
                        </section>

                        {/* Terms of Service */}
                        <section className="bg-card p-8 rounded-lg border border-border">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Terms of Service</h2>
                            <div className="space-y-4">
                                <p className="leading-relaxed">
                                    By using LearnHub, you agree to the following terms and conditions:
                                </p>
                                <h3 className="text-lg font-semibold text-foreground">User Responsibilities</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>You must be at least 13 years old to use our platform</li>
                                    <li>You are responsible for maintaining the security of your account</li>
                                    <li>You agree not to share your account credentials with others</li>
                                    <li>You will not use the platform for any illegal or unauthorized purpose</li>
                                </ul>
                                <h3 className="text-lg font-semibold text-foreground">Content Usage</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Course content is for personal use only</li>
                                    <li>You may not redistribute or resell course materials</li>
                                    <li>Lifetime access is subject to platform availability</li>
                                </ul>
                            </div>
                        </section>

                        {/* Refund Policy */}
                        <section className="bg-card p-8 rounded-lg border border-border">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Refund Policy</h2>
                            <div className="space-y-4">
                                <p className="leading-relaxed">
                                    We want you to be completely satisfied with your purchase. Here's our refund policy:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Request a full refund within 30 days of purchase</li>
                                    <li>No questions asked if you're not satisfied</li>
                                    <li>Refunds are processed within 5-10 business days</li>
                                </ul>
                                <h3 className="text-lg font-semibold text-foreground">Refund Exceptions</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Courses completed more than 80% are not eligible for refund</li>
                                    <li>Promotional or discounted courses may have different refund terms</li>
                                    <li>Certificate fees are non-refundable</li>
                                </ul>
                            </div>
                        </section>

                        {/* Cookie Policy */}
                        <section className="bg-card p-8 rounded-lg border border-border">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Cookie Policy</h2>
                            <div className="space-y-4">
                                <p className="leading-relaxed">
                                    We use cookies to enhance your experience on our platform. Cookies help us:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Remember your login status and preferences</li>
                                    <li>Analyze site traffic and usage patterns</li>
                                    <li>Provide personalized content recommendations</li>
                                    <li>Improve platform performance and security</li>
                                </ul>
                                <p className="leading-relaxed">
                                    You can control cookie settings through your browser preferences.
                                </p>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="bg-card p-8 rounded-lg border border-border">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Questions About Our Policies?</h2>
                            <p className="leading-relaxed mb-4">
                                If you have any questions or concerns about our policies, please don't hesitate to contact us.
                            </p>
                            <p className="text-foreground font-medium">
                                Email: support@learnhub.com
                            </p>
                        </section>

                        <p className="text-sm text-center pt-4">
                            Last updated: December 2025
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
