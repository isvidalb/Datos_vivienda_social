import { eq, like, and, sql, desc, count, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, regions, programs, projects, plansReguladores, statsNational } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/* ── REGIONS ── */
export async function getAllRegions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(regions).orderBy(regions.code);
}

export async function getRegionByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const r = await db.select().from(regions).where(eq(regions.code, code)).limit(1);
  return r[0];
}

/* ── PROGRAMS ── */
export async function getAllPrograms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(programs).orderBy(programs.code);
}

/* ── PROJECTS ── */
export interface ProjectFilters {
  programCode?: string;
  regionCode?: string;
  status?: string;
  projectType?: string;
  search?: string;
  minInvestment?: number;
  maxInvestment?: number;
  limit?: number;
  offset?: number;
}

export async function getProjects(filters: ProjectFilters = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters.programCode) conditions.push(eq(projects.programCode, filters.programCode));
  if (filters.regionCode) conditions.push(eq(projects.regionCode, filters.regionCode));
  if (filters.status) conditions.push(eq(projects.status, filters.status as any));
  if (filters.projectType) conditions.push(eq(projects.projectType, filters.projectType as any));
  if (filters.search) {
    conditions.push(like(projects.name, `%${filters.search}%`));
  }
  // Amount filters: investmentUF is stored as Chilean-formatted string (e.g. "15.000")
  // We use SQL REPLACE to strip dots and cast to numeric for comparison
  if (filters.minInvestment !== undefined) {
    conditions.push(sql`CAST(REPLACE(${projects.investmentUF}, '.', '') AS DECIMAL(20,0)) >= ${filters.minInvestment}`);
  }
  if (filters.maxInvestment !== undefined) {
    conditions.push(sql`CAST(REPLACE(${projects.investmentUF}, '.', '') AS DECIMAL(20,0)) <= ${filters.maxInvestment}`);
  }
  let query = db.select().from(projects);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  query = query.orderBy(desc(projects.createdAt)) as any;
  if (filters.limit) {
    query = query.limit(filters.limit) as any;
  }
  return query;
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const r = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return r[0];
}

export async function createProject(data: typeof projects.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(projects).values(data);
  return { success: true };
}

export async function updateProject(id: number, data: Partial<typeof projects.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projects).set(data).where(eq(projects.id, id));
  return { success: true };
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(projects).where(eq(projects.id, id));
  return { success: true };
}

/* ── PLANS REGULADORES ── */
export async function getAllPlansReguladores() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plansReguladores).orderBy(plansReguladores.regionCode);
}

export async function getPlansByComuna(comuna: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plansReguladores).where(like(plansReguladores.comuna, `%${comuna}%`));
}

export async function getPlansByRegion(regionCode: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plansReguladores).where(eq(plansReguladores.regionCode, regionCode));
}

export async function createPlanRegulador(data: typeof plansReguladores.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(plansReguladores).values(data);
  return { success: true };
}

export async function updatePlanRegulador(id: number, data: Partial<typeof plansReguladores.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(plansReguladores).set(data).where(eq(plansReguladores.id, id));
  return { success: true };
}

export async function deletePlanRegulador(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(plansReguladores).where(eq(plansReguladores.id, id));
  return { success: true };
}

/* ── STATS NATIONAL ── */
export async function getAllStats() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(statsNational).orderBy(statsNational.category);
}

/* ── AGGREGATE STATS ── */
export async function getStatsByRegion() {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      regionCode: projects.regionCode,
      totalProjects: count(projects.id),
      totalUnits: sum(projects.housingUnits),
      totalBeneficiaries: sum(projects.beneficiaries),
    })
    .from(projects)
    .groupBy(projects.regionCode);
  return result;
}

export async function getStatsByProgram() {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      programCode: projects.programCode,
      totalProjects: count(projects.id),
      totalUnits: sum(projects.housingUnits),
      totalBeneficiaries: sum(projects.beneficiaries),
    })
    .from(projects)
    .groupBy(projects.programCode);
  return result;
}
