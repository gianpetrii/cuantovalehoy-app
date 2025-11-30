"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Mail, Calendar, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const createdAt = user.metadata.creationTime
    ? new Date(user.metadata.creationTime)
    : new Date();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Información de tu cuenta y preferencias
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.displayName || "Usuario"}
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Nombre</p>
                  <p className="text-muted-foreground">
                    {user.displayName || "No especificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Miembro desde</p>
                  <p className="text-muted-foreground">
                    {createdAt.toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email verificado</span>
                <span
                  className={`text-sm font-medium ${
                    user.emailVerified ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {user.emailVerified ? "Verificado" : "Pendiente"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Autenticación de dos factores</span>
                <span className="text-sm font-medium text-muted-foreground">
                  Desactivado
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Último acceso</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {user.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
                        "es-ES"
                      )
                    : "Desconocido"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

