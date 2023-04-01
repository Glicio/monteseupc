import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
      .mutation(async ({ input, ctx }) => {
        const { searchTerm } = input;
        try {
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
          return {users, count}
        } catch (error) {
          throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Erro interno do servidor"});
        }
      }),
  }),
});
