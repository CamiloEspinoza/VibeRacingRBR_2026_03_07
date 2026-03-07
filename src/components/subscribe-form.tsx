"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY">("WEEKLY");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frequency }),
      });

      const data = await res.json();
      setMessage(data.message);
      setStatus(res.ok ? "success" : "error");

      if (res.ok) {
        setEmail("");
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
        <Button
          variant="ghost"
          onClick={() => setStatus("idle")}
          className="text-sm"
        >
          Suscribir otro email
        </Button>
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
          className="h-12 px-6 bg-primary hover:bg-primary/90 font-semibold"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Suscribirme"
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 justify-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="frequency"
            value="WEEKLY"
            checked={frequency === "WEEKLY"}
            onChange={() => setFrequency("WEEKLY")}
            className="accent-primary"
          />
          <span className="text-sm text-muted-foreground">Semanal</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="frequency"
            value="DAILY"
            checked={frequency === "DAILY"}
            onChange={() => setFrequency("DAILY")}
            className="accent-primary"
          />
          <span className="text-sm text-muted-foreground">Diario</span>
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive text-center">{message}</p>
      )}
    </form>
  );
}
