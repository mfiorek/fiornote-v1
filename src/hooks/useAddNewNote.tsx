import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export const useAddNewNote = () => {
  const router = useRouter();

  const utils = trpc.useContext();
  const { mutate: mutateAddNote } = trpc.note.add.useMutation({
    onMutate: async ({ id, parentFolderId }) => {
      await utils.note.getAll.cancel();
      const previousNotes = utils.note.getAll.getData();
      if (previousNotes) {
        utils.note.getAll.setData(undefined, [
          ...previousNotes,
          { id, parentFolderId, createdAt: new Date(), updatedAt: new Date(), name: `New note ${new Date().toLocaleDateString()}`, text: "", userId: "" },
        ]);
      }
      return previousNotes;
    },
    onError: (error, variables, context) => {
      utils.note.getAll.setData(undefined, context);
    },
    onSuccess: (result, variables, context) => {
      utils.note.getAll.invalidate();
    },
  });

  return mutateAddNote;
};
