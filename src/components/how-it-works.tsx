const steps = [
  {
    number: "01",
    title: "Suscríbete",
    description:
      "Ingresa tu email. Te enviamos un enlace de verificación y en segundos estás dentro.",
    icon: "✉",
  },
  {
    number: "02",
    title: "Conecta tus cuentas",
    description:
      "Vincula tu LinkedIn y tu cuenta de X. Solo necesitamos permiso de lectura — nunca publicamos nada.",
    icon: "🔗",
  },
  {
    number: "03",
    title: "Recibe tu digest",
    description:
      "Cada día a las 8AM y 8PM, Gemini AI analiza tu red y genera un resumen inteligente directo a tu inbox.",
    icon: "✦",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-sans font-medium mb-3">
            Cómo funciona
          </p>
          <h2 className="font-display italic text-4xl md:text-5xl text-foreground leading-tight">
            De tu red social<br />a tu bandeja de entrada
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-0 md:gap-px bg-border rounded-xl overflow-hidden">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="bg-card p-8 md:p-10 group hover:bg-accent/30 transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-4xl font-display italic text-primary/25 leading-none select-none">
                  {step.number}
                </span>
                <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                  {step.icon}
                </span>
              </div>
              <h3 className="text-xl font-sans font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-muted-foreground mt-8 font-sans">
          Completamente gratis · Sin spam · Cancela cuando quieras
        </p>
      </div>
    </section>
  );
}
