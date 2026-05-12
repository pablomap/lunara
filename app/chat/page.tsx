"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, Send } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        // Create or get conversation
        const { data: conversations } = await supabase
          .from("conversations")
          .select("id")
          .eq("user_id", user.data.user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        let convId = conversations?.[0]?.id;
        if (!convId) {
          const { data: newConv } = await supabase
            .from("conversations")
            .insert({
              user_id: user.data.user.id,
            })
            .select("id")
            .single();
          convId = newConv?.id;
        }

        setConversationId(convId);

        // Load messages
        if (convId) {
          const { data: msgs } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", convId)
            .order("created_at", { ascending: true });
          setMessages(msgs || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    initChat();
  }, [supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      // Add user message
      const { data: userMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "user",
          content: userMessage,
        })
        .select()
        .single();

      if (userMsg) {
        setMessages((prev) => [...prev, userMsg]);
      }

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Add assistant message
      const { data: assistantMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: data.response,
        })
        .select()
        .single();

      if (assistantMsg) {
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-secondary/10 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-heading">Lunara</h1>
            <p className="text-xs text-muted-foreground">Tu copiloto hormonal</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-4xl mb-4">🌙</div>
              <h2 className="text-lg font-semibold font-heading mb-2">
                Hola, soy Lunara
              </h2>
              <p className="text-muted-foreground max-w-xs">
                Estoy aquí para acompañarte en tu camino hormonal. Pregúntame lo
                que necesites.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-card border border-border rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background p-4 sticky bottom-0">
        <form
          onSubmit={handleSend}
          className="max-w-2xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cuéntame cómo te sientes..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-full bg-input border border-border text-foreground placeholder-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
