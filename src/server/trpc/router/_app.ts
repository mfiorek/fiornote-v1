import { router } from "../trpc";
import { folderRouter } from "./folder";
import { noteRouter } from "./note";

export const appRouter = router({
  folder: folderRouter,
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
