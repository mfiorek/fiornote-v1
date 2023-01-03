import React, { Dispatch, SetStateAction } from "react";
import { trpc } from "../utils/trpc";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";

interface AddFolderModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  parent: string | null;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({ isOpen, setIsOpen, parent }) => {
  const utils = trpc.useContext();
  const { mutate: mutateAddFolder } = trpc.folder.add.useMutation({
    onMutate: async ({ id, name, parent }) => {
      await utils.folder.getAll.cancel();
      const previousFolders = utils.folder.getAll.getData();
      if (previousFolders) {
        utils.folder.getAll.setData(undefined, [...previousFolders, { id, name, parent, createdAt: new Date(), updatedAt: new Date(), userId: "" }]);
      }
      return previousFolders;
    },
    onError: (error, variables, context) => {
      utils.folder.getAll.setData(undefined, context);
    },
    onSuccess: () => {
      utils.folder.getAll.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({ defaultValues: { name: "" } });

  const handleAddFolder: SubmitHandler<{ name: string }> = (data) => {
    mutateAddFolder({ id: crypto.randomUUID(), name: data.name, parent: parent });
    setIsOpen(false);
  };

  return (
    <Dialog as="div" className="relative z-10 text-slate-50" open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 bg-black bg-opacity-70" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-slate-700 p-4 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h3" className="text-2xl font-bold leading-6">
              New folder
            </Dialog.Title>

            <form onSubmit={handleSubmit(handleAddFolder)} className="mt-8 flex flex-col">
              <input
                type="text"
                placeholder="Folder name"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Name can't be empty...",
                  },
                })}
                className={`border-b border-slate-400 bg-transparent py-2 text-xl focus-visible:outline-none ${errors.name && "border-red-500"}`}
              />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
              <button type="submit" className="ml-auto mt-8 inline-flex w-24 justify-center rounded-md border border-sky-600 bg-sky-700 px-4 py-2 hover:bg-sky-600">
                Add
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddFolderModal;
