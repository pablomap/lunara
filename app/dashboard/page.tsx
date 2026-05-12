"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Heart, MessageSquare, LogOut, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [todayLog, setTodayLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) return;
        setUser(authUser);

        // Get profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setProfile(profileData);

        // Get today's log
        const today = new Date().toISOString().split("T")[0];
        const { data: logData } = await supabase
          .from("daily_logs")
          .select("*")
          .eq("user_id", authUser.id)
          .eq("date", today)
          .single();
        setTodayLog(logData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold font-heading text-primary">
            Lunara
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-secondary/10 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">
            Hola, {user?.email?.split("@")[0] || "usuaria"}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Daily Log Card */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How are you today */}
          <Link
            href="/track"
            className="group p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border hover:border-primary/30 transition cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold font-heading mb-1">
                  ¿Cómo estás hoy?
                </h3>
                <p className="text-muted-foreground text-sm">
                  {todayLog
                    ? "Ya registraste hoy"
                    : "Cuéntale a tu copiloto cómo te sientes"}
                </p>
              </div>
              <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition" />
            </div>
          </Link>

          {/* Chat */}
          <Link
            href="/chat"
            className="group p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-secondary/5 border border-border hover:border-accent/30 transition cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold font-heading mb-1">
                  Habla con Lunara
                </h3>
                <p className="text-muted-foreground text-sm">
                  Tu copiloto está aquí para escucharte
                </p>
              </div>
              <MessageSquare className="w-5 h-5 text-accent group-hover:scale-110 transition" />
            </div>
          </Link>
        </div>

        {/* Stats */}
        {todayLog && (
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold font-heading mb-4">Hoy registraste:</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {todayLog.energy}/5
                </div>
                <div className="text-xs text-muted-foreground">Energía</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {todayLog.sleep_quality}/5
                </div>
                <div className="text-xs text-muted-foreground">Sueño</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-foreground">
                  {todayLog.mood}/5
                </div>
                <div className="text-xs text-muted-foreground">Ánimo</div>
              </div>
            </div>
            {todayLog.symptoms?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Síntomas:</p>
                <div className="flex flex-wrap gap-2">
                  {todayLog.symptoms.map((s: string) => (
                    <span
                      key={s}
                      className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick tips */}
        <div className="mt-8 p-6 rounded-2xl bg-secondary/5 border border-secondary/20">
          <h3 className="font-semibold font-heading mb-3">💡 Consejo del día</h3>
          <p className="text-muted-foreground text-sm">
            Mantén un registro consistente. Cuantos más datos tengas, más
            patrones podrá identificar Lunara para ayudarte mejor.
          </p>
        </div>
      </main>
    </div>
  );
}
