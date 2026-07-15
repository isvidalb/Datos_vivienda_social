import { useEffect, useRef, useState } from "react";
import PublicNav from "@/components/PublicNav";
import { MapView } from "@/components/Map";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Layers } from "lucide-react";

const PROGRAM_COLORS: Record<string, string> = {
  DS49: "#3b82f6",
  DS19: "#22c55e",
  DS10: "#8b5cf6",
  DS01: "#f59e0b",
  DS27: "#ef4444",
  DS255: "#ec4899",
};

declare global {
  interface Window {
    google?: typeof google;
  }
}

export default function MapPage() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [minInvestment, setMinInvestment] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const { data: projects } = trpc.projects.list.useQuery({
    programCode: selectedProgram !== "all" ? selectedProgram : undefined,
    regionCode: selectedRegion !== "all" ? selectedRegion : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    projectType: selectedType !== "all" ? selectedType : undefined,
    minInvestment: minInvestment ? Number(minInvestment) : undefined,
    search: searchTerm || undefined,
  });

  const { data: regions } = trpc.regions.list.useQuery();

  useEffect(() => {
    if (!mapRef.current || !window.google || !projects) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.map = null);
    markersRef.current = [];

    const map = mapRef.current;
    const bounds = new window.google.maps.LatLngBounds();

    projects.forEach(project => {
      const lat = parseFloat(project.lat);
      const lng = parseFloat(project.lng);
      if (isNaN(lat) || isNaN(lng)) return;

      const position = { lat, lng };
      bounds.extend(position);

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        title: project.name,
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family: sans-serif; min-width: 240px; padding: 8px;">
            <div style="font-weight: bold; font-size: 13px; margin-bottom: 4px; color: #1e3a5f;">
              ${project.name}
            </div>
            <div style="font-size: 11px; color: #666; margin-bottom: 6px;">
              ${project.comuna} · ${project.regionCode}
            </div>
            <div style="display: flex; gap: 4px; margin-bottom: 6px;">
              <span style="background: ${PROGRAM_COLORS[project.programCode] || '#666'}; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold;">${project.programCode}</span>
              <span style="background: #e5e7eb; color: #333; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${project.status}</span>
            </div>
            <div style="font-size: 11px; color: #333; line-height: 1.4;">
              <strong>Inversión:</strong> ${project.investmentUF || "N/A"} UF<br/>
              <strong>Viviendas:</strong> ${project.housingUnits || "N/A"}<br/>
              <strong>Beneficiarios:</strong> ${project.beneficiaries || "N/A"}<br/>
              <strong>Plan Regulador:</strong> ${project.planRegulador || "N/A"}
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open({ map, anchor: marker });
        setSelectedProject(project);
      });

      markersRef.current.push(marker);
    });

    if (markersRef.current.length > 0) {
      map.fitBounds(bounds, 60);
    }
  }, [projects]);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    // Enable satellite layer by default
    map.setMapTypeId("hybrid");
  };

  return (
    <div className="min-h-screen cad-grid-fine">
      <PublicNav />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-80 border-r border-white/10 bg-card/50 p-4 space-y-4 overflow-y-auto">
          <div>
            <div className="text-technical mb-2">FILTROS DE BÚSQUEDA</div>
            <div className="flex items-center gap-2 text-white/60 mb-3">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-bold text-white">Capas y Filtros</span>
            </div>
          </div>

          {/* Search */}
          <div className="space-y-1">
            <label className="text-technical">Buscar Proyecto</label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <Input
                placeholder="Nombre, comuna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-input border-white/10 text-white placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Program filter */}
          <div className="space-y-1">
            <label className="text-technical">Programa</label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="bg-input border-white/10 text-white">
                <SelectValue placeholder="Todos los programas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los programas</SelectItem>
                <SelectItem value="DS49">DS49 - Fondo Solidario</SelectItem>
                <SelectItem value="DS19">DS19 - Integración Social</SelectItem>
                <SelectItem value="DS10">DS10 - Habitabilidad Rural</SelectItem>
                <SelectItem value="DS01">DS01 - Arriendo</SelectItem>
                <SelectItem value="DS27">DS27 - Mejoramiento</SelectItem>
                <SelectItem value="DS255">DS255 - Vivienda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region filter */}
          <div className="space-y-1">
            <label className="text-technical">Región</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="bg-input border-white/10 text-white">
                <SelectValue placeholder="Todas las regiones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                {(regions || []).map(r => (
                  <SelectItem key={r.code} value={r.code}>{r.code} - {r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <label className="text-technical">Estado</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-input border-white/10 text-white">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="seleccionado">Seleccionado</SelectItem>
                <SelectItem value="en_ejecucion">En Ejecución</SelectItem>
                <SelectItem value="terminado">Terminado</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="por_iniciar">Por Iniciar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type filter */}
          <div className="space-y-1">
            <label className="text-technical">Tipo de Proyecto</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-input border-white/10 text-white">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="vivienda_nueva">Vivienda Nueva</SelectItem>
                <SelectItem value="mejoramiento">Mejoramiento</SelectItem>
                <SelectItem value="ampliacion">Ampliación</SelectItem>
                <SelectItem value="arriendo">Arriendo</SelectItem>
                <SelectItem value="densificacion">Densificación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min investment filter */}
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

          {/* Legend */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="text-technical">LEYENDA</div>
            {Object.entries(PROGRAM_COLORS).map(([code, color]) => (
              <div key={code} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-white/60 text-xs font-mono">{code}</span>
              </div>
            ))}
          </div>

          {/* Results count */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-technical">RESULTADOS</div>
            <div className="text-white font-bold text-2xl font-mono">{projects?.length || 0}</div>
            <div className="text-white/40 text-xs">proyectos encontrados</div>
          </div>

          {/* Selected project info */}
          {selectedProject && (
            <Card className="cad-border bg-popover p-3 space-y-2">
              <div className="text-technical">PROYECTO SELECCIONADO</div>
              <h4 className="text-white font-bold text-sm">{selectedProject.name}</h4>
              <div className="text-white/50 text-xs">{selectedProject.comuna} · {selectedProject.regionCode}</div>
              <div className="flex gap-1">
                <span className="cad-label" style={{ borderColor: PROGRAM_COLORS[selectedProject.programCode] || "#666" }}>
                  {selectedProject.programCode}
                </span>
                <span className="cad-label">{selectedProject.status}</span>
              </div>
              <div className="text-xs text-white/60 space-y-0.5">
                <div>Inversión: <span className="font-mono text-white/80">{selectedProject.investmentUF || "N/A"} UF</span></div>
                <div>Viviendas: <span className="font-mono text-white/80">{selectedProject.housingUnits || "N/A"}</span></div>
                <div>Densidad: <span className="font-mono text-white/80">{selectedProject.densityAllowed || "N/A"}</span></div>
                <div>Uso suelo: <span className="font-mono text-white/80">{selectedProject.landUse || "N/A"}</span></div>
              </div>
            </Card>
          )}
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            className="w-full h-full"
            initialCenter={{ lat: -33.4489, lng: -70.6693 }}
            initialZoom={5}
            onMapReady={handleMapReady}
          />
          {/* CAD overlay corners */}
          <div className="absolute top-2 left-2 cad-label z-10 pointer-events-none">
            <MapPin className="inline h-3 w-3 mr-1" />
            VISTA SATELITAL / CHILE
          </div>
          <div className="absolute bottom-2 right-2 text-dimension z-10 pointer-events-none">
            COORD: WGS84 · ZONA: 18S-19S
          </div>
        </div>
      </div>
    </div>
  );
}
