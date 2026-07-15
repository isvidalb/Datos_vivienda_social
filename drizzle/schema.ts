import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ──────────────────────────────────────────────────────────
   REGIONS – 16 regiones de Chile
   ────────────────────────────────────────────────────────── */
export const regions = mysqlTable("regions", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 8 }).notNull().unique(),   // XV, I, II, ... XII, RM, XIV...XVI
  name: varchar("name", { length: 120 }).notNull(),
  capital: varchar("capital", { length: 120 }),
  lat: varchar("lat", { length: 20 }),
  lng: varchar("lng", { length: 20 }),
  isExtreme: mysqlEnum("isExtreme", ["norte", "sur", "no"]).default("no").notNull(),
  deficitCuantitativo: int("deficitCuantitativo").default(0),
  deficitCualitativo: int("deficitCualitativo").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Region = typeof regions.$inferSelect;
export type InsertRegion = typeof regions.$inferInsert;

/* ──────────────────────────────────────────────────────────
   PROGRAMS – DS49, DS19, DS10, DS01, DS27, DS255
   ────────────────────────────────────────────────────────── */
export const programs = mysqlTable("programs", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(),  // DS49, DS19, etc.
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  targetPopulation: text("targetPopulation"),
  maxSubsidyUF: varchar("maxSubsidyUF", { length: 20 }),
  incomeSegment: varchar("incomeSegment", { length: 100 }),
  investment2025UF: varchar("investment2025UF", { length: 30 }),
  housingUnits2025: int("housingUnits2025").default(0),
  beneficiaries2025: int("beneficiaries2025").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Program = typeof programs.$inferSelect;
export type InsertProgram = typeof programs.$inferInsert;

/* ──────────────────────────────────────────────────────────
   PROJECTS – Proyectos de vivienda social georreferenciados
   ────────────────────────────────────────────────────────── */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 300 }).notNull(),
  programCode: varchar("programCode", { length: 10 }).notNull(),   // DS49, DS19, etc.
  regionCode: varchar("regionCode", { length: 8 }).notNull(),      // XV, I, II...
  comuna: varchar("comuna", { length: 150 }).notNull(),
  address: varchar("address", { length: 300 }),
  lat: varchar("lat", { length: 20 }).notNull(),
  lng: varchar("lng", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["seleccionado", "en_ejecucion", "terminado", "entregado", "por_iniciar"]).default("seleccionado").notNull(),
  projectType: mysqlEnum("projectType", ["vivienda_nueva", "mejoramiento", "ampliacion", "arriendo", "densificacion"]).default("vivienda_nueva").notNull(),
  investmentUF: varchar("investmentUF", { length: 30 }),
  housingUnits: int("housingUnits").default(0),
  beneficiaries: int("beneficiaries").default(0),
  entityPatrocinante: varchar("entityPatrocinante", { length: 200 }),
  serviu: varchar("serviu", { length: 100 }),
  planRegulador: varchar("planRegulador", { length: 200 }),
  densityAllowed: varchar("densityAllowed", { length: 100 }),
  landUse: varchar("landUse", { length: 200 }),
  zoning: varchar("zoning", { length: 200 }),
  restrictions: text("restrictions"),
  normative: text("normative"),
  startDate: varchar("startDate", { length: 20 }),
  endDate: varchar("endDate", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/* ──────────────────────────────────────────────────────────
   PLANS_REGULADORES – Planes reguladores comunales e intercomunales
   ────────────────────────────────────────────────────────── */
export const plansReguladores = mysqlTable("plans_reguladores", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 300 }).notNull(),
  type: mysqlEnum("type", ["comunal", "intercomunal", "metropolitano", "seccional"]).default("comunal").notNull(),
  regionCode: varchar("regionCode", { length: 8 }).notNull(),
  comuna: varchar("comuna", { length: 150 }).notNull(),
  status: mysqlEnum("status", ["vigente", "en_revision", "en_actualizacion", "propuesto"]).default("vigente").notNull(),
  densityMax: varchar("densityMax", { length: 100 }),
  densityMin: varchar("densityMin", { length: 100 }),
  landUsePermitted: text("landUsePermitted"),
  landUseConditional: text("landUseConditional"),
  landUseProhibited: text("landUseProhibited"),
  restrictions: text("restrictions"),
  aptForHousing: mysqlEnum("aptForHousing", ["si", "no", "condicionado"]).default("si").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlanRegulador = typeof plansReguladores.$inferSelect;
export type InsertPlanRegulador = typeof plansReguladores.$inferInsert;

/* ──────────────────────────────────────────────────────────
   STATS_NATIONAL – Estadísticas nacionales agregadas
   ────────────────────────────────────────────────────────── */
export const statsNational = mysqlTable("stats_national", {
  id: int("id").autoincrement().primaryKey(),
  label: varchar("label", { length: 200 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StatNational = typeof statsNational.$inferSelect;
export type InsertStatNational = typeof statsNational.$inferInsert;
