import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminProjects() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: projects } = trpc.projects.list.useQuery({});

  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success("Proyecto eliminado");
      utils.projects.list.invalidate();
    },
    onError: () => toast.error("Error al eliminar"),
  });

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white/40">Cargando...</div>;

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white/60 gap-4">
        <p>Acceso restringido — Solo Ignacio Vidal</p>
        <a href="/api/oauth/login" className="cad-label hover:bg-white/10">Iniciar sesión</a>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Proyectos</h1>
            <p className="text-white/50 text-sm">Administrar proyectos de vivienda social</p>
          </div>
          <Link href="/admin/proyectos/nuevo">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Nuevo Proyecto
            </Button>
          </Link>
        </div>

        <Card className="cad-border bg-card p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-xs uppercase font-mono tracking-wider">
                  <th className="text-left py-2 px-3">Proyecto</th>
                  <th className="text-left py-2 px-3">Programa</th>
                  <th className="text-left py-2 px-3">Región</th>
                  <th className="text-left py-2 px-3">Comuna</th>
                  <th className="text-left py-2 px-3">Estado</th>
                  <th className="text-right py-2 px-3">UF</th>
                  <th className="text-center py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(projects || []).map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3 text-white/80 text-xs max-w-xs truncate">{p.name}</td>
                    <td className="py-2 px-3"><span className="cad-label">{p.programCode}</span></td>
                    <td className="py-2 px-3 text-white/60 font-mono text-xs">{p.regionCode}</td>
                    <td className="py-2 px-3 text-white/60 text-xs">{p.comuna}</td>
                    <td className="py-2 px-3 text-white/50 text-xs">{p.status}</td>
                    <td className="py-2 px-3 text-right text-white/60 font-mono text-xs">{p.investmentUF || "—"}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/proyectos/${p.id}`}>
                          <button className="text-white/40 hover:text-white"><Eye className="h-4 w-4" /></button>
                        </Link>
                        <Link href={`/admin/proyectos/${p.id}/editar`}>
                          <button className="text-white/40 hover:text-white"><Edit className="h-4 w-4" /></button>
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar "${p.name}"?`)) deleteMutation.mutate({ id: p.id });
                          }}
                          className="text-white/40 hover:text-[oklch(0.55_0.20_25)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
