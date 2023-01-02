import { router, protectedProcedure } from "../trpc";

export const noteRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
