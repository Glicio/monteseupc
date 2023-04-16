import { type GraphicsCard } from "@prisma/client";
import { z } from "zod";
import { db, prisma } from "../../db";

export const GpuParser = z.object({
    id: z.string().optional(),
    name: z.string().min(1).max(100),
    image: z.string(),
    link: z.string(),
    brand: z.string(),
    price: z.number(),
    clock: z.number(),
    //memory
    memory: z.number(),
    memoryType: z.enum(["GDDR5", "GDDR6", "GDDR6X", "GDDR7", "HBM2", "HBM3", "HBM4"]),
    memoryClock: z.number(),
    //interface
    pciGen: z.enum(["1", "2", "3", "4"]),
    displayPort: z.number(),
    hdmi: z.number(),
    dvi: z.number(),
    vga: z.number(),
    //power
    recommendedPsu: z.number(),
    tdp: z.number(),
    //relations
    approvedById: z.string().optional(),
    createdById: z.string().optional(),
    updatedById: z.string().optional(),
    //timestamps
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    approvedAt: z.date().optional(),

    //misc
    obs: z.string().optional(),
});



/**
 * @description Get all graphics cards
 * @param {number} take - The number of graphics cards to take
 * @param {number} skip - The number of graphics cards to skip
 * @param {string} searchTerm - The search term to filter graphics cards by
 * **/
export async function getGraphicsCards(
    take?: number,
    skip?: number,
    searchTerm?: string,
    orderBy?: "name" | "price" | "createdAt",
    order?: "asc" | "desc"
) {
    const where = searchTerm ? `WHERE name LIKE '%${searchTerm}%'` : "";
    const orderString = orderBy
        ? `ORDER BY ${orderBy} ${order ? order.toUpperCase() : ""}`
        : "";
    const query = `SELECT * FROM GraphicsCard ${where} ${orderString} LIMIT ${
        take || 20
    } OFFSET ${skip || 0}`;

    const cardsQuery = await db.execute(query);
    return cardsQuery.rows as GraphicsCard[];
}

export type CreateGpuInput = Omit<
        z.infer<typeof GpuParser>,
        | "createdById"
        | "createdAt"
        | "updatedById"
        | "updatedAt"
        | "approvedById"
        | "approvedAt"
        | "id"
        | "approved"
   >
/**
* @description Create a new graphics card in the database
* @param {string} usrId - The id of the user creating the graphics card
* @param {CreateGpuInput} data - The data to create the graphics card with
* @returns {Promise<GraphicsCard>} - The created graphics card
**/
export async function createGpu(
    usrId: string,
    data: CreateGpuInput) {
    const gpu = await prisma.graphicsCard.create({
        data: {
            ...data,
            createdBy: {
                connect: {
                    id: usrId,
                },
            },
        },
    });
    return gpu;
}
