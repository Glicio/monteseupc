import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../../trpc";

import { prisma } from "../../../db";

import { TRPCError } from "@trpc/server";

export const chipsets = createTRPCRouter({
  admin: createTRPCRouter({
    create: adminProcedure
      .input(
        z.object({ name: z.string(), brand: z.string(), socketId: z.string() })
      )
      .mutation(async ({ input }) => {
        console.log("input ", input);
        try {
          const chipset = await prisma.chipset.create({
            data: {
              name: input.name,
              brand: input.brand,
              socket: {
                connect: {
                  id: input.socketId,
                },
              },
            },
          });
          return chipset;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao criar chipset",
          });
        }
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string(),
          brand: z.string(),
          socketId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const chipset = await prisma.chipset.update({
            where: {
              id: input.id,
            },
            data: {
              name: input.name,
              brand: input.brand,
              socket: {
                connect: {
                  id: input.socketId,
                },
              },
            },
          });
          return chipset;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao atualizar chipset",
          });
        }
      }),
    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const chipset = await prisma.chipset.delete({
            where: {
              id: input.id,
            },
          });
          return chipset;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao deletar chipset",
          });
        }
      }),
  }),
  getAll: publicProcedure
    .input(
      z.object({
        searchTerm: z.string().optional(),
        skip: z.number().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const { searchTerm, skip, take } = input;
      const where = searchTerm
        ? {
            OR: [
              {
                name: {
                  contains: searchTerm,
                },
              },
              {
                brand: {
                  contains: searchTerm,
                },
              },
              {
                socket: {
                  name: {
                    contains: searchTerm,
                  },
                },
              },
            ],
          }
        : undefined;
      try {
        const count = await prisma.chipset.count({
            where: where,
            });

        const chipsets = await prisma.chipset.findMany({
          where: where,
          skip: skip || undefined,
          take: take || undefined,
          include: {
            socket: true,
          },
        });
        return {chipsets, count, pages: Math.ceil(count / (take || 1))};
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar chipsets",
        });
      }
    }),
});
