"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const pending = searchParams.get("pending");

  if (pending === "true") {
    return (
      <div className="text-center max-w-md">
        <div className="mb-6 text-6xl">📧</div>
        <h1 className="text-2xl font-bold mb-4">Revisa tu email</h1>
        <p className="text-muted-foreground mb-8">
          Te hemos enviado un enlace de verificacion. Haz clic en el para
          activar tu cuenta y conectar tus redes sociales.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const errorMessages: Record<string, string> = {
    missing_token: "Enlace de verificacion invalido.",
    invalid_token: "El enlace de verificacion no existe o ya fue utilizado.",
    expired_token: "El enlace de verificacion ha expirado. Registrate de nuevo.",
    server_error: "Error del servidor. Intenta de nuevo.",
  };

  return (
    <div className="text-center max-w-md">
      <div className="mb-6 text-6xl">⚠️</div>
      <h1 className="text-2xl font-bold mb-4">Error de verificacion</h1>
      <p className="text-muted-foreground mb-8">
        {error ? errorMessages[error] || "Error desconocido." : "Error desconocido."}
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Suspense fallback={<div>Cargando...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
