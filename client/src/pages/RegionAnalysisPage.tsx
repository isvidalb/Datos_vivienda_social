import { useState } from "react";
import PublicNav from "@/components/PublicNav";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, TrendingUp, Building2, AlertTriangle } from "lucide-react";

export default function RegionAnalysisPage() {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const { data: regions } = trpc.regions.list.useQuery();
  const { data: byRegion } = trpc.stats.byRegion.useQuery();
  const { data: projects } = trpc.projects.list.useQuery(
    selectedRegion !== "all" ? { regionCode: selectedRegion } : {}
  );

  const regionInfo = regions?.find(r => r.code === selectedRegion);
  const regionProjects = (projects || []).filter(p => selectedRegion === "all" || p.regionCode === selectedRegion);
  const regionStat = (byRegion || []).find(s => s.regionCode === selectedRegion);

  const chartData = (byRegion || []).map(r => ({
    name: r.regionCode,
    proyectos: Number(r.totalProjects || 0),
    unidades: Number(r.totalUnits || 0),
    beneficiarios: Number(r.totalBeneficiaries || 0),
  }));

  return (
    <div className="min-h-screen cad-grid-fine">
      <PublicNav />

      <div className="border-b border-white/10 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="cad-label mb-2">ANÁLISIS TERRITORIAL / REGIONES</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Análisis por Región</h1>
          <p className="text-white/50 text-sm mt-1">
            Estadísticas de inversión, proyectos y déficit habitacional por región de Chile
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Region selector */}
        <Card className="cad-border bg-card p-4">
          <div className="flex items-center gap-3">
            <label className="text-technical">SELECCIONAR REGIÓN</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="bg-input border-white/10 text-white w-80"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones (Vista Nacional)</SelectItem>
                {(regions || []).map(r => (
                  <SelectItem key={r.code} value={r.code}>{r.code} - {r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* National chart */}
        {selectedRegion === "all" && (
          <Card className="cad-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">Proyectos y Unidades por Región</h3>
              <span className="text-technical">FIG. REGIONAL</span>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.24 0.09 250)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="proyectos" fill="oklch(0.55 0.18 250)" radius={[2, 2, 0, 0]} name="Proyectos" />
                <Bar dataKey="unidades" fill="oklch(0.65 0.18 200)" radius={[2, 2, 0, 0]} name="Unidades" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Region detail */}
        {selectedRegion !== "all" && regionInfo && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="cad-border bg-card p-3">
                <div className="text-technical mb-1">DÉFICIT CUANTITATIVO</div>
                <div className="text-white font-bold text-xl font-mono">{regionInfo.deficitCuantitativo?.toLocaleString("es-CL") || "—"}</div>
                <div className="text-white/40 text-[0.6rem]">viviendas</div>
              </Card>
              <Card className="cad-border bg-card p-3">
                <div className="text-technical mb-1">DÉFICIT CUALITATIVO</div>
                <div className="text-white font-bold text-xl font-mono">{regionInfo.deficitCualitativo?.toLocaleString("es-CL") || "—"}</div>
                <div className="text-white/40 text-[0.6rem]">viviendas</div>
              </Card>
              <Card className="cad-border bg-card p-3">
                <div className="text-technical mb-1">PROYECTOS</div>
                <div className="text-white font-bold text-xl font-mono">{regionProjects.length}</div>
                <div className="text-white/40 text-[0.6rem]">en la región</div>
              </Card>
              <Card className="cad-border bg-card p-3">
                <div className="text-technical mb-1">CAPITAL REGIONAL</div>
                <div className="text-white font-bold text-sm">{regionInfo.capital}</div>
                <div className="text-white/40 text-[0.6rem]">{regionInfo.isExtreme !== "no" ? `Zona extrema ${regionInfo.isExtreme}` : "Zona central"}</div>
              </Card>
            </div>

            {/* Projects list for region */}
            <Card className="cad-border bg-card p-4">
              <h3 className="text-white font-bold text-sm mb-3">Proyectos en {regionInfo.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase font-mono tracking-wider">
                      <th className="text-left py-2 px-3">Proyecto</th>
                      <th className="text-left py-2 px-3">Programa</th>
                      <th className="text-left py-2 px-3">Comuna</th>
                      <th className="text-left py-2 px-3">Estado</th>
                      <th className="text-right py-2 px-3">Inversión UF</th>
                      <th className="text-right py-2 px-3">Viviendas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionProjects.map(p => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-white/80 text-xs">{p.name}</td>
                        <td className="py-2 px-3"><span className="cad-label">{p.programCode}</span></td>
                        <td className="py-2 px-3 text-white/60 text-xs">{p.comuna}</td>
                        <td className="py-2 px-3 text-white/50 text-xs">{p.status}</td>
                        <td className="py-2 px-3 text-right text-white/60 font-mono text-xs">{p.investmentUF && p.investmentUF !== "0" ? p.investmentUF : "—"}</td>
                        <td className="py-2 px-3 text-right text-white/60 font-mono text-xs">{p.housingUnits || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
