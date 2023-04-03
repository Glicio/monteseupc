import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import {prisma } from "../../../db"

export const motherBoard = createTRPCRouter({
  admin: createTRPCRouter({
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
      .mutation(async ({ input }) => {
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
            obs: data.obs || undefined,
        }
        if (id) {
            const motherboard = await prisma.motherBoard.update({
                where: {
                    id,
                },
                data: updateData
            })
            return motherboard
        }

        const motherboard = await prisma.motherBoard.create({
            data: updateData
        })
        return motherboard
      }),
    
  }),
  getAll: publicProcedure.input(z.object({
        skip: z.number().optional(),
        limit: z.number().optional(),
        orderBy: z.enum(["name", "brand", "price"]).optional(),
        socketId: z.string().optional(),
        chipsetId: z.string().optional(),
        order: z.string().optional(),
        searchTerm: z.string().optional(),
  })).query(async ({ input }) => {
    const { skip, limit, orderBy, order, searchTerm } = input

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
      },
        take: limit || undefined,
        skip: skip || undefined,
        orderBy: orderBy ? {
            [orderBy]: order || "asc"
        } : undefined

    });
    return {motherboards, count, pages: Math.ceil(count / (limit || 1))};
  }),
});
