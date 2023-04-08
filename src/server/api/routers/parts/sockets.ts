import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../../trpc";

import { prisma } from "../../../db";

import { TRPCError } from "@trpc/server";

export const sockets = createTRPCRouter({
  admin: createTRPCRouter({
    create: adminProcedure
      .input(z.object({ name: z.string(), brand: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const socket = await prisma.socket.create({
            data: {
              name: input.name,
              brand: input.brand,
            },
          });
          return socket;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao criar socket",
          });
        }
      }),
    update: adminProcedure
      .input(z.object({ id: z.string(), name: z.string(), brand: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const socket = await prisma.socket.update({
            where: {
              id: input.id,
            },
            data: {
              name: input.name,
              brand: input.brand,
            },
          });
          return socket;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao atualizar socket",
          });
        }
      }),
    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const socket = await prisma.socket.delete({
            where: {
              id: input.id,
            },
          });
          return socket;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao deletar socket",
          });
        }
      }),
  }),
  getAll: publicProcedure.input(z.object({
    searchTerm: z.string().optional(),
    skip: z.number().optional(),
    take: z.number().optional(),
  })).query(async ({input}) => {

      const { searchTerm, skip, take } = input;

      const where = searchTerm ? {
        OR: [
          { name: { contains: searchTerm} },
          { brand: { contains: searchTerm} },
        ],
      } : undefined;

      const count = await prisma.socket.count({
        where,
      });
      const sockets = await prisma.socket.findMany({
        where,
        skip,
        take,
      });
      return {sockets, count, pages: Math.ceil(count / (take || 1))};

  }),
  getOne: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const socket = await prisma.socket.findUnique({
      where: {
        id: input.id,
      },
    });
    return socket;
  }
  ),
});
