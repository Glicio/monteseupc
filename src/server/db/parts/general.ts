import { db } from "../../db";
import { type GenericPart } from "../../../types/parts";

export const getLastAddedParts = async (
    approvedOnly: boolean,
    limit?: number
) => {
    const fields = [
        "id",
        "approved",
        "name",
        "brand",
        "price",
        "image",
        "createdAt",
    ].join(", ");
    const approvedOnlyQuery = approvedOnly ? "WHERE approved = true" : "";
    const partsQuery = await db.execute(
        `SELECT * FROM (SELECT ${fields},'mobo' as type FROM MotherBoard ${approvedOnlyQuery} 
                        UNION 
                        SELECT ${fields}, 'cpu' as type FROM CPU ${approvedOnlyQuery})
                        AS parts
                        ORDER BY createdAt DESC LIMIT 
                        ${limit || 20 }`
    );

    return partsQuery.rows as GenericPart[];
};
