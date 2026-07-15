import { Link, useParams } from "wouter";
import PublicNav from "@/components/PublicNav";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { MapView } from "@/components/Map";
import { useEffect, useRef } from "react";
import { ArrowLeft, MapPin, DollarSign, Building2, FileText, Ruler, AlertCircle } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const projectId = parseInt(id || "0");
  const { data: project, isLoading } = trpc.projects.byId.useQuery({ id: projectId });
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !project || !window.google) return;
    const lat = parseFloat(project.lat);
    const lng = parseFloat(project.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    mapRef.current.setCenter({ lat, lng });
    mapRef.current.setZoom(15);
    mapRef.current.setMapTypeId("hybrid");

    new window.google.maps.marker.AdvancedMarkerElement({
      map: mapRef.current,
      position: { lat, lng },
      title: project.name,
    });
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen cad-grid-fine">
        <PublicNav />
        <div className="flex items-center justify-center h-96 text-white/40">Cargando ficha...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen cad-grid-fine">
        <PublicNav />
        <div className="flex flex-col items-center justify-center h-96 text-white/40">
          <p>Proyecto no encontrado</p>
          <Link href="/proyectos" className="cad-label mt-4 hover:bg-white/10">Volver a proyectos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cad-grid-fine">
      <PublicNav />

      <div className="border-b border-white/10 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/proyectos" className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-mono uppercase tracking-wider mb-3">
            <ArrowLeft className="h-3 w-3" /> Volver al listado
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="cad-label">{project.programCode}</span>
            <span className="cad-label">{project.status}</span>
            <span className="cad-label">{project.projectType}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{project.name}</h1>
          <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {project.comuna}, Región {project.regionCode}
            {project.address && ` · ${project.address}`}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map */}
          <Card className="cad-border bg-card p-0 overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Ubicación Georreferenciada
              </h3>
              <span className="text-technical">VISTA SATELITAL</span>
            </div>
            <MapView
              className="w-full h-[400px]"
              initialCenter={{ lat: parseFloat(project.lat) || -33.4489, lng: parseFloat(project.lng) || -70.6693 }}
              initialZoom={15}
              onMapReady={(map) => { mapRef.current = map; }}
            />
          </Card>

          {/* Investment data */}
          <div className="space-y-4">
            <Card className="cad-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Inversión
                </h3>
                <span className="text-technical">UF</span>
              </div>
              <div className="space-y-2">
                <DataRow label="Inversión Total" value={`${project.investmentUF || "N/A"} UF`} />
                <DataRow label="Viviendas" value={project.housingUnits?.toString() || "N/A"} />
                <DataRow label="Beneficiarios" value={project.beneficiaries?.toString() || "N/A"} />
                <DataRow label="Entidad Patrocinante" value={project.entityPatrocinante || "N/A"} />
                <DataRow label="SERVIU" value={project.serviu || "N/A"} />
              </div>
            </Card>

            <Card className="cad-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Plan Regulador
                </h3>
                <span className="text-technical">NORMATIVA</span>
              </div>
              <div className="space-y-2">
                <DataRow label="Plan Regulador" value={project.planRegulador || "N/A"} />
                <DataRow label="Densidad Permitida" value={project.densityAllowed || "N/A"} />
                <DataRow label="Uso de Suelo" value={project.landUse || "N/A"} />
                <DataRow label="Zonificación" value={project.zoning || "N/A"} />
              </div>
            </Card>
          </div>
        </div>

        {/* Normative and restrictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="cad-border bg-card p-4 space-y-2">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <Ruler className="h-4 w-4" /> Normativa Aplicable
            </h3>
            <p className="text-white/60 text-xs leading-relaxed">{project.normative || "Sin normativa específica registrada."}</p>
          </Card>

          <Card className="cad-border bg-card p-4 space-y-2 border-l-2 border-l-[oklch(0.55_0.20_25)]">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-[oklch(0.55_0.20_25)]" /> Restricciones
            </h3>
            <p className="text-white/60 text-xs leading-relaxed">{project.restrictions || "Sin restricciones registradas."}</p>
          </Card>
        </div>

        {/* Timeline and notes */}
        <Card className="cad-border bg-card p-4 space-y-3">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Cronograma y Notas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <DataRow label="Fecha Inicio" value={project.startDate || "N/A"} />
            <DataRow label="Fecha Término" value={project.endDate || "N/A"} />
            <DataRow label="Estado" value={project.status} />
          </div>
          {project.notes && (
            <div className="pt-2 border-t border-white/10">
              <div className="text-technical mb-1">NOTAS</div>
              <p className="text-white/60 text-xs leading-relaxed">{project.notes}</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-white/40 uppercase tracking-wider font-mono text-[0.65rem]">{label}</span>
      <span className="text-white/80 font-mono text-right">{value}</span>
    </div>
  );
}
