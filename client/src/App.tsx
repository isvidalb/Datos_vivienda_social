import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "@/pages/Home";
import MapPage from "@/pages/MapPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetail from "@/pages/ProjectDetail";
import PlansReguladoresPage from "@/pages/PlansReguladoresPage";
import RegionAnalysisPage from "@/pages/RegionAnalysisPage";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectForm from "@/pages/admin/AdminProjectForm";
import AdminPlans from "@/pages/admin/AdminPlans";
import AdminDashboard from "@/pages/admin/AdminDashboard";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/mapa" component={MapPage} />
      <Route path="/proyectos" component={ProjectsPage} />
      <Route path="/proyectos/:id" component={ProjectDetail} />
      <Route path="/planes-reguladores" component={PlansReguladoresPage} />
      <Route path="/regiones" component={RegionAnalysisPage} />

      {/* Admin routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/proyectos" component={AdminProjects} />
      <Route path="/admin/proyectos/nuevo" component={AdminProjectForm} />
      <Route path="/admin/proyectos/:id/editar" component={AdminProjectForm} />
      <Route path="/admin/planes" component={AdminPlans} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
