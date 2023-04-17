import Link from "next/link";
import React from "react";
import { type GenericPart } from "../../types/parts";
import formatNumberToBRL from "../../utils/formatNumberToBRL";


const getPartLink = (type: GenericPart['type']) => {
        switch (type) {
            case "motherboard":
                return "/parts/mobo";
            case "cpu":
                return "/parts/cpus";
            case "gpu":
                return "/parts/gpus";
            case "ram":
                return "/parts/rams";
            case "storage":
                return "/parts/storages";
            case "psu":
                return "/parts/psus";
            case "case":
                return "/parts/cases";
            case "cooler":
                return "/parts/coolers";
            default:
                return "/parts";
                }
}



export default function PartListItem({ part }: {part: GenericPart}) {
    return (
        <Link className="flex w-full" href={`${getPartLink(part.type)}/${part.id}`}>
            <div className="h-[8rem] w-[8rem] overflow-hidden">
                {part.image ? (
                    <img
                        src={part.image}
                        alt="Motherboard Image"
                        style={{ height: "8rem" }}
                    />
                ) : (
                    <span>TO ADD PLACEHOLD IMAGE</span>
                )}
            </div>

            <div>
                <div className="text-lg font-bold">{part.name}</div>
                <div className="text-xs">Marca: {part.brand}</div>
                <div className="text-xs">
                    Preço base: {formatNumberToBRL(part.price)}
                </div>
            </div>
        </Link>
    );
}
