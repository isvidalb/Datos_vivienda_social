import { useState } from "react";
import PublicNav from "@/components/PublicNav";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function PlansReguladoresPage() {
  const [region, setRegion] = useState("all");
  const { data: plans } = trpc.plansReguladores.list.useQuery();
  const { data: regions } = trpc.regions.list.useQuery();

  const filteredPlans = (plans || []).filter(p => region === "all" || p.regionCode === region);

  const aptIcon = (apt: string) => {
    if (apt === "si") return <CheckCircle className="h-4 w-4 text-[oklch(0.60_0.15_160)]" />;
    if (apt === "no") return <XCircle className="h-4 w-4 text-[oklch(0.55_0.20_25)]" />;
    return <AlertCircle className="h-4 w-4 text-[oklch(0.70_0.15_80)]" />;
  };

  const aptLabel = (apt: string) => {
    if (apt === "si") return "Apto";
    if (apt === "no") return "No Apto";
    return "Condicionado";
  };

  return (
    <div className="min-h-screen cad-grid-fine">
      <PublicNav />

      <div className="border-b border-white/10 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="cad-label mb-2">NORMATIVA / PLANES REGULADORES</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Planes Reguladores Comunales e Intercomunales</h1>
          <p className="text-white/50 text-sm mt-1">
            Instrumentos de Planificación Territorial (IPT) por región y comuna — uso de suelo, densidad y aptitud habitacional
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <Card className="cad-border bg-card p-4">
          <div className="flex items-center gap-3">
            <label className="text-technical">FILTRAR POR REGIÓN</label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="bg-input border-white/10 text-white w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                {(regions || []).map(r => (
                  <SelectItem key={r.code} value={r.code}>{r.code} - {r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPlans.map(plan => (
            <Card key={plan.id} className="cad-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight">{plan.name}</h3>
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {plan.comuna} · {plan.regionCode}
                  </p>
                </div>
                <span className="cad-label">{plan.type}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40 font-mono uppercase text-[0.6rem]">Estado</span>
                  <span className="text-white/70">{plan.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 font-mono uppercase text-[0.6rem]">Densidad Máx.</span>
                  <span className="text-white/70 font-mono">{plan.densityMax || "N/A"} hab/ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 font-mono uppercase text-[0.6rem]">Densidad Mín.</span>
                  <span className="text-white/70 font-mono">{plan.densityMin || "N/A"} hab/ha</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-technical">USOS PERMITIDOS</div>
                <p className="text-white/60 text-xs leading-relaxed">{plan.landUsePermitted || "N/A"}</p>
              </div>

              {plan.landUseConditional && (
                <div className="space-y-1">
                  <div className="text-technical">USOS CONDICIONADOS</div>
                  <p className="text-white/60 text-xs leading-relaxed">{plan.landUseConditional}</p>
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                {aptIcon(plan.aptForHousing)}
                <span className="text-xs text-white/70 font-mono uppercase tracking-wider">
                  {aptLabel(plan.aptForHousing)} para vivienda
                </span>
              </div>

              {plan.notes && (
                <p className="text-white/40 text-[0.65rem] italic pt-1">{plan.notes}</p>
              )}
            </Card>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12 text-white/40">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No hay planes reguladores para los filtros seleccionados
          </div>
        )}
      </main>
    </div>
  );
}
