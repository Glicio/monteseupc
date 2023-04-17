import { connect } from "@planetscale/database";
import { PrismaClient } from "@prisma/client";

import { env } from "../env/server.mjs";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const config = {
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
};

export const db = connect(config);

export const prisma =
    global.prisma ||
    new PrismaClient({
        log:
            env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

if (env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
