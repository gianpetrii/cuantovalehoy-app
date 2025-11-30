"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "firebase/auth";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      await updateProfile(user, {
        displayName: displayName,
      });
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      toast.error("Error al actualizar el perfil", {
        description: error.message,
      });
    }
    setUpdating(false);
  };

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

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Administra la configuración de tu cuenta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Perfil</CardTitle>
            <CardDescription>
              Actualiza tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El email no se puede cambiar
                </p>
              </div>

              <Button type="submit" disabled={updating}>
                {updating ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferencias</CardTitle>
            <CardDescription>
              Personaliza tu experiencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones por email</p>
                <p className="text-sm text-muted-foreground">
                  Recibe actualizaciones por correo
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">
                  Cambia entre modo claro y oscuro
                </p>
              </div>
              <Button variant="outline" size="sm">
                Cambiar
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Idioma</p>
                <p className="text-sm text-muted-foreground">
                  Selecciona tu idioma preferido
                </p>
              </div>
              <Button variant="outline" size="sm">
                Español
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
            <CardDescription>
              Acciones irreversibles de la cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Eliminar cuenta</p>
                <p className="text-sm text-muted-foreground">
                  Esta acción no se puede deshacer
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

