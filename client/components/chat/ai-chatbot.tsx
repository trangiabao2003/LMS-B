"use client";

import { useState, useEffect, useRef } from "react";
import userAuth from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, MessageCircle, X } from "lucide-react";
import { useTheme } from "next-themes";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	sources?: any[];
	timestamp: Date;
}

interface AIChatbotProps {
	courseId?: string;
	isOpen?: boolean;
	onClose?: () => void;
}

export function AIChatbot({
	courseId,
	isOpen = true,
	onClose,
}: AIChatbotProps) {
	const { data: session } = userAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { theme } = useTheme();

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async () => {
		if (!input.trim() || !session) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const response = await fetch("/api/v1/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					question: input,
					courseId,
				}),
			});

			const data = await response.json();

			if (data.success) {
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: data.data.answer,
					sources: data.data.sources,
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, assistantMessage]);
			} else {
				const errorMessage: Message = {
					id: (Date.now() + 2).toString(),
					role: "assistant",
					content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, errorMessage]);
			}
		} catch (error) {
			console.error("Error sending message:", error);
			const errorMessage: Message = {
				id: (Date.now() + 2).toString(),
				role: "assistant",
				content: "Không thể kết nối tới AI Service. Vui lòng kiểm tra kết nối.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-24px)] z-50">
			<Card
				className={`flex flex-col h-screen max-h-96 ${
					theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white"
				}`}>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
					<div className="flex items-center gap-2">
						<MessageCircle className="w-5 h-5 text-white" />
						<div>
							<h2 className="font-semibold text-white">
								AI Learning Assistant
							</h2>
							<p className="text-xs text-blue-100">Trợ lý học tập 24/7</p>
						</div>
					</div>
					{onClose && (
						<button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
							<X className="w-5 h-5 text-white" />
						</button>
					)}
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{messages.length === 0 && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
								<p className="text-sm text-muted-foreground">
									Hỏi tôi về lộ trình học tập
									<br />
									hoặc các khóa học của chúng tôi
								</p>
							</div>
						</div>
					)}

					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.role === "user" ? "justify-end" : "justify-start"
							}`}>
							<div
								className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
									message.role === "user"
										? "bg-blue-500 text-white rounded-br-none"
										: `${
												theme === "dark"
													? "bg-slate-800 text-white"
													: "bg-gray-100 text-gray-900"
										  } rounded-bl-none`
								}`}>
								<p className="whitespace-pre-wrap break-words">
									{message.content}
								</p>
								{message.sources && message.sources.length > 0 && (
									<div
										className={`mt-2 text-xs pt-2 border-t ${
											theme === "dark" ? "border-slate-700" : "border-gray-300"
										}`}>
										<p className="font-semibold mb-1 opacity-75">📚 Nguồn:</p>
										<ul className="space-y-1 opacity-75">
											{message.sources.slice(0, 3).map((source, idx) => (
												<li key={idx}>• {source.category || "Course"}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</div>
					))}

					{loading && (
						<div className="flex justify-start">
							<div
								className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
									theme === "dark"
										? "bg-slate-800 text-white"
										: "bg-gray-100 text-gray-900"
								}`}>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Đang xử lý...</span>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				{/* Input */}
				<div
					className={`p-4 border-t ${
						theme === "dark" ? "border-slate-800" : ""
					}`}>
					<div className="flex gap-2">
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={(e) =>
								e.key === "Enter" && !loading && handleSendMessage()
							}
							placeholder="Nhập câu hỏi..."
							disabled={loading || !session}
							className="text-sm"
						/>
						<Button
							onClick={handleSendMessage}
							disabled={loading || !input.trim() || !session}
							size="sm"
							className="bg-blue-500 hover:bg-blue-600">
							<Send className="w-4 h-4" />
						</Button>
					</div>
					{!session && (
						<p className="text-xs text-muted-foreground mt-2">
							Vui lòng đăng nhập để sử dụng AI Assistant
						</p>
					)}
				</div>
			</Card>
		</div>
	);
}

// Floating button component
export function AIChatbotButton() {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = userAuth();

	if (!session) return null;

	return (
		<>
			{isOpen && <AIChatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />}
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-40"
					title="Open AI Assistant">
					<MessageCircle className="w-6 h-6 text-white" />
				</button>
			)}
		</>
	);
}
