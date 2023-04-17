import { z } from "zod";
import { db } from "../../db";

export const MotherBoardParser = z.object({
    id: z.string(),
    approved: z.coerce.boolean(),
    name: z.string(),
    socketId: z.string(),
    socketName: z.string(),
    brand: z.string(),
    price: z.coerce.number(),
    image: z.string().nullable(),
    link: z.string(),
    ramSlots: z.coerce.number(),
    ramType: z.string(),
    ramMaxSize: z.coerce.number(),
    ramMaxSpeed: z.coerce.number(),
    ramChannels: z.coerce.number(),
    ramEcc: z.coerce.boolean(),
    usb2: z.coerce.number(),
    usb3: z.coerce.number(),
    usb3_1: z.coerce.number(),
    usb3_2: z.coerce.number(),
    usbTypeC: z.coerce.number(),
    sata: z.coerce.number(),
    m2: z.coerce.number(),
    pcieX16: z.coerce.number(),
    pciGen: z.string(),
    size: z.string(),
    chipsetId: z.string(),
    obs: z.string().nullable(),
    launchDate: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
    createdById: z.string().nullable(),
    createdByName: z.string().nullable(),
    updatedAt: z.coerce.date().nullable(),
    updatedById: z.string().nullable(),
    approvedAt: z.coerce.date().nullable(),
    approvedById: z.string().nullable(),
});

export type MotherBoard = z.infer<typeof MotherBoardParser>;

export const getMotherboardById = async (id: string) => {
    const smt = `SELECT MotherBoard.*, User.name As createdByName, Socket.name as socketName FROM MotherBoard 
                    JOIN User ON User.id = MotherBoard.createdById
                    JOIN Socket ON Socket.id = MotherBoard.socketId
                    WHERE MotherBoard.id = ?`;
    const query = await db.execute(smt, [id]);
    console.log(query);
    const motherboard = MotherBoardParser.parse(query.rows[0]);
    return motherboard;
};
