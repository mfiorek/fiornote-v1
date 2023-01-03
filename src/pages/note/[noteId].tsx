import { useEffect, useState } from "react";
import { type NextPage } from "next";
import { Folder, Note } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAddNewNote } from "../../hooks/useAddNewNote";
import ReactMarkdown from "react-markdown";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import FolderItem from "../../components/FolderItem";
import NoteItem from "../../components/NoteItem";
import AddFolderModal from "../../components/AddFolderModal";
import { DocumentIcon, ChevronLeftIcon, PencilSquareIcon, DocumentCheckIcon, ArrowUturnLeftIcon, FolderIcon, FolderPlusIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";

interface NotePageContentsProps {
  currentNote: Note;
  folderData: Folder[];
  noteData: Note[];
}

const NotePageContents: React.FC<NotePageContentsProps> = ({ currentNote, folderData, noteData }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  useEffect(() => {
    cancelEdit();
  }, [router.asPath]);

  const utils = trpc.useContext();
  const { mutate: mutateUpdateNote } = trpc.note.update.useMutation({
    onMutate: async ({ name, text }) => {
      await utils.note.getAll.cancel();
      const previousNotes = utils.note.getAll.getData();
      if (previousNotes) {
        utils.note.getAll.setData(undefined, [...previousNotes.filter((note) => note.id !== currentNote.id), { ...currentNote, name, text }]);
      }
      return previousNotes;
    },
    onError: (error, variables, context) => {
      utils.note.getAll.setData(undefined, context);
    },
    onSuccess: () => {
      utils.note.getAll.invalidate();
    },
  });
  const mutateAddNewNote = useAddNewNote();

  const { register, handleSubmit, setValue } = useForm<{ name: string; text: string }>({ defaultValues: { name: currentNote.name, text: currentNote.text } });

  const saveNote: SubmitHandler<{ name: string; text: string }> = (data) => {
    setIsEditing(false);
    mutateUpdateNote({ id: currentNote.id, name: data.name || `Untitled ${new Date().toLocaleDateString()}`, text: data.text });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setValue("name", currentNote.name);
    setValue("text", currentNote.text);
  };

  return (
    <Layout>
      <div className="grid w-full grow grid-cols-[1fr_1px_2fr] gap-2">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer rounded bg-slate-700 p-2"
                onClick={() => {
                  currentNote.parent ? router.push(`/folder/${currentNote.parent}`) : router.push("/");
                }}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <FolderIcon className="h-6 w-6" />
              <p className="text-xl">{folderData.find((folder) => folder.id === currentNote.parent)?.name || "Home"}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded bg-slate-700 p-2" onClick={() => setAddFolderModalOpen(true)}>
                <FolderPlusIcon className="h-6 w-6" />
              </button>
              <button className="rounded bg-slate-700 p-2" onClick={() => mutateAddNewNote({ id: crypto.randomUUID(), parent: currentNote.parent })}>
                <DocumentPlusIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <span className="h-px bg-slate-600" />
          <div className="flex w-full flex-col gap-2 empty:hidden">
            {folderData
              .filter((folder) => folder.parent === currentNote.parent)
              .map((folder) => (
                <FolderItem key={folder.id} folder={folder} />
              ))}
          </div>
          <div className="flex w-full flex-col gap-2 empty:hidden">
            {noteData
              .filter((note) => note.parent === currentNote.parent)
              .map((note) => (
                <NoteItem key={note.id} note={note} isSelected={note.id === currentNote.id} />
              ))}
          </div>
        </div>

        <span className="bg-slate-600" />

        {isEditing ? (
          <form id="noteForm" className="flex h-full w-full flex-col gap-2" onSubmit={handleSubmit(saveNote)}>
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder={`Untitled ${new Date().toLocaleDateString()}`}
                className="grow rounded border border-slate-400 bg-transparent px-2 py-1 text-xl focus-visible:outline focus-visible:outline-1 focus-visible:outline-slate-400"
                {...register("name")}
              />
              <div className="flex gap-2">
                <button className="cursor-pointer rounded bg-slate-700 p-2" type="submit" form="noteForm">
                  <DocumentCheckIcon className="h-6 w-6" />
                </button>
                <button className="cursor-pointer rounded bg-slate-700 p-2" onClick={cancelEdit}>
                  <ArrowUturnLeftIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <span className="h-px w-full bg-slate-600" />
            <textarea
              className="h-full w-full whitespace-pre rounded border border-slate-400 bg-transparent p-2 text-slate-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-slate-400"
              placeholder="Text"
              {...register("text")}
            />
          </form>
        ) : (
          <div className="flex flex-col gap-2 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 px-2">
                <DocumentIcon className="h-6 w-6" />
                <p className="text-xl">{currentNote.name}</p>
              </div>
              <button className="cursor-pointer rounded bg-slate-700 p-2" onClick={() => setIsEditing(true)}>
                <PencilSquareIcon className="h-6 w-6" />
              </button>
            </div>
            <span className="h-px bg-slate-600" />
            <ReactMarkdown className="h-full w-full overflow-scroll p-2">{currentNote.text}</ReactMarkdown>
          </div>
        )}
      </div>
      {addFolderModalOpen && <AddFolderModal isOpen={addFolderModalOpen} setIsOpen={setAddFolderModalOpen} parent={currentNote.parent} />}
    </Layout>
  );
};

const NotePage: NextPage = () => {
  const router = useRouter();
  const { noteId } = router.query;

  const { data: folderData, isLoading: folderLoading } = trpc.folder.getAll.useQuery();
  const { data: noteData, isLoading: noteLoading } = trpc.note.getAll.useQuery();

  if (folderLoading || noteLoading || !folderData || !noteData) {
    return (
      <Layout>
        <Loader text="Loading data..." />
      </Layout>
    );
  }
  const currentNote = noteData.find((note) => note.id === noteId);
  if (!currentNote) {
    router.push("/404");
    return null;
  }
  return <NotePageContents currentNote={currentNote} folderData={folderData} noteData={noteData} />;
};

export default NotePage;
