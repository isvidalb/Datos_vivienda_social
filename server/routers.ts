import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  /* ─────────── REGIONS ─────────── */
  regions: router({
    list: publicProcedure.query(async () => {
      return await db.getAllRegions();
    }),
    byCode: publicProcedure.input(z.object({ code: z.string() })).query(async ({ input }) => {
      return await db.getRegionByCode(input.code);
    }),
  }),

  /* ─────────── PROGRAMS ─────────── */
  programs: router({
    list: publicProcedure.query(async () => {
      return await db.getAllPrograms();
    }),
  }),

  /* ─────────── PROJECTS ─────────── */
  projects: router({
    list: publicProcedure
      .input(z.object({
        programCode: z.string().optional(),
        regionCode: z.string().optional(),
        status: z.string().optional(),
        projectType: z.string().optional(),
        search: z.string().optional(),
        minInvestment: z.number().optional(),
        maxInvestment: z.number().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getProjects(input ?? {});
      }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectById(input.id);
      }),

    /* ── ADMIN CRUD ── */
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        programCode: z.string(),
        regionCode: z.string(),
        comuna: z.string(),
        address: z.string().optional(),
        lat: z.string(),
        lng: z.string(),
        status: z.enum(["seleccionado", "en_ejecucion", "terminado", "entregado", "por_iniciar"]).optional(),
        projectType: z.enum(["vivienda_nueva", "mejoramiento", "ampliacion", "arriendo", "densificacion"]).optional(),
        investmentUF: z.string().optional(),
        housingUnits: z.number().optional(),
        beneficiaries: z.number().optional(),
        entityPatrocinante: z.string().optional(),
        serviu: z.string().optional(),
        planRegulador: z.string().optional(),
        densityAllowed: z.string().optional(),
        landUse: z.string().optional(),
        zoning: z.string().optional(),
        restrictions: z.string().optional(),
        normative: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createProject(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        programCode: z.string().optional(),
        regionCode: z.string().optional(),
        comuna: z.string().optional(),
        address: z.string().optional(),
        lat: z.string().optional(),
        lng: z.string().optional(),
        status: z.enum(["seleccionado", "en_ejecucion", "terminado", "entregado", "por_iniciar"]).optional(),
        projectType: z.enum(["vivienda_nueva", "mejoramiento", "ampliacion", "arriendo", "densificacion"]).optional(),
        investmentUF: z.string().optional(),
        housingUnits: z.number().optional(),
        beneficiaries: z.number().optional(),
        entityPatrocinante: z.string().optional(),
        serviu: z.string().optional(),
        planRegulador: z.string().optional(),
        densityAllowed: z.string().optional(),
        landUse: z.string().optional(),
        zoning: z.string().optional(),
        restrictions: z.string().optional(),
        normative: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateProject(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteProject(input.id);
      }),
  }),

  /* ─────────── PLANS REGULADORES ─────────── */
  plansReguladores: router({
    list: publicProcedure.query(async () => {
      return await db.getAllPlansReguladores();
    }),

    byComuna: publicProcedure
      .input(z.object({ comuna: z.string() }))
      .query(async ({ input }) => {
        return await db.getPlansByComuna(input.comuna);
      }),

    byRegion: publicProcedure
      .input(z.object({ regionCode: z.string() }))
      .query(async ({ input }) => {
        return await db.getPlansByRegion(input.regionCode);
      }),

    /* ── ADMIN CRUD ── */
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        type: z.enum(["comunal", "intercomunal", "metropolitano", "seccional"]).optional(),
        regionCode: z.string(),
        comuna: z.string(),
        status: z.enum(["vigente", "en_revision", "en_actualizacion", "propuesto"]).optional(),
        densityMax: z.string().optional(),
        densityMin: z.string().optional(),
        landUsePermitted: z.string().optional(),
        landUseConditional: z.string().optional(),
        landUseProhibited: z.string().optional(),
        restrictions: z.string().optional(),
        aptForHousing: z.enum(["si", "no", "condicionado"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createPlanRegulador(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.enum(["comunal", "intercomunal", "metropolitano", "seccional"]).optional(),
        regionCode: z.string().optional(),
        comuna: z.string().optional(),
        status: z.enum(["vigente", "en_revision", "en_actualizacion", "propuesto"]).optional(),
        densityMax: z.string().optional(),
        densityMin: z.string().optional(),
        landUsePermitted: z.string().optional(),
        landUseConditional: z.string().optional(),
        landUseProhibited: z.string().optional(),
        restrictions: z.string().optional(),
        aptForHousing: z.enum(["si", "no", "condicionado"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updatePlanRegulador(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deletePlanRegulador(input.id);
      }),
  }),

  /* ─────────── STATS ─────────── */
  stats: router({
    national: publicProcedure.query(async () => {
      return await db.getAllStats();
    }),

    byRegion: publicProcedure.query(async () => {
      return await db.getStatsByRegion();
    }),

    byProgram: publicProcedure.query(async () => {
      return await db.getStatsByProgram();
    }),
  }),
});

export type AppRouter = typeof appRouter;
