import { SubscribeForm } from "./subscribe-form";
import { Badge } from "@/components/ui/badge";
import { newsletterConfig } from "@/lib/newsletter-config";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="dark relative bg-zinc-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Editorial top bar */}
      <div className="relative border-b border-white/8 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-[11px] text-white/35 uppercase tracking-[0.15em] font-sans">
          <span>Est. 2026 · Santiago, Chile</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-orange-400/70" />
            Gemini AI
          </span>
          <span>Tecnología · IA · Startups</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 w-full">

        {/* Badge */}
        <div className="flex justify-center mb-10 animate-fade-up">
          <Badge className="bg-orange-500/12 text-orange-300 border border-orange-500/20 px-5 py-1.5 text-[11px] uppercase tracking-[0.2em] font-sans font-medium rounded-full">
            Newsletter · Inteligencia Artificial
          </Badge>
        </div>

        {/* Masthead */}
        <div className="text-center mb-4 animate-fade-up delay-100">
          <h1 className="font-display italic text-white leading-[0.88] tracking-tight select-none"
              style={{ fontSize: "clamp(4.5rem, 14vw, 11rem)" }}>
            The AI Pulse
          </h1>
        </div>

        {/* Divider with ornament */}
        <div className="flex items-center gap-4 max-w-lg mx-auto my-8 animate-fade-in delay-200">
          <div className="flex-1 h-px bg-white/12" />
          <span className="text-orange-400/60 text-base">✦</span>
          <div className="flex-1 h-px bg-white/12" />
        </div>

        {/* Tagline */}
        <div className="text-center mb-12 animate-fade-up delay-200">
          <p className="text-lg md:text-xl text-white/55 max-w-xl mx-auto font-sans font-light leading-relaxed">
            {newsletterConfig.tagline}
          </p>
        </div>

        {/* Subscribe form */}
        <div className="flex justify-center mb-12 animate-fade-up delay-300">
          <div className="w-full max-w-md">
            <SubscribeForm />
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2.5 animate-fade-up delay-400">
          {[
            { icon: "in", label: "LinkedIn" },
            { icon: "𝕏", label: "X / Twitter" },
            { icon: "✦", label: "Curado por IA" },
            { icon: "◷", label: "8AM y 8PM" },
            { icon: "✉", label: "Gratis" },
          ].map((feature) => (
            <span
              key={feature.label}
              className="flex items-center gap-2 text-xs text-white/40 border border-white/8 rounded-full px-4 py-2 hover:border-white/20 hover:text-white/60 transition-colors"
            >
              <span className="text-orange-400/70 text-sm">{feature.icon}</span>
              {feature.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
