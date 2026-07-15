# Dashboard Vivienda Social Chile

Dashboard web interactivo de inteligencia inmobiliaria habitacional para Chile.
Cubierto por los programas DS49, DS19, DS10, DS01, DS27 y DS255 en las 16 regiones del país.

## Características

- **Mapa interactivo** con Google Maps (vista satelital) y marcadores georreferenciados
- **Portal público de consulta** con filtros por programa, región, estado, tipo y monto
- **Buscador en tiempo real** por región, comuna, programa o nombre de proyecto
- **Fichas de detalle** con inversión en UF, plan regulador, densidad, uso de suelo
- **Gráficos estadísticos** de inversión por región y programa
- **Planes reguladores comunales e intercomunales** por región
- **Panel administrativo protegido** (solo Ignacio Vidal)
- **Estética de plano arquitectónico técnico** (fondo azul royal + cuadrícula CAD)

## Tecnología

- React 19 + Tailwind CSS 4 + Express 4 + tRPC 11
- Google Maps API para georreferenciación
- MySQL/TiDB (Drizzle ORM)
- Manus OAuth para autenticación
- Vitest para testing

## Programas Cubiertos

| Código | Programa |
|--------|----------|
| DS49 | Fondo Solidario de Elección de Vivienda |
| DS19 | Integración Social y Territorial |
| DS10 | Habitabilidad Rural |
| DS01 | Subsidio de Arriendo |
| DS27 | Mejoramiento de Viviendas y Barrios |
| DS255 | Programa de Vivienda |

## Estructura

```
client/          → Frontend React (páginas, componentes, estilos)
server/          → Backend tRPC (routers, db, auth)
drizzle/         → Esquema y migraciones de base de datos
shared/          → Tipos y constantes compartidas
patches/         → Parches de dependencias
```

## Autor

**Ignacio Vidal** - Inteligencia Inmobiliaria Habitacional - Chile 2025-2026
