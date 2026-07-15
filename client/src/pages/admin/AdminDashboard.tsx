import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Building2, FileText, BarChart3, PlusCircle, List } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { data: projects } = trpc.projects.list.useQuery({});
  const { data: plans } = trpc.plansReguladores.list.useQuery();
  const { data: stats } = trpc.stats.national.useQuery();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-white/40">
        Cargando panel...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white/60 gap-4">
        <p className="text-lg">Acceso restringido</p>
        <p className="text-sm text-white/40">Solo Ignacio Vidal puede acceder al panel administrativo</p>
        <a href="/api/oauth/login" className="cad-label hover:bg-white/10">Iniciar sesión</a>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard Administrativo</h1>
          <p className="text-white/50 text-sm">Gestión de proyectos, planes reguladores y contenido del portal</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="cad-border bg-card p-4">
            <div className="text-technical mb-1">PROYECTOS TOTALES</div>
            <div className="text-white font-bold text-2xl font-mono">{projects?.length || 0}</div>
          </Card>
          <Card className="cad-border bg-card p-4">
            <div className="text-technical mb-1">PLANES REGULADORES</div>
            <div className="text-white font-bold text-2xl font-mono">{plans?.length || 0}</div>
          </Card>
          <Card className="cad-border bg-card p-4">
            <div className="text-technical mb-1">INDICADORES NACIONALES</div>
            <div className="text-white font-bold text-2xl font-mono">{stats?.length || 0}</div>
          </Card>
          <Card className="cad-border bg-card p-4">
            <div className="text-technical mb-1">USUARIO</div>
            <div className="text-white font-bold text-sm">{user.name || "Ignacio Vidal"}</div>
            <div className="text-white/40 text-xs">Administrador</div>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/proyectos">
            <Card className="cad-border bg-card p-6 hover:bg-white/5 transition-colors cursor-pointer">
              <Building2 className="h-8 w-8 text-white/60 mb-3" />
              <h3 className="text-white font-bold text-lg">Gestionar Proyectos</h3>
              <p className="text-white/50 text-sm mt-1">Crear, editar y eliminar proyectos de vivienda social</p>
            </Card>
          </Link>
          <Link href="/admin/planes">
            <Card className="cad-border bg-card p-6 hover:bg-white/5 transition-colors cursor-pointer">
              <FileText className="h-8 w-8 text-white/60 mb-3" />
              <h3 className="text-white font-bold text-lg">Gestionar Planes Reguladores</h3>
              <p className="text-white/50 text-sm mt-1">Administrar IPT por comuna y región</p>
            </Card>
          </Link>
        </div>

        {/* Recent projects */}
        <Card className="cad-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm">Proyectos Recientes</h3>
            <Link href="/admin/proyectos/nuevo">
              <button className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white">
                <PlusCircle className="h-3 w-3" /> Nuevo Proyecto
              </button>
            </Link>
          </div>
          <div className="space-y-2">
            {(projects || []).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <span className="text-white/80 text-sm">{p.name}</span>
                  <span className="text-white/40 text-xs ml-2">{p.comuna} · {p.regionCode}</span>
                </div>
                <span className="cad-label">{p.programCode}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
