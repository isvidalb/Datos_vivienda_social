# Project TODO - Dashboard Vivienda Social Chile

## Base de Datos
- [x] Esquema: tabla `projects` (proyectos de vivienda social)
- [x] Esquema: tabla `regions` (16 regiones de Chile)
- [x] Esquema: tabla `programs` (DS49, DS19, DS10, DS01, DS27, DS255)
- [x] Esquema: tabla `plans_reguladores` (planes reguladores por comuna)
- [x] Esquema: tabla `stats_national` (estadísticas nacionales)
- [x] Migración SQL generada y aplicada
- [x] Seed de datos: todas las regiones
- [x] Seed de datos: programas con montos e inversión
- [x] Seed de datos: proyectos por región/programa
- [x] Seed de datos: planes reguladores por comuna

## Backend (tRPC)
- [x] Router público: `projects.list` con filtros (programa, región, estado, monto)
- [x] Router público: `projects.search` buscador en tiempo real
- [x] Router público: `projects.detail` ficha completa por proyecto
- [x] Router público: `stats.national` resumen nacional
- [x] Router público: `stats.byRegion` estadísticas por región
- [x] Router público: `stats.byProgram` estadísticas por programa
- [x] Router público: `plansReguladores.list` y `plansReguladores.byComuna`
- [x] Router admin: `projects.create` (adminProcedure)
- [x] Router admin: `projects.update` (adminProcedure)
- [x] Router admin: `projects.delete` (adminProcedure)
- [x] Router admin: `plansReguladores.create/update/delete` (adminProcedure)

## Frontend - Tema Visual
- [x] Estética plano arquitectónico técnico (fondo azul royal + cuadrícula)
- [x] Tipografía sans-serif blanca en negrita
- [x] Líneas técnicas blancas, marcos tipo CAD
- [x] Branding de Ignacio Vidal visible en interfaz pública
- [x] Logo placeholder para Ignacio Vidal

## Frontend - Portal Público
- [x] Layout público con navegación superior
- [x] Página inicio: resumen nacional con KPIs y gráficos
- [x] Mapa interactivo con Google Maps (vista satelital)
- [x] Marcadores georreferenciados por proyecto
- [x] Info window al clic en marcador con datos del proyecto
- [x] Filtros laterales: programa, región, tipo, monto, estado
- [x] Buscador en tiempo real
- [x] Ficha de detalle por proyecto (inversión UF, plan regulador, densidad, uso suelo)
- [x] Gráficos: barras inversión por región, torta por programa, indicadores clave
- [x] Página de planes reguladores por comuna
- [x] Página de análisis por región

## Frontend - Panel Administrativo
- [x] DashboardLayout adaptado con navegación admin
- [x] Protección de rutas admin (solo Ignacio Vidal)
- [x] CRUD proyectos: formulario crear/editar
- [x] CRUD planes reguladores: formulario crear/editar
- [x] Gestión de contenido del dashboard
- [x] Vista de lista de proyectos con acciones

## Pruebas
- [x] Vitest: tests de routers públicos (12 tests pasando)
- [x] Vitest: tests de routers admin (autorización)
- [x] Verificación visual en navegador (screenshot Home verificado)

## Correcciones
- [x] Corregir formato de investmentUF en Home.tsx (NaN → string formateado)
- [x] Corregir formato de investmentUF en ProjectsPage.tsx
- [x] Corregir formato de investmentUF en RegionAnalysisPage.tsx
- [x] Corregir error de tw-animate-css (removido por incompatibilidad)

## Por Verificar
- [ ] Navegación a /mapa (Google Maps requiere API key válida en runtime)
- [ ] Navegación a /admin (requiere login OAuth de Ignacio Vidal)
- [ ] Publicación del sitio (requiere checkpoint + click en Publish)
