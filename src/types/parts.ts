export interface GenericPart {
    id: string;
    name: string;
    image?: string;
    brand: string;
    price: number;
    approvedAt?: string;
    createdAt?: string;
    type:
        | "cpu"
        | "gpu"
        | "ram"
        | "motherboard"
        | "storage"
        | "psu"
        | "case"
        | "cooler"
        | "monitor"
        | "keyboard"
        | "mouse"
        | "headset"
        | "speaker"
        | "accessory"
        | "other";
}

export enum PartType {
    CPU = "cpu",
    GPU = "gpu",
    RAM = "ram",
    MOTHERBOARD = "motherboard",
    STORAGE = "storage",
    PSU = "psu",
    CASE = "case",
    COOLER = "cooler",
    MONITOR = "monitor",
    KEYBOARD = "keyboard",
    MOUSE = "mouse",
    HEADSET = "headset",
}