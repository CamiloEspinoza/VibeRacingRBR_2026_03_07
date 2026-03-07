import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { NewsletterPreview } from "@/components/newsletter-preview";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";

async function getLatestNewsletter() {
  try {
    const newsletter = await prisma.newsletter.findFirst({
      where: {
        status: { in: ["PUBLISHED", "SENT"] },
      },
      orderBy: { generatedAt: "desc" },
    });
    return newsletter;
  } catch {
    return null;
  }
}

export const revalidate = 60;

export default async function Home() {
  const newsletter = await getLatestNewsletter();

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />

      <HowItWorks />

      {newsletter && (
        <>
          <Separator className="max-w-5xl mx-auto w-full" />
          <section className="py-20 px-6 bg-background">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12">
                <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-sans font-medium mb-3">
                  Última edición
                </p>
                <h2 className="font-display italic text-4xl md:text-5xl text-foreground leading-tight">
                  Así luce tu digest
                </h2>
                <p className="text-muted-foreground mt-3 font-sans text-sm max-w-md">
                  Suscríbete para recibirlo directamente en tu bandeja de entrada.
                </p>
              </div>

              <div className="flex justify-center">
                <NewsletterPreview
                  newsletter={{
                    ...newsletter,
                    generatedAt: newsletter.generatedAt.toISOString(),
                  }}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {!newsletter && (
        <section className="py-20 px-6 bg-background">
          <div className="max-w-xl mx-auto text-center">
            <div className="p-12 rounded-2xl border border-dashed border-primary/20 bg-accent/20">
              <span className="text-4xl block mb-4">✦</span>
              <h3 className="font-display italic text-2xl text-foreground mb-2">
                Primera edición en camino
              </h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                Estamos preparando el primer digest. Suscríbete ahora para ser de los primeros en recibirlo.
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
