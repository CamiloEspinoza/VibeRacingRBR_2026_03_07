import { newsletterConfig } from "@/lib/newsletter-config";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white border-t border-white/8">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div>
            <p className="font-display italic text-2xl text-white mb-1">
              {newsletterConfig.name}
            </p>
            <p className="text-xs text-white/35 font-sans">
              {newsletterConfig.tagline}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/30 font-sans">
            <Sparkles className="w-3 h-3 text-orange-400/50" />
            <span>Generado por Gemini AI · {new Date().getFullYear()}</span>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/8 text-center">
          <p className="text-[11px] text-white/20 font-sans uppercase tracking-widest">
            Newsletter automatizado · Solo lectura de tus redes sociales · Sin spam
          </p>
        </div>
      </div>
    </footer>
  );
}
