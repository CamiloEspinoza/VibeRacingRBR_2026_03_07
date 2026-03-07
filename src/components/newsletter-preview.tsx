import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";

interface NewsletterData {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  generatedAt: string;
}

export function NewsletterPreview({
  newsletter,
}: {
  newsletter: NewsletterData;
}) {
  const date = new Date(newsletter.generatedAt).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {newsletter.imageUrl && (
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={newsletter.imageUrl}
            alt={newsletter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <Badge className="bg-orange-500/90 hover:bg-orange-500 text-white border-0 text-xs font-sans">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Generado por IA
            </Badge>
          </div>
        </div>
      )}

      <div className="p-8 md:p-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-sans uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span className="capitalize">{date}</span>
        </div>

        <h2 className="font-display italic text-3xl md:text-4xl text-foreground leading-tight mb-4">
          {newsletter.title}
        </h2>

        <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-8 pb-8 border-b border-border">
          {newsletter.summary}
        </p>

        <div
          className="prose prose-neutral max-w-none [&_h2]:font-display [&_h2]:italic [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:text-muted-foreground [&_ul]:list-none [&_ul]:pl-0 [&_li]:pl-4 [&_li]:border-l-2 [&_li]:border-primary/30 [&_li]:mb-2 [&_li]:text-sm [&_li]:text-muted-foreground [&_li]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: newsletter.content }}
        />
      </div>
    </article>
  );
}
