import Link from "next/link";

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 text-6xl">👋</div>
        <h1 className="text-2xl font-bold mb-4">Suscripcion cancelada</h1>
        <p className="text-muted-foreground mb-8">
          Has cancelado tu suscripcion a The AI Pulse. Lamentamos verte ir.
          Si cambias de opinion, siempre puedes volver a suscribirte.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
