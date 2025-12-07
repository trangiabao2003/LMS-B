"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { Heading } from "../utils/Heading"
import FAQ from "@/components/faq/faq"

export default function FAQPage() {
    const [open, setOpen] = useState(false)
    const [activeItem, setActiveItem] = useState(4)
    const [route, setRoute] = useState("Login")

    return (
        <main className="min-h-screen bg-background">
            <Heading
                title="FAQ - LearnHub"
                description="Find answers to frequently asked questions about LearnHub"
                keywords="faq, questions, help, support, answers"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                route={route}
                setRoute={setRoute}
            />

            <div className="w-full min-h-[70vh] py-12">
                <FAQ />
            </div>

            <Footer />
        </main>
    )
}
