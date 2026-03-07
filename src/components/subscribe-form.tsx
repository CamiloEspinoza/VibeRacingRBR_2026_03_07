"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setStatus("success");
        setEmail("");
        // Redirect to verification pending page after 2 seconds
        setTimeout(() => {
          router.push("/verify?pending=true");
        }, 2000);
      } else if (res.status === 409 && data.userId) {
        // Already subscribed, go to dashboard
        router.push(`/dashboard?userId=${data.userId}`);
      } else {
        setStatus("error");
      }
    } catch {
      setMessage("Error de conexion. Intenta de nuevo.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-accent/50 border border-primary/20">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <p className="text-lg font-semibold text-center">{message}</p>
        <p className="text-sm text-muted-foreground">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 h-12"
            disabled={status === "loading"}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold border-0"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Comenzar"
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Te enviaremos un email de verificacion. Luego podras conectar tu LinkedIn y X.
      </p>

      {status === "error" && (
        <p className="text-sm text-destructive text-center">{message}</p>
      )}
    </form>
  );
}
