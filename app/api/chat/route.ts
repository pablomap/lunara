import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { client, SYSTEM_PROMPT, buildUserContext } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json();

    if (!message || !conversationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get conversation to find user
    const supabase = await createClient();
    const { data: conversation } = await supabase
      .from("conversations")
      .select("user_id")
      .eq("id", conversationId)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Get last 30 days of logs for context
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split("T")[0];

    const { data: recentLogs } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", conversation.user_id)
      .gte("date", startDate)
      .order("date", { ascending: false });

    // Build context
    const userContext = buildUserContext(recentLogs || []);

    // Get conversation history (last 10 messages)
    const { data: messageHistory } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(10);

    // Build messages array for Claude
    const messages: any[] = [];

    if (messageHistory && messageHistory.length > 0) {
      messageHistory.forEach((msg) => {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      });
    }

    // Add current message
    messages.push({
      role: "user",
      content: message,
    });

    // Call Claude API
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT + userContext,
      messages: messages,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      response: assistantMessage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
