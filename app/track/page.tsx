"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SYMPTOMS = [
  "Sofocos",
  "Sudores nocturnos",
  "Insomnio",
  "Cambios de ánimo",
  "Niebla mental",
  "Fatiga",
  "Sequedad vaginal",
  "Cambios en libido",
  "Dolores articulares",
  "Ganancia de peso",
  "Ansiedad",
  "Palpitaciones",
];

export default function TrackPage() {
  const router = useRouter();
  const supabase = createClient();
  const [energy, setEnergy] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [mood, setMood] = useState(3);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("No user found");

      const today = new Date().toISOString().split("T")[0];

      // Check if log exists
      const { data: existing } = await supabase
        .from("daily_logs")
        .select("id")
        .eq("user_id", user.data.user.id)
        .eq("date", today)
        .single();

      if (existing) {
        // Update
        await supabase
          .from("daily_logs")
          .update({
            energy,
            sleep_quality: sleepQuality,
            mood,
            symptoms,
            notes,
          })
          .eq("id", existing.id);
      } else {
        // Insert
        await supabase.from("daily_logs").insert({
          user_id: user.data.user.id,
          date: today,
          energy,
          sleep_quality: sleepQuality,
          mood,
          symptoms,
          notes,
        });
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const Slider = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-lg font-bold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Muy baja</span>
        <span>Muy alta</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-secondary/10 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading">¿Cómo te sientes hoy?</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
          {/* Sliders */}
          <div className="space-y-6">
            <Slider label="Energía" value={energy} onChange={setEnergy} />
            <Slider label="Calidad del sueño" value={sleepQuality} onChange={setSleepQuality} />
            <Slider label="Ánimo" value={mood} onChange={setMood} />
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium mb-3">
              ¿Qué síntomas tienes hoy?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOMS.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-3 rounded-lg border-2 transition text-sm font-medium text-center ${
                    symptoms.includes(symptom)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-transparent text-foreground hover:border-primary/30"
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Me desperté varias veces anoche. Comí muy bien hoy..."
              className="w-full h-24 px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground resize-none"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </main>
    </div>
  );
}
