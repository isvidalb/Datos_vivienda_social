import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const PROGRAMS = ["DS49", "DS19", "DS10", "DS01", "DS27", "DS255"];
const STATUSES = ["seleccionado", "en_ejecucion", "terminado", "entregado", "por_iniciar"];
const TYPES = ["vivienda_nueva", "mejoramiento", "ampliacion", "arriendo", "densificacion"];

export default function AdminProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const projectId = parseInt(id || "0");
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: regions } = trpc.regions.list.useQuery();
  const { data: existing } = trpc.projects.byId.useQuery({ id: projectId }, { enabled: isEdit });

  const [form, setForm] = useState({
    name: "", programCode: "DS49", regionCode: "RM", comuna: "", address: "",
    lat: "-33.4489", lng: "-70.6693", status: "seleccionado", projectType: "vivienda_nueva",
    investmentUF: "", housingUnits: 0, beneficiaries: 0, entityPatrocinante: "",
    serviu: "", planRegulador: "", densityAllowed: "", landUse: "", zoning: "",
    restrictions: "", normative: "", startDate: "", endDate: "", notes: "",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || "", programCode: existing.programCode, regionCode: existing.regionCode,
        comuna: existing.comuna, address: existing.address || "", lat: existing.lat, lng: existing.lng,
        status: existing.status, projectType: existing.projectType, investmentUF: existing.investmentUF || "",
        housingUnits: existing.housingUnits || 0, beneficiaries: existing.beneficiaries || 0,
        entityPatrocinante: existing.entityPatrocinante || "", serviu: existing.serviu || "",
        planRegulador: existing.planRegulador || "", densityAllowed: existing.densityAllowed || "",
        landUse: existing.landUse || "", zoning: existing.zoning || "", restrictions: existing.restrictions || "",
        normative: existing.normative || "", startDate: existing.startDate || "",
        endDate: existing.endDate || "", notes: existing.notes || "",
      });
    }
  }, [existing]);

  const createMut = trpc.projects.create.useMutation({
    onSuccess: () => { toast.success("Proyecto creado"); utils.projects.list.invalidate(); window.location.href = "/admin/proyectos"; },
    onError: () => toast.error("Error al crear"),
  });
  const updateMut = trpc.projects.update.useMutation({
    onSuccess: () => { toast.success("Proyecto actualizado"); utils.projects.list.invalidate(); window.location.href = "/admin/proyectos"; },
    onError: () => toast.error("Error al actualizar"),
  });

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white/40">Cargando...</div>;
  if (!user || user.role !== "admin") {
    return <div className="flex flex-col items-center justify-center min-h-screen text-white/60 gap-4"><p>Acceso restringido</p><a href="/api/oauth/login" className="cad-label">Iniciar sesión</a></div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, housingUnits: Number(form.housingUnits), beneficiaries: Number(form.beneficiaries), status: form.status as any, projectType: form.projectType as any };
    if (isEdit) {
      updateMut.mutate({ id: projectId, ...payload });
    } else {
      createMut.mutate(payload);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 max-w-4xl">
        <div>
          <Link href="/admin/proyectos" className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-mono uppercase mb-3">
            <ArrowLeft className="h-3 w-3" /> Volver
          </Link>
          <h1 className="text-2xl font-bold text-white">{isEdit ? "Editar Proyecto" : "Nuevo Proyecto"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="cad-border bg-card p-4 space-y-3">
            <h3 className="text-white font-bold text-sm">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label className="text-technical">Nombre *</Label><Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Comuna *</Label><Input required value={form.comuna} onChange={e => setForm({...form, comuna: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div>
                <Label className="text-technical">Programa</Label>
                <Select value={form.programCode} onValueChange={v => setForm({...form, programCode: v})}>
                  <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{PROGRAMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-technical">Región</Label>
                <Select value={form.regionCode} onValueChange={v => setForm({...form, regionCode: v})}>
                  <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{(regions || []).map(r => <SelectItem key={r.code} value={r.code}>{r.code} - {r.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-technical">Estado</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-technical">Tipo</Label>
                <Select value={form.projectType} onValueChange={v => setForm({...form, projectType: v})}>
                  <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="cad-border bg-card p-4 space-y-3">
            <h3 className="text-white font-bold text-sm">Ubicación Georreferenciada</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><Label className="text-technical">Dirección</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Latitud *</Label><Input required value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} className="bg-input border-white/10 text-white font-mono" /></div>
              <div><Label className="text-technical">Longitud *</Label><Input required value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} className="bg-input border-white/10 text-white font-mono" /></div>
            </div>
          </Card>

          <Card className="cad-border bg-card p-4 space-y-3">
            <h3 className="text-white font-bold text-sm">Inversión y Beneficiarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div><Label className="text-technical">Inversión (UF)</Label><Input value={form.investmentUF} onChange={e => setForm({...form, investmentUF: e.target.value})} className="bg-input border-white/10 text-white font-mono" /></div>
              <div><Label className="text-technical">Viviendas</Label><Input type="number" value={form.housingUnits} onChange={e => setForm({...form, housingUnits: Number(e.target.value)})} className="bg-input border-white/10 text-white font-mono" /></div>
              <div><Label className="text-technical">Beneficiarios</Label><Input type="number" value={form.beneficiaries} onChange={e => setForm({...form, beneficiaries: Number(e.target.value)})} className="bg-input border-white/10 text-white font-mono" /></div>
              <div><Label className="text-technical">Entidad Patrocinante</Label><Input value={form.entityPatrocinante} onChange={e => setForm({...form, entityPatrocinante: e.target.value})} className="bg-input border-white/10 text-white" /></div>
            </div>
          </Card>

          <Card className="cad-border bg-card p-4 space-y-3">
            <h3 className="text-white font-bold text-sm">Plan Regulador y Normativa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label className="text-technical">Plan Regulador</Label><Input value={form.planRegulador} onChange={e => setForm({...form, planRegulador: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Densidad Permitida</Label><Input value={form.densityAllowed} onChange={e => setForm({...form, densityAllowed: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Uso de Suelo</Label><Input value={form.landUse} onChange={e => setForm({...form, landUse: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Zonificación</Label><Input value={form.zoning} onChange={e => setForm({...form, zoning: e.target.value})} className="bg-input border-white/10 text-white" /></div>
            </div>
            <div><Label className="text-technical">Restricciones</Label><Textarea value={form.restrictions} onChange={e => setForm({...form, restrictions: e.target.value})} className="bg-input border-white/10 text-white" /></div>
            <div><Label className="text-technical">Normativa Aplicable</Label><Textarea value={form.normative} onChange={e => setForm({...form, normative: e.target.value})} className="bg-input border-white/10 text-white" /></div>
          </Card>

          <Card className="cad-border bg-card p-4 space-y-3">
            <h3 className="text-white font-bold text-sm">Cronograma y Notas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label className="text-technical">Fecha Inicio</Label><Input value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Fecha Término</Label><Input value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="bg-input border-white/10 text-white" /></div>
            </div>
            <div><Label className="text-technical">Notas</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="bg-input border-white/10 text-white" /></div>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" className="flex items-center gap-2"><Save className="h-4 w-4" /> {isEdit ? "Actualizar" : "Crear"} Proyecto</Button>
            <Link href="/admin/proyectos"><Button type="button" variant="outline">Cancelar</Button></Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
