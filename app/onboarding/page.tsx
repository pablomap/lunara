"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
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

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("No user found");

      await supabase.from("profiles").insert({
        id: user.data.user.id,
        age: parseInt(age),
        stage: stage || "unknown",
        initial_symptoms: symptoms,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition ${
                  s <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          {/* Step 1: Age & Stage */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold font-heading mb-2">
                Primero, cuéntanos un poco
              </h2>
              <p className="text-muted-foreground mb-6">
                Esto nos ayuda a personalizar tu experiencia
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ¿Cuántos años tienes?
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border"
                    placeholder="35"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    ¿En qué etapa estás?
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        value: "perimenopause",
                        label: "Perimenopausia (cambios sin regla definitiva aún)",
                      },
                      {
                        value: "menopause",
                        label: "Menopausia (sin regla hace 12 meses+)",
                      },
                      {
                        value: "postmenopause",
                        label: "Postmenopausia (después de la menopausia)",
                      },
                      {
                        value: "unknown",
                        label: "No estoy segura",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/10 transition"
                      >
                        <input
                          type="radio"
                          name="stage"
                          value={option.value}
                          checked={stage === option.value}
                          onChange={(e) => setStage(e.target.value)}
                          className="w-4 h-4"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Symptoms */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold font-heading mb-2">
                ¿Qué síntomas tienes?
              </h2>
              <p className="text-muted-foreground mb-6">
                Selecciona todos los que apliquen. Puedes cambiar esto después.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`p-3 rounded-lg border-2 transition text-sm font-medium ${
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
          )}

          {/* Step 3: Notes */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold font-heading mb-2">
                Algo más que quieras compartir?
              </h2>
              <p className="text-muted-foreground mb-6">
                (Opcional) Esto nos ayuda a entenderte mejor
              </p>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Hace 2 años que empezaron los cambios. He probado algunos tratamientos pero nada ha funcionado bien..."
                className="w-full h-32 px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground resize-none"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-2 rounded-lg border border-border hover:bg-secondary/10 transition font-medium"
              >
                Atrás
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!age || !stage)) || (step === 2 && symptoms.length === 0)
                }
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium disabled:opacity-50"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Empezar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
