import PublicNav from "@/components/PublicNav";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Building2, TrendingUp, AlertTriangle, MapPin, DollarSign, HomeIcon } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const PROGRAM_COLORS: Record<string, string> = {
  DS49: "oklch(0.65 0.18 200)",
  DS19: "oklch(0.60 0.15 160)",
  DS10: "oklch(0.55 0.18 250)",
  DS01: "oklch(0.70 0.15 80)",
  DS27: "oklch(0.50 0.20 25)",
  DS255: "oklch(0.45 0.12 300)",
};

export default function Home() {
  const { data: stats, isLoading } = trpc.stats.national.useQuery();
  const { data: byRegion } = trpc.stats.byRegion.useQuery();
  const { data: byProgram } = trpc.stats.byProgram.useQuery();
  const { data: programs } = trpc.programs.list.useQuery();

  const deficitCuant = stats?.find(s => s.label === "Déficit Cuantitativo");
  const deficitCual = stats?.find(s => s.label === "Déficit Cualitativo");
  const vividasPEH = stats?.find(s => s.label === "Viviendas Terminadas PEH");
  const enEjecucion = stats?.find(s => s.label === "Viviendas en Ejecución PEH");
  const inversionTotal = stats?.find(s => s.label === "Inversión Total 2025");

  const regionData = (byRegion || []).map(r => ({
    name: r.regionCode,
    proyectos: Number(r.totalProjects || 0),
    unidades: Number(r.totalUnits || 0),
    beneficiarios: Number(r.totalBeneficiaries || 0),
  }));

  const programData = (byProgram || []).map(p => ({
    name: p.programCode,
    proyectos: Number(p.totalProjects || 0),
    unidades: Number(p.totalUnits || 0),
  }));

  return (
    <div className="min-h-screen cad-grid-fine">
      <PublicNav />

      {/* Hero / Title block */}
      <div className="border-b border-white/10 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="cad-label">PLANO NACIONAL / 2025-2026</div>
            <div className="text-dimension">SCALE 1:500.000</div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Panorama de Mercado — Vivienda Social Chile
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            Inteligencia inmobiliaria habitacional: programas DS49, DS19, DS10, DS01, DS27 y DS255
            en las 16 regiones del país. Georreferenciación, normativa y análisis territorial.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KPICard icon={<HomeIcon className="h-4 w-4" />} label="Déficit Cuantitativo" value={deficitCuant?.value || "—"} unit="viviendas" />
          <KPICard icon={<Building2 className="h-4 w-4" />} label="Déficit Cualitativo" value={deficitCual?.value || "—"} unit="viviendas" />
          <KPICard icon={<TrendingUp className="h-4 w-4" />} label="Viviendas Entregadas PEH" value={vividasPEH?.value || "—"} unit="viviendas" />
          <KPICard icon={<MapPin className="h-4 w-4" />} label="En Ejecución PEH" value={enEjecucion?.value || "—"} unit="viviendas" />
          <KPICard icon={<DollarSign className="h-4 w-4" />} label="Inversión Total 2025" value={inversionTotal?.value || "—"} unit="UF" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar chart - projects & units by region */}
          <Card className="cad-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">Proyectos y Viviendas por Región</h3>
              <span className="text-technical">FIG. 01</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regionData}>
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
                <Bar dataKey="unidades" fill="oklch(0.60 0.15 160)" radius={[2, 2, 0, 0]} name="Viviendas" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie chart - projects by program */}
          <Card className="cad-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">Distribución por Programa</h3>
              <span className="text-technical">FIG. 02</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={programData}
                  dataKey="proyectos"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(e: any) => e.name}
                  labelLine={{ stroke: "rgba(255,255,255,0.3)" }}
                >
                  {programData.map((entry, idx) => (
                    <Cell key={idx} fill={PROGRAM_COLORS[entry.name] || "oklch(0.5 0.15 250)"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.24 0.09 250)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Programs summary table */}
        <Card className="cad-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm">Programas Habitacionales Vigentes</h3>
            <span className="text-technical">TABLA 01</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-xs uppercase font-mono tracking-wider">
                  <th className="text-left py-2 px-3">Código</th>
                  <th className="text-left py-2 px-3">Programa</th>
                  <th className="text-right py-2 px-3">Subsidio Máx.</th>
                  <th className="text-right py-2 px-3">Inversión 2025</th>
                  <th className="text-right py-2 px-3">Viviendas</th>
                  <th className="text-right py-2 px-3">Beneficiarios</th>
                </tr>
              </thead>
              <tbody>
                {(programs || []).map(p => (
                  <tr key={p.code} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2 px-3">
                      <span className="cad-label">{p.code}</span>
                    </td>
                    <td className="py-2 px-3 text-white/80">{p.name}</td>
                    <td className="py-2 px-3 text-right text-white/60 font-mono">{p.maxSubsidyUF} UF</td>
                    <td className="py-2 px-3 text-right text-white/60 font-mono">{p.investment2025UF && p.investment2025UF !== "0" ? p.investment2025UF : "—"} UF</td>
                    <td className="py-2 px-3 text-right text-white/60 font-mono">{p.housingUnits2025?.toLocaleString("es-CL") || "—"}</td>
                    <td className="py-2 px-3 text-right text-white/60 font-mono">{p.beneficiaries2025?.toLocaleString("es-CL") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Risk warning */}
        <Card className="cad-border bg-card p-4 border-l-2 border-l-[oklch(0.55_0.20_25)]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[oklch(0.55_0.20_25)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-bold text-sm mb-1">Riesgos Críticos Identificados</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Crisis financiera del MINVU con deudas superiores a US$1.000 millones.
                Reducción presupuestaria de $421 mil millones para 2026. Disminución de subsidios
                de ~50.000 a 19.000 anuales. Incertidumbre regulatoria en planes reguladores en actualización.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 text-center">
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider">
            Ignacio Vidal · Inteligencia Inmobiliaria Habitacional · Chile 2025-2026
          </p>
        </footer>
      </main>
    </div>
  );
}

function KPICard({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) {
  return (
    <Card className="cad-border bg-card p-3 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-white/40">
        {icon}
        <span className="text-[0.6rem] uppercase tracking-wider font-mono">{label}</span>
      </div>
      <span className="text-white font-bold text-lg font-mono">{value}</span>
      <span className="text-white/40 text-[0.6rem] uppercase tracking-wider">{unit}</span>
    </Card>
  );
}
