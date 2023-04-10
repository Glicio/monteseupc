import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import {prisma } from "../../../db"

export const motherBoard = createTRPCRouter({
  admin: createTRPCRouter({
      //TODO: split this into two procedures
    createOrUpdate: adminProcedure
      .input(
        z.object({
          id: z.string().optional(),
          data: z.object({
            name: z.string(),
            socketId: z.string(),
            chipsetId: z.string(),
            brand: z.string(),
            price: z.number(),
            image: z.string().nullable().optional(),
            link: z.string().nullable().optional(),
            ramSlots: z.number(),
            ramType: z.string(),
            ramMaxSize: z.number(),
            ramMaxSpeed: z.number(),
            ramChannels: z.number(),
            ramEcc: z.boolean(),
            usb2: z.number(),
            usb3: z.number(),
            usb3_1: z.number(),
            usb3_2: z.number(),
            usbTypeC: z.number(),
            sata: z.number(),
            m2: z.number(),
            pcieX16: z.number(),
            pciGen: z.string(),
            size: z.string(),
            launchDate: z.date().nullable().optional(),
            obs: z.string().nullable().optional(),
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, data } = input;

        const updateData = {
            name: data.name,
            socket: {
                connect: {
                    id: data.socketId,
                },
            },
            chipset: {
                connect: {
                    id: data.chipsetId,
                },
            },
            brand: data.brand,
            image: data.image || undefined,
            link: data.link || undefined,
            price: data.price,
            ramSlots: data.ramSlots,
            ramType: data.ramType,
            ramMaxSize: data.ramMaxSize,
            ramMaxSpeed: data.ramMaxSpeed,
            ramChannels: data.ramChannels,
            ramEcc: data.ramEcc,
            usb2: data.usb2,
            usb3: data.usb3,
            usb3_1: data.usb3_1,
            usb3_2: data.usb3_2,
            usbTypeC: data.usbTypeC,
            sata: data.sata,
            m2: data.m2,
            pcieX16: data.pcieX16,
            pciGen: data.pciGen,
            size: data.size,
            launchDate: data.launchDate || undefined,
            obs: data.obs || "",
        }
        if (id) {
            const motherboard = await prisma.motherBoard.update({
                where: {
                    id,
                },
                data: {
                    ...updateData,
                    updatedAt: new Date(),
                    updatedBy: {
                        connect: {
                            id: ctx.session.user.id,
                        }
                    }
                }
            })
            return motherboard
        }

        const motherboard = await prisma.motherBoard.create({
            data: {
                ...updateData,
                approved: true,
                approvedBy: {
                    connect: {
                        id: ctx.session.user.id,
                    }
                },
                approvedAt: new Date(),
                createdBy:{
                    connect: {
                        id: ctx.session.user.id,
                    }
                }
            }
        })
        return motherboard
      }),
      delete: adminProcedure.input(z.object({
            id: z.string()
        })).mutation(async ({ input }) => {

            const motherboard = await prisma.motherBoard.delete({
                where: {
                    id: input.id,
                }
            })
            return motherboard
        }
                    ),
    
  }),
  getAll: publicProcedure.input(z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        sortBy: z.enum(["name", "brand", "price"]).optional(),
        socketId: z.string().optional(),
        chipsetId: z.string().optional(),
        order: z.string().optional(),
        searchTerm: z.string().optional(),
  })).query(async ({ input, ctx }) => {
    const { skip, take, sortBy, order, searchTerm } = input

    const where = {
        OR: searchTerm ? [
            {
                name: {
                    contains: searchTerm,
                    
                }
            },
            {
                brand: {
                    contains: searchTerm,

                }
            }
        ] : undefined,
        socket: {
            id: input.socketId || undefined
        },
        chipset: {
            id: input.chipsetId || undefined
        }
    }

    const count = await prisma.motherBoard.count({
        where: where
    })
    const motherboards = await prisma.motherBoard.findMany({
        where: where,
      include: {
        socket: true,
        chipset: true,
        //só inclui se o usuário for admin
        createdBy: {
            select: {
                name: !!ctx.session?.user?.isAdmin,
            }
        },
        updatedBy: {
            select: {
                name: !!ctx.session?.user?.isAdmin,
            }
        }
        
      },
        take: take || undefined,
        skip: skip || undefined,
        orderBy:  sortBy ? {
            [sortBy]: order || "asc"
        } : undefined

    });

    return {motherboards, count, pages: Math.ceil(count / (take || 1))};
  }),
});
