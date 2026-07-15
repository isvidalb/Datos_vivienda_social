import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { PlusCircle, Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner";

const PLAN_TYPES = ["comunal", "intercomunal", "metropolitano", "seccional"];
const PLAN_STATUSES = ["vigente", "en_revision", "en_actualizacion", "propuesto"];
const APT_OPTIONS = ["si", "no", "condicionado"];

export default function AdminPlans() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: plans } = trpc.plansReguladores.list.useQuery();
  const { data: regions } = trpc.regions.list.useQuery();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", type: "comunal", regionCode: "RM", comuna: "", status: "vigente",
    densityMax: "", densityMin: "", landUsePermitted: "", landUseConditional: "",
    landUseProhibited: "", restrictions: "", aptForHousing: "si", notes: "",
  });

  const createMut = trpc.plansReguladores.create.useMutation({
    onSuccess: () => { toast.success("Plan creado"); utils.plansReguladores.list.invalidate(); resetForm(); },
    onError: () => toast.error("Error"),
  });
  const updateMut = trpc.plansReguladores.update.useMutation({
    onSuccess: () => { toast.success("Plan actualizado"); utils.plansReguladores.list.invalidate(); resetForm(); },
    onError: () => toast.error("Error"),
  });
  const deleteMut = trpc.plansReguladores.delete.useMutation({
    onSuccess: () => { toast.success("Plan eliminado"); utils.plansReguladores.list.invalidate(); },
    onError: () => toast.error("Error"),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", type: "comunal", regionCode: "RM", comuna: "", status: "vigente",
      densityMax: "", densityMin: "", landUsePermitted: "", landUseConditional: "",
      landUseProhibited: "", restrictions: "", aptForHousing: "si", notes: "" });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white/40">Cargando...</div>;
  if (!user || user.role !== "admin") {
    return <div className="flex flex-col items-center justify-center min-h-screen text-white/60 gap-4"><p>Acceso restringido</p><a href="/api/oauth/login" className="cad-label">Iniciar sesión</a></div>;
  }

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setShowForm(true);
    setForm({
      name: p.name, type: p.type, regionCode: p.regionCode, comuna: p.comuna, status: p.status,
      densityMax: p.densityMax || "", densityMin: p.densityMin || "",
      landUsePermitted: p.landUsePermitted || "", landUseConditional: p.landUseConditional || "",
      landUseProhibited: p.landUseProhibited || "", restrictions: p.restrictions || "",
      aptForHousing: p.aptForHousing, notes: p.notes || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, type: form.type as any, status: form.status as any, aptForHousing: form.aptForHousing as any };
    if (editingId) {
      updateMut.mutate({ id: editingId, ...payload });
    } else {
      createMut.mutate(payload);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Planes Reguladores</h1>
            <p className="text-white/50 text-sm">Gestionar IPT por comuna y región</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Nuevo Plan
          </Button>
        </div>

        {showForm && (
          <Card className="cad-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">{editingId ? "Editar Plan" : "Nuevo Plan Regulador"}</h3>
              <button onClick={resetForm} className="text-white/40 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label className="text-technical">Nombre *</Label><Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-input border-white/10 text-white" /></div>
                <div><Label className="text-technical">Comuna *</Label><Input required value={form.comuna} onChange={e => setForm({...form, comuna: e.target.value})} className="bg-input border-white/10 text-white" /></div>
                <div>
                  <Label className="text-technical">Tipo</Label>
                  <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                    <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{PLAN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
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
                    <SelectContent>{PLAN_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-technical">Apto para Vivienda</Label>
                  <Select value={form.aptForHousing} onValueChange={v => setForm({...form, aptForHousing: v})}>
                    <SelectTrigger className="bg-input border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{APT_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-technical">Densidad Máx.</Label><Input value={form.densityMax} onChange={e => setForm({...form, densityMax: e.target.value})} className="bg-input border-white/10 text-white" /></div>
                <div><Label className="text-technical">Densidad Mín.</Label><Input value={form.densityMin} onChange={e => setForm({...form, densityMin: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              </div>
              <div><Label className="text-technical">Usos Permitidos</Label><Textarea value={form.landUsePermitted} onChange={e => setForm({...form, landUsePermitted: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Usos Condicionados</Label><Textarea value={form.landUseConditional} onChange={e => setForm({...form, landUseConditional: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Usos Prohibidos</Label><Textarea value={form.landUseProhibited} onChange={e => setForm({...form, landUseProhibited: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Restricciones</Label><Textarea value={form.restrictions} onChange={e => setForm({...form, restrictions: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <div><Label className="text-technical">Notas</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="bg-input border-white/10 text-white" /></div>
              <Button type="submit" className="flex items-center gap-2">{editingId ? "Actualizar" : "Crear"}</Button>
            </form>
          </Card>
        )}

        <Card className="cad-border bg-card p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-xs uppercase font-mono tracking-wider">
                  <th className="text-left py-2 px-3">Nombre</th>
                  <th className="text-left py-2 px-3">Tipo</th>
                  <th className="text-left py-2 px-3">Región</th>
                  <th className="text-left py-2 px-3">Comuna</th>
                  <th className="text-left py-2 px-3">Estado</th>
                  <th className="text-left py-2 px-3">Apto</th>
                  <th className="text-center py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(plans || []).map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3 text-white/80 text-xs max-w-xs truncate">{p.name}</td>
                    <td className="py-2 px-3"><span className="cad-label">{p.type}</span></td>
                    <td className="py-2 px-3 text-white/60 font-mono text-xs">{p.regionCode}</td>
                    <td className="py-2 px-3 text-white/60 text-xs">{p.comuna}</td>
                    <td className="py-2 px-3 text-white/50 text-xs">{p.status}</td>
                    <td className="py-2 px-3 text-white/50 text-xs">{p.aptForHousing}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => startEdit(p)} className="text-white/40 hover:text-white"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => { if (confirm(`¿Eliminar "${p.name}"?`)) deleteMut.mutate({ id: p.id }); }} className="text-white/40 hover:text-[oklch(0.55_0.20_25)]"><Trash2 className="h-4 w-4" /></button>
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
