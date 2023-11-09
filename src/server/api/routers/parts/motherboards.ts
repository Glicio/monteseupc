import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import { prisma } from "../../../db";
import { type Prisma } from "@prisma/client";
import { PartType } from "../../../../types/parts";
import { Mobo } from "../../../../pages/admin/parts/mobo";

export const motherBoard = createTRPCRouter({
  admin: createTRPCRouter({
    //TODO: split this into two procedures
    createOrUpdate: adminProcedure
      .input(
        z.object({
          id: z.string().optional(),
          data: z.object({
            name: z.string(),
            brand: z.string(),
            price: z.number(),
            image: z.string().nullable().optional(),
            link: z.string().nullable().optional(),
            motherBoard: z.object({
              socketId: z.string(),
              chipsetId: z.string(),
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
            }),
            obs: z.string().nullable().optional(),
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, data } = input;

        const partData: Prisma.PartCreateArgs = {
          data: {
            name: data.name,
            brand: data.brand,
            type: PartType.MOTHERBOARD,
            image: data.image || undefined,
            link: data.link || undefined,
            price: data.price,
            obs: data.obs || "",
            createdBy: {
              connect: {
                id: ctx.session?.user?.id,
              },
            },
          },
        };

        const motherBoardData = {
          ramSlots: data.motherBoard.ramSlots,
          ramType: data.motherBoard.ramType,
          ramMaxSize: data.motherBoard.ramMaxSize,
          ramMaxSpeed: data.motherBoard.ramMaxSpeed,
          ramChannels: data.motherBoard.ramChannels,
          ramEcc: data.motherBoard.ramEcc,
          usb2: data.motherBoard.usb2,
          usb3: data.motherBoard.usb3,
          usb3_1: data.motherBoard.usb3_1,
          usb3_2: data.motherBoard.usb3_2,
          usbTypeC: data.motherBoard.usbTypeC,
          sata: data.motherBoard.sata,
          m2: data.motherBoard.m2,
          pcieX16: data.motherBoard.pcieX16,
          pciGen: data.motherBoard.pciGen,
          size: data.motherBoard.size,
          launchDate: data.motherBoard.launchDate || undefined,
          socket: {
            connect: {
              id: data.motherBoard.socketId,
            },
          },
          chipset: {
            connect: {
              id: data.motherBoard.chipsetId,
            },
          },
        };

        if (id) {
          const updatePart = await prisma.part.update({
            where: {
              id: id,
            },
            data: {
              ...partData.data,
              motherBoard: {
                update: {
                  ...motherBoardData,
                },
              },
            },
            include: {
              motherBoard: true,
            },
          });

          return updatePart;
        }
        const createPart = await prisma.part.create({
          data: {
            ...partData.data,
            motherBoard: {
              create: {
                ...motherBoardData,
              },
            },
          },
          include: {
            motherBoard: true,
          },
        });
        return createPart;
      }),
    delete: adminProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const motherboard = await prisma.motherBoard.delete({
          where: {
            id: input.id,
          },
        });
        return motherboard;
      }),
  }),
  getAll: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        sortBy: z.enum(["name", "brand", "price"]).optional(),
        socketId: z.string().optional(),
        chipsetId: z.string().optional(),
        order: z.string().optional(),
        searchTerm: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { skip, take, sortBy, order, searchTerm } = input;

      const where: Prisma.PartWhereInput = {
        OR: searchTerm
          ? [
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
            ]
          : undefined,
        motherBoard: {
          socket: {
            id: input.socketId || undefined,
          },
          chipset: {
            id: input.chipsetId || undefined,
          },
        },
      };

      const count = await prisma.part.count({
        where: where,
      });
      const motherboards = await prisma.part.findMany({
        where: where,
        include: {
          motherBoard: {
            include: {
              socket: true,
              chipset: true,
            },
          },
        },
        skip: skip,
        take: take,
        orderBy: { [sortBy || "name"]: order || "asc" },
      });

      return {
        motherboards,
        count,
        pages: Math.ceil(count / (take || 1)),
      };
    }),
});
