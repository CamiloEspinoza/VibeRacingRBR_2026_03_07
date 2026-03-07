import { newsletterConfig } from "@/lib/newsletter-config";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-sm font-semibold mb-1">{newsletterConfig.name}</p>
        <p className="text-xs text-muted-foreground">
          Newsletter generado automaticamente por inteligencia artificial.
          Powered by Gemini AI.
        </p>
      </div>
    </footer>
  );
}
