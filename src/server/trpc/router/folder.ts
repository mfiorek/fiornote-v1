import { router, protectedProcedure } from "../trpc";

export const folderRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.folder.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
