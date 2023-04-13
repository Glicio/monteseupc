import React from "react";
import { type Part } from "../../types/parts";

export const PartCard = ({ part }: { part: Part }) => {
    return (
        <div className="h-[8rem] w-[8rem]">
            <span>{part.name}</span>
            <span>{part.createdAt ? new Date(part.createdAt).toLocaleDateString() : ""}</span>

            <span>{part.approvedAt ? new Date(part.approvedAt).toLocaleDateString() : ""}</span>

        </div>
    );
};
// show the last pc components added to the database
export default function LastAdded({ parts }: { parts: Part[] }) {
    return (
        <div className="flex gap-2">
            {parts.map((part) => (
                <PartCard part={part} key={part.id} />
            ))}
        </div>
    );
}
