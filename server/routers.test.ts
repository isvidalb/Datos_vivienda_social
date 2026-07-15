import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  getAllRegions: vi.fn().mockResolvedValue([
    { id: 1, code: "XV", name: "Arica y Parinacota", capital: "Arica", lat: "-18.4783", lng: "-70.3126", isExtreme: "norte", deficitCuantitativo: 5000, deficitCualitativo: 8000 },
    { id: 2, code: "RM", name: "Metropolitana de Santiago", capital: "Santiago", lat: "-33.4489", lng: "-70.6693", isExtreme: "no", deficitCuantitativo: 150000, deficitCualitativo: 300000 },
  ]),
  getRegionByCode: vi.fn().mockResolvedValue({ id: 2, code: "RM", name: "Metropolitana de Santiago" }),
  getAllPrograms: vi.fn().mockResolvedValue([
    { id: 1, code: "DS49", name: "Fondo Solidario de Elección de Vivienda", maxSubsidyUF: "950", investment2025UF: "40.169.418", housingUnits2025: 29000, beneficiaries2025: 21408 },
    { id: 2, code: "DS19", name: "Integración Social y Territorial", maxSubsidyUF: "2.800", investment2025UF: "14.122.710", housingUnits2025: 23190, beneficiaries2025: 23190 },
  ]),
  getProjects: vi.fn().mockResolvedValue([
    { id: 1, name: "Villa Esperanza", programCode: "DS49", regionCode: "RM", comuna: "Santiago", lat: "-33.4489", lng: "-70.6693", status: "en_ejecucion", projectType: "vivienda_nueva", investmentUF: "15.000", housingUnits: 120, beneficiaries: 480 },
  ]),
  getProjectById: vi.fn().mockResolvedValue({ id: 1, name: "Villa Esperanza", programCode: "DS49" }),
  getAllPlansReguladores: vi.fn().mockResolvedValue([
    { id: 1, name: "Plan Regulador Comunal de Santiago", type: "comunal", regionCode: "RM", comuna: "Santiago", status: "vigente", aptForHousing: "si" },
  ]),
  getPlansByComuna: vi.fn().mockResolvedValue([]),
  getPlansByRegion: vi.fn().mockResolvedValue([]),
  getAllStats: vi.fn().mockResolvedValue([
    { id: 1, label: "Déficit Cuantitativo", value: "491.904", unit: "viviendas", category: "deficit" },
    { id: 2, label: "Inversión Total 2025", value: "61.981.530", unit: "UF", category: "inversion" },
  ]),
  getStatsByRegion: vi.fn().mockResolvedValue([
    { regionCode: "RM", totalProjects: 4, totalUnits: 500, totalBeneficiaries: 2000 },
  ]),
  getStatsByProgram: vi.fn().mockResolvedValue([
    { programCode: "DS49", totalProjects: 10, totalUnits: 29000, totalBeneficiaries: 21408 },
  ]),
  createProject: vi.fn().mockResolvedValue({ success: true }),
  updateProject: vi.fn().mockResolvedValue({ success: true }),
  deleteProject: vi.fn().mockResolvedValue({ success: true }),
  createPlanRegulador: vi.fn().mockResolvedValue({ success: true }),
  updatePlanRegulador: vi.fn().mockResolvedValue({ success: true }),
  deletePlanRegulador: vi.fn().mockResolvedValue({ success: true }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      name: "Ignacio Vidal",
      email: "ignacio@example.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("regions router", () => {
  it("list returns all regions", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.regions.list();
    expect(result).toHaveLength(2);
    expect(result[0].code).toBe("XV");
    expect(result[1].code).toBe("RM");
  });

  it("byCode returns a single region", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.regions.byCode({ code: "RM" });
    expect(result?.code).toBe("RM");
  });
});

describe("programs router", () => {
  it("list returns all programs", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.programs.list();
    expect(result).toHaveLength(2);
    expect(result[0].code).toBe("DS49");
    expect(result[1].code).toBe("DS19");
  });
});

describe("projects router", () => {
  it("list returns projects with no filters", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.projects.list({});
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Villa Esperanza");
  });

  it("byId returns a single project", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.projects.byId({ id: 1 });
    expect(result?.name).toBe("Villa Esperanza");
  });
});

describe("plansReguladores router", () => {
  it("list returns all plans", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.plansReguladores.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toContain("Santiago");
  });
});

describe("stats router", () => {
  it("national returns all stats", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.stats.national();
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Déficit Cuantitativo");
  });

  it("byRegion returns aggregated stats", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.stats.byRegion();
    expect(result).toHaveLength(1);
    expect(result[0].regionCode).toBe("RM");
  });

  it("byProgram returns aggregated stats", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.stats.byProgram();
    expect(result).toHaveLength(1);
    expect(result[0].programCode).toBe("DS49");
  });
});

describe("admin authorization", () => {
  it("projects.create rejects non-admin users", async () => {
    const publicCtx = createPublicContext();
    const caller = appRouter.createCaller(publicCtx);
    await expect(
      caller.projects.create({
        name: "Test Project",
        programCode: "DS49",
        regionCode: "RM",
        comuna: "Santiago",
        lat: "-33.4489",
        lng: "-70.6693",
      })
    ).rejects.toThrow();
  });

  it("projects.create accepts admin users", async () => {
    const adminCtx = createAdminContext();
    const caller = appRouter.createCaller(adminCtx);
    const result = await caller.projects.create({
      name: "Test Project",
      programCode: "DS49",
      regionCode: "RM",
      comuna: "Santiago",
      lat: "-33.4489",
      lng: "-70.6693",
    });
    expect(result).toEqual({ success: true });
  });

  it("projects.delete rejects non-admin users", async () => {
    const publicCtx = createPublicContext();
    const caller = appRouter.createCaller(publicCtx);
    await expect(caller.projects.delete({ id: 1 })).rejects.toThrow();
  });

  it("plansReguladores.create rejects non-admin users", async () => {
    const publicCtx = createPublicContext();
    const caller = appRouter.createCaller(publicCtx);
    await expect(
      caller.plansReguladores.create({
        name: "Test Plan",
        regionCode: "RM",
        comuna: "Santiago",
      })
    ).rejects.toThrow();
  });
});

describe("auth router", () => {
  it("me returns null user for public context", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("me returns user for admin context", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.auth.me();
    expect(result?.name).toBe("Ignacio Vidal");
    expect(result?.role).toBe("admin");
  });
});
