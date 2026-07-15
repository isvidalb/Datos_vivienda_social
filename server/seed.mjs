// Seed script - populate database with initial data
// Run with: node server/seed.mjs
import mysql from 'mysql2/promise';
import 'dotenv/config';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

/* ── REGIONS ── */
const regionsData = [
  ['XV', 'Arica y Parinacota', 'Arica', '-18.4783', '-70.3126', 'norte', 8500, 18000],
  ['I', 'Tarapacá', 'Iquique', '-20.2133', '-70.1503', 'norte', 12000, 25000],
  ['II', 'Antofagasta', 'Antofagasta', '-23.6509', '-70.3975', 'norte', 18000, 38000],
  ['III', 'Atacama', 'Copiapó', '-27.3668', '-70.3322', 'norte', 11000, 22000],
  ['IV', 'Coquimbo', 'La Serena', '-29.9027', '-71.2519', 'no', 22000, 48000],
  ['V', 'Valparaíso', 'Valparaíso', '-33.0472', '-71.6127', 'no', 38000, 85000],
  ['RM', 'Metropolitana', 'Santiago', '-33.4489', '-70.6693', 'no', 95000, 210000],
  ['VI', "Libertador O'Higgins", 'Rancagua', '-34.1708', '-70.7444', 'no', 24000, 52000],
  ['VII', 'Maule', 'Talca', '-35.4264', '-71.6554', 'no', 28000, 62000],
  ['XVI', 'Ñuble', 'Chillán', '-36.6066', '-72.1034', 'no', 18000, 40000],
  ['VIII', 'Biobío', 'Concepción', '-36.8201', '-73.0444', 'no', 45000, 98000],
  ['IX', 'La Araucanía', 'Temuco', '-38.7359', '-72.5904', 'no', 32000, 70000],
  ['XIV', 'Los Ríos', 'Valdivia', '-39.8142', '-73.2459', 'sur', 14000, 30000],
  ['X', 'Los Lagos', 'Puerto Montt', '-41.4693', '-72.9424', 'sur', 22000, 48000],
  ['XI', 'Aysén', 'Coyhaique', '-45.5712', '-72.0686', 'sur', 5000, 11000],
  ['XII', 'Magallanes', 'Punta Arenas', '-53.1638', '-70.9171', 'sur', 6000, 13000],
];

for (const r of regionsData) {
  await conn.execute(
    `INSERT INTO regions (code, name, capital, lat, lng, isExtreme, deficitCuantitativo, deficitCualitativo) VALUES (?,?,?,?,?,?,?,?)`,
    r
  );
}
console.log(`✓ ${regionsData.length} regiones insertadas`);

/* ── PROGRAMS ── */
const programsData = [
  ['DS49', 'Fondo Solidario de Elección de Vivienda', 'Subsidio para familias del 40% más vulnerable del RSH. Compra de vivienda construida sin deuda hipotecaria.', 'Familias 40% RSH', '950', '40% RSH', '40.169.418', 29000, 21408],
  ['DS19', 'Programa de Integración Social y Territorial', 'Prioriza calidad de localización e integración social. Viviendas en barrios bien localizados.', 'Familias 40%-90% RSH', '2.800', '40%-90% RSH', '14.122.710', 23190, 23190],
  ['DS10', 'Programa de Habitabilidad Rural', 'Atiende familias en localidades de hasta 5.000 habitantes. Mejoramiento, ampliación y construcción nueva.', 'Zonas rurales hasta 5.000 hab.', '860', 'Rural vulnerable', '5.848.000', 3307, 3248],
  ['DS01', 'Subsidio de Arriendo de Vivienda', 'Apoyo temporal a familias arrendatarias. 170 UF totales en plazo máximo de 8 años.', 'Familias arrendatarias vulnerables', '170', 'Vulnerables', '1.841.402', 0, 15670],
  ['DS27', 'Programa de Mejoramiento de Viviendas y Barrios', 'Mejora calidad de vida en áreas urbanas. Mejoramiento estructural, instalaciones, ampliación.', 'Propietarios vivienda social', '504', 'Urbano vulnerable', '0', 0, 0],
  ['DS255', 'Programa de Vivienda DS255', 'Instrumento histórico de política habitacional. Programa de vivienda para sectores medios.', 'Sectores medios', '600', 'Medio', '0', 0, 0],
];

for (const p of programsData) {
  await conn.execute(
    `INSERT INTO programs (code, name, description, targetPopulation, maxSubsidyUF, incomeSegment, investment2025UF, housingUnits2025, beneficiaries2025) VALUES (?,?,?,?,?,?,?,?,?)`,
    p
  );
}
console.log(`✓ ${programsData.length} programas insertados`);

/* ── PROJECTS (sample per region) ── */
const projectsData = [
  // Arica
  ['Conjunto Habitacional Arica Norte', 'DS49', 'XV', 'Arica', 'Av. Coronel Sagredo', '-18.4783', '-70.3126', 'en_ejecucion', 'vivienda_nueva', '1.200.000', 120, 480, 'Cumbres del Norte', 'SERVIU Arica', 'PRC Arica', '150 hab/ha', 'Residencial', 'Zona Urbana', 'Zona de riesgo sísmico', 'DS49 Art. 1-20', '2025-03', '2026-12', 'Proyecto de densificación en zona central'],
  // Iquique
  ['Viviendas Integración Iquique', 'DS19', 'I', 'Iquique', 'Av. Arturo Prat', '-20.2133', '-70.1503', 'seleccionado', 'vivienda_nueva', '2.100.000', 85, 340, 'Cumbres del Norte', 'SERVIU Tarapacá', 'PRC Iquique', '200 hab/ha', 'Residencial, Comercial', 'Zona Urbana', 'Zona costera', 'DS19 zonas especiales', '2025-06', '2027-06', 'Proyecto en zona central con transporte'],
  // Antofagasta
  ['Conjunto Antofagasta Centro', 'DS49', 'II', 'Antofagasta', 'Av. Argentina', '-23.6509', '-70.3975', 'en_ejecucion', 'vivienda_nueva', '1.800.000', 150, 600, 'Cumbres del Norte', 'SERVIU Antofagasta', 'PRC Antofagasta', '180 hab/ha', 'Residencial', 'Zona Urbana', 'Zona desértica, costera', 'DS49 zonas extremas', '2025-01', '2026-10', 'Subsidios aumentados zona extrema'],
  // Copiapó
  ['Departamentos Copiapó Centro', 'DS49', 'III', 'Copiapó', 'Av. Chacabuco', '-27.3668', '-70.3322', 'terminado', 'vivienda_nueva', '950.000', 93, 372, 'Cumbres del Norte', 'SERVIU Atacama', 'PRC Copiapó', '160 hab/ha', 'Residencial', 'Zona Urbana', 'Actividad minera cercana', 'DS49 Art. 15', '2024-03', '2026-03', '93 departamentos entregados 2026'],
  // La Serena
  ['Viviendas La Serena Costa', 'DS19', 'IV', 'La Serena', 'Av. del Mar', '-29.9027', '-71.2519', 'en_ejecucion', 'vivienda_nueva', '2.500.000', 110, 440, 'Cumbres del Norte', 'SERVIU Coquimbo', 'PRC La Serena-Coquimbo', '220 hab/ha', 'Residencial, Turismo', 'Zona Urbana Costera', 'Zona costera', 'DS19 zonas especiales', '2025-02', '2027-02', 'Proyecto intercomunal La Serena-Coquimbo'],
  // Valparaíso
  ['Condominio Valparaíso Cerro', 'DS19', 'V', 'Valparaíso', 'Cerro Concepción', '-33.0472', '-71.6127', 'en_ejecucion', 'densificacion', '3.200.000', 180, 720, 'Patrocinante Valparaíso', 'SERVIU Valparaíso', 'PRC Valparaíso', '350 hab/ha', 'Residencial, Comercial', 'Zona Urbana', 'Topografía accidentada', 'DS19 zonas especiales, DS1 damnificados', '2025-01', '2026-12', 'Regeneración urbana cerro Concepción'],
  // Santiago RM
  ['Renca Integración Social', 'DS19', 'RM', 'Renca', 'Av. Américo Vespucio', '-33.3933', '-70.7117', 'en_ejecucion', 'vivienda_nueva', '4.500.000', 250, 1000, 'Patrocinante RM', 'SERVIU Metropolitano', 'PRMS', '300 hab/ha', 'Residencial, Equipamiento', 'Zona Urbana', 'Ninguna especial', 'DS19 zonas especiales Renca', '2025-01', '2027-06', 'Proyecto emblemático DS19 zona central'],
  ['Independencia Densificación', 'DS19', 'RM', 'Independencia', 'Av. Independencia', '-33.4197', '-70.6497', 'en_ejecucion', 'densificacion', '3.800.000', 200, 800, 'Patrocinante RM', 'SERVIU Metropolitano', 'PRMS', '350 hab/ha', 'Residencial, Comercial', 'Zona Urbana', 'Ninguna especial', 'DS19 zonas especiales', '2025-02', '2027-01', 'Densificación en eje transporte público'],
  ['Peñalolén Alto Viviendas', 'DS49', 'RM', 'Peñalolén', 'Av. Arrieta', '-33.4922', '-70.5961', 'terminado', 'vivienda_nueva', '1.500.000', 160, 640, 'Patrocinante RM', 'SERVIU Metropolitano', 'PRMS', '200 hab/ha', 'Residencial', 'Zona Urbana Periférica', 'Ninguna especial', 'DS49 Art. 1-20', '2024-06', '2026-03', '160 viviendas entregadas'],
  // Rancagua
  ['Rancagua Industrializado', 'DS49', 'VI', 'Rancagua', 'Av. República', '-34.1708', '-70.7444', 'terminado', 'vivienda_nueva', '850.000', 88, 352, 'Patrocinante O\'Higgins', 'SERVIU O\'Higgins', 'PRC Rancagua', '180 hab/ha', 'Residencial', 'Zona Urbana', 'Riesgo sísmico', 'DS49 vivienda industrializada', '2024-09', '2026-03', '88 viviendas industrializadas entregadas'],
  // Talca
  ['Talca Terreno SERVIU', 'DS19', 'VII', 'Talca', 'Av. Lircay', '-35.4264', '-71.6554', 'seleccionado', 'vivienda_nueva', '2.200.000', 261, 1044, 'Patrocinante Maule', 'SERVIU Maule', 'PRC Talca', '200 hab/ha', 'Residencial', 'Zona Urbana', 'Riesgo sísmico', 'DS19 llamado especial', '2025-06', '2027-12', '261 viviendas, 158.949 UF'],
  // Chillán
  ['Chillán Mejoramiento Barrial', 'DS27', 'XVI', 'Chillán', 'Población Schleyer', '-36.6066', '-72.1034', 'en_ejecucion', 'mejoramiento', '320.000', 0, 180, 'Patrocinante Ñuble', 'SERVIU Ñuble', 'PRC Chillán', '150 hab/ha', 'Residencial', 'Zona Urbana', 'Riesgo sísmico, incendios', 'DS27 mejoramiento estructural', '2025-04', '2026-10', 'Mejoramiento de 180 viviendas sociales'],
  // Concepción
  ['Concepción Hualpén Viviendas', 'DS49', 'VIII', 'Hualpén', 'Av. Pedro Aguirre Cerda', '-36.7903', '-73.0947', 'en_ejecucion', 'vivienda_nueva', '2.000.000', 180, 720, 'Patrocinante Biobío', 'SERVIU Biobío', 'PRMC Concepción', '250 hab/ha', 'Residencial, Industrial', 'Zona Urbana', 'Riesgo sísmico, costera', 'DS49 Art. 1-20', '2025-03', '2027-03', 'Proyecto en área metropolitana Concepción'],
  // Temuco
  ['Temuco Integración Social', 'DS19', 'IX', 'Temuco', 'Av. Caupolicán', '-38.7359', '-72.5904', 'seleccionado', 'vivienda_nueva', '2.800.000', 140, 560, 'Patrocinante Araucanía', 'SERVIU Araucanía', 'PRC Temuco', '200 hab/ha', 'Residencial, Comercial', 'Zona Urbana', 'Territorios indígenas cercanos', 'DS19 zonas especiales, llamado abierto hasta 22 jun 2026', '2025-06', '2027-12', 'Llamado DS19 abierto hasta junio 2026'],
  // Valdivia
  ['Valdivia Costanera Viviendas', 'DS19', 'XIV', 'Valdivia', 'Av. Costanera', '-39.8142', '-73.2459', 'en_ejecucion', 'vivienda_nueva', '2.400.000', 120, 480, 'Patrocinante Los Ríos', 'SERVIU Los Ríos', 'PRC Valdivia', '180 hab/ha', 'Residencial, Turismo', 'Zona Urbana', 'Riesgo sísmico, costera', 'DS19 zonas especiales', '2025-02', '2027-02', 'Proyecto costero con vista al río Calle-Calle'],
  // Puerto Montt
  ['Puerto Montt Pelluco', 'DS49', 'X', 'Puerto Montt', 'Av. Pelluco', '-41.4693', '-72.9424', 'terminado', 'vivienda_nueva', '1.100.000', 100, 400, 'Patrocinante Los Lagos', 'SERVIU Los Lagos', 'PRC Puerto Montt', '160 hab/ha', 'Residencial', 'Zona Urbana', 'Zona costera, riesgo sísmico', 'DS49 zona extrema sur', '2024-06', '2026-03', 'Meta PEH alcanzada en Los Lagos'],
  // Coyhaique
  ['Coyhaique Habitabilidad Rural', 'DS10', 'XI', 'Coyhaique', 'Sector Alto Baguales', '-45.5712', '-72.0686', 'en_ejecucion', 'ampliacion', '680.000', 25, 100, 'Patrocinante Aysén', 'SERVIU Aysén', 'PRC Coyhaique', '100 hab/ha', 'Residencial Rural', 'Zona Rural', 'Zona extrema, acceso limitado', 'DS10 habitabilidad rural', '2025-05', '2026-12', 'Mejoramiento y ampliación viviendas rurales'],
  // Punta Arenas
  ['Punta Arenas Magallanes', 'DS49', 'XII', 'Punta Arenas', 'Av. Bulnes', '-53.1638', '-70.9171', 'en_ejecucion', 'vivienda_nueva', '1.300.000', 90, 360, 'Patrocinante Magallanes', 'SERVIU Magallanes', 'PRC Punta Arenas', '150 hab/ha', 'Residencial', 'Zona Urbana', 'Zona extrema sur, clima adverso', 'DS49 zona extrema sur', '2025-01', '2026-12', 'Subsidios aumentados zona extrema'],
  // Rural projects DS10
  ['Habitabilidad Rural Coquimbo', 'DS10', 'IV', 'Ovalle', 'Sector Rural Ovalle', '-30.5983', '-71.1989', 'seleccionado', 'vivienda_nueva', '720.000', 40, 160, 'Patrocinante Coquimbo', 'SERVIU Coquimbo', 'PRC Ovalle', '80 hab/ha', 'Residencial Rural', 'Zona Rural', 'Acceso limitado servicios', 'DS10 llamado regional Coquimbo', '2025-06', '2027-06', 'Llamado regional DS10 específico'],
  ['Habitabilidad Rural Pueblos Originarios', 'DS10', 'IX', 'Padre Las Casas', 'Sector Rural Padre Las Casas', '-38.7729', '-72.5319', 'seleccionado', 'ampliacion', '680.000', 35, 140, 'Patrocinante Araucanía', 'SERVIU Araucanía', 'PRC Padre Las Casas', '80 hab/ha', 'Residencial Rural', 'Zona Rural Indígena', 'Territorios indígenas', 'DS10 pueblos indígenas 2025', '2025-07', '2027-06', 'Llamado específico pueblos indígenas'],
  // Arriendo DS01
  ['Subsidio Arriendo Metropolitano', 'DS01', 'RM', 'Santiago', 'Diversas comunas RM', '-33.4489', '-70.6693', 'en_ejecucion', 'arriendo', '987.530', 0, 5809, 'SERVIU Metropolitano', 'SERVIU Metropolitano', 'PRMS', 'Variable', 'Residencial', 'Variable', 'Ninguna especial', 'DS01 subsidio arriendo', '2025-01', '2026-12', '5.809 familias beneficiadas arriendo RM'],
  ['Subsidio Arriendo Adulto Mayor', 'DS01', 'VIII', 'Concepción', 'Diversas comunas Biobío', '-36.8201', '-73.0444', 'en_ejecucion', 'arriendo', '695.384', 0, 9018, 'SERVIU Biobío', 'SERVIU Biobío', 'PRMC Concepción', 'Variable', 'Residencial', 'Variable', 'Ninguna especial', 'DS01 adulto mayor', '2025-01', '2026-12', '9.018 adultos mayores beneficiados'],
];

for (const p of projectsData) {
  await conn.execute(
    `INSERT INTO projects (name, programCode, regionCode, comuna, address, lat, lng, status, projectType, investmentUF, housingUnits, beneficiaries, entityPatrocinante, serviu, planRegulador, densityAllowed, landUse, zoning, restrictions, normative, startDate, endDate, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    p
  );
}
console.log(`✓ ${projectsData.length} proyectos insertados`);

/* ── PLANS REGULADORES ── */
const plansData = [
  ['Plan Regulador Comunal Arica', 'comunal', 'XV', 'Arica', 'vigente', '200', '80', 'Residencial, Comercial, Equipamiento', 'Industrial condicionado', 'Contaminante', 'Zona de riesgo sísmico', 'si', 'Vigente desde 2018'],
  ['Plan Regulador Comunal Iquique', 'comunal', 'I', 'Iquique', 'vigente', '250', '100', 'Residencial, Comercial, Industrial', 'Equipamiento mayor', 'Contaminante', 'Zona costera, desértica', 'si', 'Vigente desde 2019'],
  ['Plan Regulador Comunal Antofagasta', 'comunal', 'II', 'Antofagasta', 'vigente', '250', '100', 'Residencial, Comercial, Industrial', 'Equipamiento mayor', 'Contaminante', 'Zona desértica, costera', 'si', 'Vigente desde 2017'],
  ['Plan Regulador Comunal Copiapó', 'comunal', 'III', 'Copiapó', 'vigente', '200', '80', 'Residencial, Comercial, Minería', 'Industrial mayor', 'Contaminante', 'Actividad minera cercana', 'si', 'Vigente desde 2018'],
  ['Plan Regulador Intercomunal La Serena-Coquimbo', 'intercomunal', 'IV', 'La Serena', 'vigente', '300', '120', 'Residencial, Comercial, Turismo', 'Industrial', 'Contaminante', 'Zona costera', 'si', 'Plan intercomunal vigente'],
  ['Plan Regulador Comunal Valparaíso', 'comunal', 'V', 'Valparaíso', 'vigente', '350', '150', 'Residencial, Comercial, Portuario', 'Industrial', 'Contaminante', 'Topografía accidentada, costera', 'si', 'Vigente, en actualización parcial'],
  ['Plan Regulador Metropolitano Santiago', 'metropolitano', 'RM', 'Santiago', 'vigente', '500', '150', 'Residencial, Comercial, Industrial, Equipamiento', 'Mixto', 'Contaminante', 'Zona de riesgo ambiental', 'si', 'PRMS vigente, modificaciones en proceso'],
  ['Plan Regulador Comunal Rancagua', 'comunal', 'VI', 'Rancagua', 'vigente', '250', '100', 'Residencial, Comercial, Industrial', 'Equipamiento mayor', 'Contaminante', 'Riesgo sísmico', 'si', 'Vigente desde 2019'],
  ['Plan Regulador Comunal Talca', 'comunal', 'VII', 'Talca', 'vigente', '220', '100', 'Residencial, Comercial, Agrícola', 'Industrial', 'Contaminante', 'Riesgo sísmico', 'si', 'Vigente desde 2018'],
  ['Plan Regulador Comunal Chillán', 'comunal', 'XVI', 'Chillán', 'vigente', '200', '80', 'Residencial, Comercial, Agrícola', 'Industrial', 'Contaminante', 'Riesgo sísmico, incendios', 'si', 'Vigente, revisión post-incendios 2026'],
  ['Plan Regulador Metropolitano Concepción', 'metropolitano', 'VIII', 'Concepción', 'vigente', '400', '200', 'Residencial, Comercial, Industrial', 'Portuario', 'Contaminante', 'Riesgo sísmico, costera', 'si', 'PRMC vigente desde 2019'],
  ['Plan Regulador Comunal Temuco', 'comunal', 'IX', 'Temuco', 'vigente', '220', '100', 'Residencial, Comercial, Agrícola', 'Industrial', 'Contaminante', 'Territorios indígenas', 'condicionado', 'Vigente con restricciones en zonas indígenas'],
  ['Plan Regulador Comunal Valdivia', 'comunal', 'XIV', 'Valdivia', 'vigente', '200', '80', 'Residencial, Comercial, Turismo', 'Industrial', 'Contaminante', 'Riesgo sísmico, costera', 'si', 'Vigente desde 2020'],
  ['Plan Regulador Comunal Puerto Montt', 'comunal', 'X', 'Puerto Montt', 'vigente', '200', '80', 'Residencial, Comercial, Acuicultura', 'Industrial', 'Contaminante', 'Zona costera, riesgo sísmico', 'si', 'Vigente desde 2018'],
  ['Plan Regulador Comunal Coyhaique', 'comunal', 'XI', 'Coyhaique', 'vigente', '120', '50', 'Residencial, Comercial, Turismo', 'Industrial', 'Contaminante', 'Zona extrema, acceso limitado', 'si', 'Vigente con restricciones geográficas'],
  ['Plan Regulador Comunal Punta Arenas', 'comunal', 'XII', 'Punta Arenas', 'vigente', '150', '60', 'Residencial, Comercial, Industrial', 'Portuario', 'Contaminante', 'Zona extrema sur, clima adverso', 'si', 'Vigente desde 2019'],
];

for (const p of plansData) {
  await conn.execute(
    `INSERT INTO plans_reguladores (name, type, regionCode, comuna, status, densityMax, densityMin, landUsePermitted, landUseConditional, landUseProhibited, restrictions, aptForHousing, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    p
  );
}
console.log(`✓ ${plansData.length} planes reguladores insertados`);

/* ── STATS NATIONAL ── */
const statsData = [
  ['Déficit Cuantitativo', '491.904', 'viviendas', 'deficit'],
  ['Déficit Cualitativo', '908.956', 'viviendas', 'deficit'],
  ['Viviendas Terminadas PEH', '262.390', 'viviendas', 'peh'],
  ['Viviendas en Ejecución PEH', '111.354', 'viviendas', 'peh'],
  ['Avance PEH', '97,7', '%', 'peh'],
  ['Inversión DS49 2025', '40.169.418', 'UF', 'inversion'],
  ['Inversión DS19 2025', '14.122.710', 'UF', 'inversion'],
  ['Inversión DS10 2025', '5.848.000', 'UF', 'inversion'],
  ['Inversión DS01 2025', '1.841.402', 'UF', 'inversion'],
  ['Inversión Total 2025', '61.981.530', 'UF', 'inversion'],
  ['Viviendas DS49 2025', '29.000', 'viviendas', 'viviendas'],
  ['Viviendas DS19 2025', '23.190', 'viviendas', 'viviendas'],
  ['Viviendas DS10 2025', '3.307', 'viviendas', 'viviendas'],
  ['Beneficiarios DS01 2025', '15.670', 'personas', 'beneficiarios'],
  ['Proyectos DS19 Seleccionados', '124', 'proyectos', 'proyectos'],
  ['Proyectos DS27 2025', '119', 'proyectos', 'proyectos'],
  ['Zonas DS19 Especiales', '43', 'zonas', 'proyectos'],
  ['Regiones Cubiertas', '16', 'regiones', 'cobertura'],
  ['Comunas Beneficiadas', '57', 'comunas', 'cobertura'],
  ['Reducción Presupuestaria 2026', '421.000.000.000', 'pesos', 'riesgo'],
  ['Subsidios Proyectados 2026', '19.000', 'subsidios', 'riesgo'],
];

for (const s of statsData) {
  await conn.execute(
    `INSERT INTO stats_national (label, value, unit, category) VALUES (?,?,?,?)`,
    s
  );
}
console.log(`✓ ${statsData.length} estadísticas nacionales insertadas`);

await conn.end();
console.log('\n✅ Seed completado exitosamente');
