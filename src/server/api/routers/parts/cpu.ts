import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import { prisma } from "../../../db";
export const cpu = createTRPCRouter({
    admin: createTRPCRouter({
        create: adminProcedure
            .input(
                z.object({
                    data: z.object({
                        name: z.string(),
                        image: z.string(),
                        socketId: z.string(),
                        brand: z.string(),
                        generation: z.number(),
                        price: z.number(),
                        cores: z.number(),
                        threads: z.number(),
                        baseClock: z.number(),
                        boostClock: z.number(),
                        tdp: z.number(),
                        cache1: z.number(),
                        cache2: z.number(),
                        cache3: z.number(),
                        launchDate: z.string(),
                        integratedGpu: z.boolean(),
                        obs: z.string().optional(),
                    }),
                })
            )
            .mutation(async ({ input, ctx }) => {
                console.log(input);
                const { socketId, ...data } = input.data;
                const cpu = await prisma.cPU.create({
                    data: {
                        ...data,
                        obs: data.obs || null,
                        socket: {
                            connect: {
                                id: socketId,
                            },
                        },
                        createdBy: {
                            connect: {
                                id: ctx.session.user.id,
                            },
                        },
                    },
                });

                return cpu;
            }),
        update: adminProcedure
            .input(
                z.object({
                    data: z.object({
                        id: z.string(),
                        name: z.string(),
                        image: z.string(),
                        socketId: z.string(),
                        brand: z.string(),
                        generation: z.number(),
                        price: z.number(),
                        cores: z.number(),
                        threads: z.number(),
                        baseClock: z.number(),
                        boostClock: z.number(),
                        tdp: z.number(),
                        cache1: z.number(),
                        cache2: z.number(),
                        cache3: z.number(),
                        launchDate: z.string(),
                        integratedGpu: z.boolean(),
                        obs: z.string(),
                    }),
                })
            )
            .mutation(async ({ input, ctx }) => {
                const { id, socketId, ...data } = input.data;
                const cpu = await prisma.cPU.update({
                    where: {
                        id,
                    },

                    data: {
                        ...data,
                        obs: data.obs || null,
                        socket: {
                            connect: {
                                id: socketId,
                            },
                        },
                        updatedBy: {
                            connect: {
                                id: ctx.session.user.id,
                            },
                        },
                        updatedAt: new Date(),
                    },
                });
                return cpu;
            }),
    }),
    getAll: publicProcedure
        .input(
            z.object({
                searchTerm: z.string().optional(),
                take: z.number().optional(),
                skip: z.number().optional(),
            })
        )
        .query(async ({ input }) => {
            const { searchTerm, take, skip } = input;

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
                      ],
                  }
                : undefined;
            const count = await prisma.cPU.count({
                where,
            });
            const cpus = await prisma.cPU.findMany({
                where,
                take: take || 10,
                skip: skip || 0,
                include: {
                    socket: true,
                },
            });

            return {
                cpus: cpus,
                count,
                pages: Math.ceil(count / (take || 10)),
            };
        }),
});