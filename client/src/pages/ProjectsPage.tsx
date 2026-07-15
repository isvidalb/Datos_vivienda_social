import { useState } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Building2, Eye } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  seleccionado: "Seleccionado",
  en_ejecucion: "En Ejecución",
  terminado: "Terminado",
  entregado: "Entregado",
  por_iniciar: "Por Iniciar",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("all");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [projectType, setProjectType] = useState("all");
  const [minInvestment, setMinInvestment] = useState("");

  const { data: projects, isLoading } = trpc.projects.list.useQuery({
    programCode: program !== "all" ? program : undefined,
    regionCode: region !== "all" ? region : undefined,
    status: status !== "all" ? status : undefined,
    projectType: projectType !== "all" ? projectType : undefined,
    minInvestment: minInvestment ? Number(minInvestment) : undefined,
    search: search || undefined,
  });
  const { data: regions } = trpc.regions.list.useQuery();

  return (
    <div className="min-h-screen cad-grid-fine">
      <PublicNav />

      <div className="border-b border-white/10 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="cad-label mb-2">CATÁLOGO / PROYECTOS</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Proyectos de Vivienda Social</h1>
          <p className="text-white/50 text-sm mt-1">
            {projects?.length || 0} proyectos georreferenciados en las 16 regiones de Chile
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Filters */}
        <Card className="cad-border bg-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="space-y-1">
              <label className="text-technical">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  placeholder="Nombre o comuna..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 bg-input border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-technical">Programa</label>
              <Select value={program} onValueChange={setProgram}>
                <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="DS49">DS49</SelectItem>
                  <SelectItem value="DS19">DS19</SelectItem>
                  <SelectItem value="DS10">DS10</SelectItem>
                  <SelectItem value="DS01">DS01</SelectItem>
                  <SelectItem value="DS27">DS27</SelectItem>
                  <SelectItem value="DS255">DS255</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-technical">Región</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {(regions || []).map(r => (
                    <SelectItem key={r.code} value={r.code}>{r.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-technical">Estado</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="seleccionado">Seleccionado</SelectItem>
                  <SelectItem value="en_ejecucion">En Ejecución</SelectItem>
                  <SelectItem value="terminado">Terminado</SelectItem>
                  <SelectItem value="entregado">Entregado</SelectItem>
                  <SelectItem value="por_iniciar">Por Iniciar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-technical">Tipo</label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="vivienda_nueva">Vivienda Nueva</SelectItem>
                  <SelectItem value="mejoramiento">Mejoramiento</SelectItem>
                  <SelectItem value="ampliacion">Ampliación</SelectItem>
                  <SelectItem value="arriendo">Arriendo</SelectItem>
                  <SelectItem value="densificacion">Densificación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-technical">Inversión Mín. (UF)</label>
              <Input
                type="number"
                placeholder="Ej: 5000"
                value={minInvestment}
                onChange={(e) => setMinInvestment(e.target.value)}
                className="bg-input border-white/10 text-white placeholder:text-white/30"
              />
            </div>
          </div>
        </Card>

        {/* Projects table */}
        <Card className="cad-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm">Listado de Proyectos</h3>
            <span className="text-technical">TABLA PROYECTOS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-xs uppercase font-mono tracking-wider">
                  <th className="text-left py-2 px-3">Proyecto</th>
                  <th className="text-left py-2 px-3">Programa</th>
                  <th className="text-left py-2 px-3">Región</th>
                  <th className="text-left py-2 px-3">Comuna</th>
                  <th className="text-left py-2 px-3">Estado</th>
                  <th className="text-right py-2 px-3">Inversión UF</th>
                  <th className="text-right py-2 px-3">Viviendas</th>
                  <th className="text-center py-2 px-3">Ficha</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="text-center py-8 text-white/40">Cargando proyectos...</td></tr>
                ) : (projects || []).length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-white/40">No se encontraron proyectos con los filtros seleccionados</td></tr>
                ) : (
                  (projects || []).map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 px-3 text-white/80 max-w-xs truncate">{p.name}</td>
                      <td className="py-2 px-3"><span className="cad-label">{p.programCode}</span></td>
                      <td className="py-2 px-3 text-white/60 font-mono text-xs">{p.regionCode}</td>
                      <td className="py-2 px-3 text-white/60">{p.comuna}</td>
                      <td className="py-2 px-3">
                        <span className="text-xs text-white/50">{STATUS_LABELS[p.status] || p.status}</span>
                      </td>
                      <td className="py-2 px-3 text-right text-white/60 font-mono text-xs">{p.investmentUF && p.investmentUF !== "0" ? p.investmentUF : "—"}</td>
                      <td className="py-2 px-3 text-right text-white/60 font-mono text-xs">{p.housingUnits || "—"}</td>
                      <td className="py-2 px-3 text-center">
                        <Link href={`/proyectos/${p.id}`}>
                          <button className="text-white/40 hover:text-white transition-colors">
                            <Eye className="h-4 w-4 inline" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
