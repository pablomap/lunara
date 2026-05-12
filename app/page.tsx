"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold font-heading text-primary">
            Lunara
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-secondary/20 border border-secondary">
            <p className="text-sm font-medium text-primary">
              🌙 Tu copiloto hormonal
            </p>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-heading text-foreground mb-6 leading-tight">
            Entiende tu cuerpo,{" "}
            <span className="text-primary">no te hagas preguntas</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Acompañamiento personalizado con IA para menopausia, perimenopausia y
            todos los cambios hormonales que atraviesas. Sin diagnósticos. Sin
            tecnicismos. Solo claridad y apoyo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Acceso a beta
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {submitted && (
            <div className="text-sm text-accent font-medium">
              ✓ Te agregaremos a la lista de espera
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold font-heading text-center mb-16">
          Qué obtienes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-heading mb-3">
              Seguimiento Diario
            </h3>
            <p className="text-muted-foreground">
              Registra cómo te sientes: energía, sueño, ánimo, síntomas. Tu
              copiloto aprende tus patrones.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold font-heading mb-3">
              Chat IA Empático
            </h3>
            <p className="text-muted-foreground">
              Habla con Lunara. Conoce el contexto de tu historial. Recibe
              educación y acompañamiento real.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold font-heading mb-3">
              Patrones e Insights
            </h3>
            <p className="text-muted-foreground">
              Visualiza cómo se relacionan tus síntomas. Descubre qué influye en
              cómo te sientes.
            </p>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold font-heading mb-4">
            Construido con cuidado
          </h3>
          <p className="text-muted-foreground mb-6">
            No reemplazamos a tu médico. Educamos, acompañamos y nos adaptamos
            a ti. Disclaimers claros, referencia científica, sin promesas falsas.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Esta es una herramienta educativa y de acompañamiento. Siempre
            consulta a un profesional de la salud para diagnóstico y tratamiento.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold font-heading mb-6">
          ¿Lista para empezar?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Únete a beta privada. Primeras 100 usuarias acceso gratuito de por vida.
        </p>
        <Link
          href="/auth"
          className="inline-block px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition text-lg"
        >
          Acceso a Beta →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 text-center text-muted-foreground">
        <p className="mb-4">
          Lunara es una herramienta educativa. No sustituye consulta médica.
        </p>
        <p className="text-sm">
          © 2025 Lunara. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
