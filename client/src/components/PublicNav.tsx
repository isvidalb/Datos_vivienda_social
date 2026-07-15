import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Building2, Map, FileText, BarChart3, LayoutGrid, LogIn, LogOut } from "lucide-react";

export default function PublicNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[oklch(0.20_0.10_250)]/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo / Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center border border-white/30 rounded-sm bg-white/5">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-sm tracking-wide">IGNACIO VIDAL</span>
            <span className="text-white/50 text-[0.6rem] uppercase tracking-[0.2em] font-mono">Inteligencia Inmobiliaria</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" icon={<LayoutGrid className="h-4 w-4" />} label="Resumen" />
          <NavLink href="/mapa" icon={<Map className="h-4 w-4" />} label="Mapa" />
          <NavLink href="/proyectos" icon={<Building2 className="h-4 w-4" />} label="Proyectos" />
          <NavLink href="/planes-reguladores" icon={<FileText className="h-4 w-4" />} label="Planes Reguladores" />
          <NavLink href="/regiones" icon={<BarChart3 className="h-4 w-4" />} label="Análisis Regional" />
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {isAuthenticated && isAdmin ? (
            <>
              <Link href="/admin" className="cad-label hover:bg-white/10 transition-colors">
                Panel Admin
              </Link>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
              >
                <LogOut className="h-3 w-3" />
                Salir
              </button>
            </>
          ) : (
            <a
              href="/api/oauth/login"
              className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <LogIn className="h-3 w-3" />
              Acceso
            </a>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        <NavLink href="/" icon={<LayoutGrid className="h-3 w-3" />} label="Resumen" />
        <NavLink href="/mapa" icon={<Map className="h-3 w-3" />} label="Mapa" />
        <NavLink href="/proyectos" icon={<Building2 className="h-3 w-3" />} label="Proyectos" />
        <NavLink href="/planes-reguladores" icon={<FileText className="h-3 w-3" />} label="Planes" />
        <NavLink href="/regiones" icon={<BarChart3 className="h-3 w-3" />} label="Regiones" />
      </nav>
    </header>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 rounded-sm transition-colors whitespace-nowrap"
    >
      {icon}
      {label}
    </Link>
  );
}
