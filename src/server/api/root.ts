import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { user } from "./routers/user";
import { sockets } from "./routers/parts/sockets";
import { chipsets } from "./routers/parts/chipsets";
import { motherBoard } from "./routers/parts/motherboards";
import { cpu } from "./routers/parts/cpu";

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
    chipsets: chipsets,
    motherBoards: motherBoard,
    cpu: cpu, 
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;
