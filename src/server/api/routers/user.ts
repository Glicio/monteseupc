import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, adminProcedure } from "../trpc";

export const user = createTRPCRouter({
  admin: createTRPCRouter({
    get: adminProcedure
      .input(
        z.object({
          searchTerm: z.string().optional(),
          take: z.number().optional(),
          skip: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { searchTerm } = input;
        const count = await prisma.user.count({
          where: searchTerm
            ? {
                OR: [
                  {
                    name: {
                      contains: searchTerm,
                    },
                  },
                  {
                    email: {
                      contains: searchTerm,
                    },
                  },
                ],
              }
            : undefined,
        });
        const users = await prisma.user.findMany({
          where: searchTerm
            ? {
                OR: [
                  {
                    name: {
                      contains: searchTerm,
                    },
                  },
                  {
                    email: {
                      contains: searchTerm,
                    },
                  },
                ],
              }
            : undefined,
          take: input.take || 10,
          skip: input.skip || 0,
        });
        return { users, count };
      }),
    setRole: adminProcedure
      .input(
        z.object({
          id: z.string(),
          role: z.enum(["ADMIN", "USER", "MODERATOR"]),
        })
      )
      .mutation(async ({ input }) => {
        const { id } = input;
        const user = await prisma.user.update({
          where: {
            id,
          },
          data: {
            isAdmin: input.role === "ADMIN",
            isMod: input.role === "MODERATOR",
          },
        });
        return user;
      }),
    banUser: adminProcedure
      .input(
        z.object({
          id: z.string(),
          ban: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        const { id } = input;
        const user = await prisma.user.update({
          where: {
            id,
          },
          data: {
            isBanned: input.ban,
          },
        });
        return user;
      }),
  }),
});
