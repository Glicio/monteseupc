export interface GenericPart {
    id: string;
    name: string;
    image: string;
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

export interface GraphicsCard extends Omit<GenericPart, "type"> {
    clock: number;
    memory: number;
    memoryType: string;
    memoryClock: number;
    pciGen: string;
    displayPort: number;
    hdmi: number;
    dvi: number;
    vga: number;
    recommendedPsu: number;
    tdp: number;
    approvedById: string;
    createdById: string;
    updatedById: string;
    createdAt: string;
    updatedAt: string;
    approvedAt: string;
    obs: string;
}
