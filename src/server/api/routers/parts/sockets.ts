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
  getAll: publicProcedure.input(z.object({}).optional()).query(async () => {
    try {
      const sockets = await prisma.socket.findMany();
      return sockets;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar sockets",
      });
    }
  }),
});
