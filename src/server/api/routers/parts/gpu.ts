import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createGpu, GpuParser } from "../../../db/parts/graphics-card";
import { TRPCError } from "@trpc/server";

export const gpu = createTRPCRouter({
    admin: createTRPCRouter({
        create: protectedProcedure
            .input(
                GpuParser.omit({
                    id: true,
                    createdById: true,
                    createdAt: true,
                    updatedById: true,
                    updatedAt: true,
                    approvedById: true,
                    approvedAt: true,
                })
            ).mutation(async ({ input, ctx }) => {
                if(!ctx.session.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Você precisa estar logado para fazer isso!" });
                const gpu = await createGpu(ctx.session.user.id, input);
                return gpu;
            }),
    }),

        create: protectedProcedure
            .input(
                GpuParser.omit({
                    id: true,
                    createdById: true,
                    createdAt: true,
                    updatedById: true,
                    updatedAt: true,
                    approvedById: true,
                    approvedAt: true,
                    //users cant create approved gpus
                    approved: true,
                })
            ).mutation(async ({ input, ctx }) => {
                if(!ctx.session.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Você precisa estar logado para fazer isso!" });
                const gpu = await createGpu(ctx.session.user.id, input);
                return gpu;
            }),
});
