import { Part } from "@prisma/client";
import React from "react";

export default function GenericPartCard({ part }: { part: Part }) {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return (
        <div className="flex h-40 w-40 flex-col justify-center bg-[var(--color-neutral-2)] p-2 overflow-hidden">
            <div className="mx-auto h-[5rem] w-[5rem]">
                {part.image && (
                    <img
                        src={part.image}
                        alt={`image for ${part.name}`}
                        className="h-full"
                    />
                )}
            </div>
            <span className=" overflow-hidden text-ellipsis whitespace-nowrap">
                {part.name}
            </span>
            <span className="text-xs text-gray-400">
                ~ {formatter.format(part.price as number / 100)}
            </span>
        </div>
    );
}
