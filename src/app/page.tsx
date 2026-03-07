import { HeroSection } from "@/components/hero-section";
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

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const newsletter = await getLatestNewsletter();

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />

      {newsletter && (
        <>
          <Separator className="max-w-4xl mx-auto w-full" />

          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">
                  Ultima edicion
                </h2>
                <p className="text-muted-foreground">
                  Asi luce nuestro newsletter. Suscribete para recibirlo
                  directamente en tu bandeja de entrada.
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
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-12 rounded-xl border border-dashed border-primary/20 bg-accent/20">
              <p className="text-4xl mb-4">🚀</p>
              <h3 className="text-xl font-semibold mb-2">
                Primer newsletter en camino
              </h3>
              <p className="text-muted-foreground">
                Estamos preparando la primera edicion de nuestro newsletter.
                Suscribete ahora para ser de los primeros en recibirlo.
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
