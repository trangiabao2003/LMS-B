import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Chat API endpoint is accessible" });
}

export async function POST(req: NextRequest) {
  try {
    // Get request body
    const body = await req.json();
    const { question, courseId } = body;

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question is required" },
        { status: 400 }
      );
    }

    // Forward to Express backend
    let backendUrl = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8000";
    
    // Normalize URL: remove trailing slash
    backendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
    
    // Handle case where env var includes /api/v1
    const apiUrl = backendUrl.includes("/api/v1")
      ? `${backendUrl}/chat`
      : `${backendUrl}/api/v1/chat`;
    
    // Get all cookies and headers from the original request
    const cookies = req.headers.get("cookie") || "";
    const authorization = req.headers.get("authorization") || "";
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies,
        ...(authorization && { "Authorization": authorization }),
      },
      credentials: "include",
      body: JSON.stringify({
        question,
        courseId,
      }),
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error (${response.status}):`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: response.status });
      } catch (e) {
        return NextResponse.json(
          { success: false, message: `Backend error: ${response.status} ${response.statusText}`, detail: errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();

    // Return the response from backend
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
