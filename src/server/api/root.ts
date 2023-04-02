import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { user } from "./routers/user";
import { sockets } from "./routers/parts/sockets";
import { chipsets } from "./routers/parts/chipsets";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: user,
  parts: createTRPCRouter({
    sockets: sockets,
    chipsets: chipsets
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;
