import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full max-w-3xl overflow-hidden border-primary/10 shadow-lg">
      {newsletter.imageUrl && (
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={newsletter.imageUrl}
            alt={newsletter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className="mb-2 bg-primary/90 hover:bg-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              Generado por IA
            </Badge>
          </div>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          <span className="capitalize">{date}</span>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold leading-tight">
          {newsletter.title}
        </CardTitle>
        <p className="text-muted-foreground mt-2">{newsletter.summary}</p>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-neutral max-w-none dark:prose-invert [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
          dangerouslySetInnerHTML={{ __html: newsletter.content }}
        />
      </CardContent>
    </Card>
  );
}
