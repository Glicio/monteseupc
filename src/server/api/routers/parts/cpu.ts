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
                        approved: true,
                        approvedBy: {
                            connect: {
                                id: ctx.session.user.id,
                            },
                        },
                        approvedAt: new Date(),
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
                        obs: z.string().optional(),
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
        delete: adminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ input }) => {

            const cpu = await prisma.cPU.delete({
                where: {
                    id: input.id,
                },
            });

            return cpu;
        }
                 ),
    }),
    getAll: publicProcedure
        .input(
            z.object({
                searchTerm: z.string().optional(),
                approved: z.boolean().optional(),
                sort: z.enum(["createdAt","name","price","approvedAt"]).optional(),
                take: z.number().optional(),
                skip: z.number().optional(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { searchTerm, take, skip, approved, sort } = input;

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
                      approved: approved || undefined,
                  }
                : {
                approved: approved || undefined,
                }
            const count = await prisma.cPU.count({
                where,
            });
            const cpus = await prisma.cPU.findMany({
                where,
                take: take || 10,
                skip: skip || 0,
                include: {
                    socket: true,
                    updatedBy: ctx.session?.user?.isAdmin || false,
                    createdBy: ctx.session?.user?.isAdmin || false,
                },
                orderBy: {
                    [sort || "createdAt"]: "desc",
                }
            });

            return {
                cpus: cpus,
                count,
                pages: Math.ceil(count / (take || 10)),
            };
        }),
});
