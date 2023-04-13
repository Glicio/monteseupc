export interface Part {
    id: string;
    name: string;
    image: string;
    brand: string;
    price: number;
    approvedAt?: string;
    createdAt?: string
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
