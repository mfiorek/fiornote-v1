import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const noteRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, name, text } = input;
      return ctx.prisma.note.update({
        where: {
          id,
        },
        data: {
          name,
          text,
        },
      });
    }),
});
