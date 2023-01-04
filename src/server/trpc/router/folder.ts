import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const folderRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        parentFolderId: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.folder.create({
        data: {
          id: input.id,
          name: input.name,
          parentFolderId: input.parentFolderId,
          userId: ctx.session.user.id,
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.folder.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
