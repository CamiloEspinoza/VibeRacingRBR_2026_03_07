import { SubscribeForm } from "./subscribe-form";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Globe, Clock } from "lucide-react";
import { newsletterConfig } from "@/lib/newsletter-config";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          100% generado por IA
        </Badge>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          {newsletterConfig.name}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
          {newsletterConfig.tagline}
        </p>

        <p className="text-base text-muted-foreground max-w-xl mx-auto mb-10">
          {newsletterConfig.description}
        </p>

        <div className="flex justify-center mb-10">
          <SubscribeForm />
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { icon: Sparkles, label: "Contenido IA" },
            { icon: Zap, label: "Actualizado" },
            { icon: Globe, label: "Tech & AI" },
            { icon: Clock, label: "Diario o Semanal" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card border"
            >
              <feature.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
