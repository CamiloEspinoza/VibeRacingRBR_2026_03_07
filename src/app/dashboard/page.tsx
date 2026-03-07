"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Linkedin, Twitter, Loader2 } from "lucide-react";
import Link from "next/link";

interface SubscriberData {
  id: string;
  email: string;
  linkedinConnected: boolean;
  xConnected: boolean;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const verified = searchParams.get("verified");
  const linkedinStatus = searchParams.get("linkedin");
  const xStatus = searchParams.get("x");
  const error = searchParams.get("error");

  const [subscriber, setSubscriber] = useState<SubscriberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`/api/subscriber/${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSubscriber(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userId || !subscriber) {
    return (
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Acceso no autorizado</h1>
        <p className="text-muted-foreground mb-6">
          Necesitas registrarte y verificar tu email primero.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Ir al registro
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Success messages */}
      {verified === "true" && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800 dark:text-green-200 font-medium">
            Email verificado exitosamente!
          </p>
        </div>
      )}
      {linkedinStatus === "connected" && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            LinkedIn conectado exitosamente!
          </p>
        </div>
      )}
      {xStatus === "connected" && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <CheckCircle2 className="w-5 h-5 text-gray-600" />
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            X (Twitter) conectado exitosamente!
          </p>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200 font-medium">
            Error: {error.replace(/_/g, " ")}
          </p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Conecta tus redes sociales</h1>
        <p className="text-muted-foreground mt-2">
          Conecta tu LinkedIn y X para que recopilemos tus publicaciones y
          generemos tu newsletter personalizado.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          📧 {subscriber.email}
        </p>
      </div>

      {/* OAuth Cards */}
      <div className="grid gap-4">
        <Card className={subscriber.linkedinConnected ? "border-blue-500/30 bg-blue-50/30 dark:bg-blue-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Linkedin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">LinkedIn</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Conecta para recopilar tus publicaciones
                </p>
              </div>
            </div>
            {subscriber.linkedinConnected && (
              <Badge className="bg-blue-600 hover:bg-blue-700">Conectado</Badge>
            )}
          </CardHeader>
          <CardContent>
            {subscriber.linkedinConnected ? (
              <p className="text-sm text-muted-foreground">
                Tu cuenta de LinkedIn esta conectada. Recopilaremos tus publicaciones automaticamente.
              </p>
            ) : (
              <Button
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <a href={`/api/auth/linkedin?userId=${userId}`}>
                  <Linkedin className="w-4 h-4 mr-2" />
                  Conectar LinkedIn
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className={subscriber.xConnected ? "border-gray-500/30 bg-gray-50/30 dark:bg-gray-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Twitter className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <CardTitle className="text-lg">X (Twitter)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Conecta para recopilar tus tweets
                </p>
              </div>
            </div>
            {subscriber.xConnected && (
              <Badge variant="secondary">Conectado</Badge>
            )}
          </CardHeader>
          <CardContent>
            {subscriber.xConnected ? (
              <p className="text-sm text-muted-foreground">
                Tu cuenta de X esta conectada. Recopilaremos tus tweets automaticamente.
              </p>
            ) : (
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <a href={`/api/auth/x?userId=${userId}`}>
                  <Twitter className="w-4 h-4 mr-2" />
                  Conectar X (Twitter)
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      {subscriber.linkedinConnected && subscriber.xConnected && (
        <Card className="border-green-500/30 bg-green-50/30 dark:bg-green-950/20">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Todo listo!</h3>
            <p className="text-muted-foreground">
              Tus redes sociales estan conectadas. Recibiras tu newsletter
              personalizado dos veces al dia (8:00 AM y 8:00 PM).
            </p>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
