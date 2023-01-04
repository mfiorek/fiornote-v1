import { useState } from "react";
import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useAddNewNote } from "../hooks/useAddNewNote";
import Loader from "../components/Loader";
import Layout from "../components/Layout";
import FolderItem from "../components/FolderItem";
import NoteItem from "../components/NoteItem";
import AddFolderModal from "../components/AddFolderModal";
import { HomeIcon, DocumentPlusIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  const { data: folderData, isLoading: folderLoading } = trpc.folder.getAll.useQuery();
  const { data: noteData, isLoading: noteLoading } = trpc.note.getAll.useQuery();
  const mutateAddNewNote = useAddNewNote();

  if (folderLoading || noteLoading || !folderData || !noteData) {
    return (
      <Layout>
        <Loader text="Loading data..." />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="mx-auto flex flex-col gap-2 w-full lg:max-w-5xl">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <HomeIcon className="h-6 w-6" />
            <p className="text-xl">Home</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded bg-slate-700 p-2" onClick={() => setAddFolderModalOpen(true)}>
              <FolderPlusIcon className="h-6 w-6" />
            </button>
            <button className="rounded bg-slate-700 p-2" onClick={() => mutateAddNewNote({ id: crypto.randomUUID(), parentFolderId: null })}>
              <DocumentPlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <span className="h-px bg-slate-600" />
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2">
            {folderData
              .filter((folder) => !folder.parentFolderId)
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((folder) => (
                <FolderItem key={folder.id} folder={folder} />
              ))}
          </div>
          <div className="flex w-full flex-col gap-2">
            {noteData
              .filter((note) => !note.parentFolderId)
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
          </div>
        </div>
      </div>
      {addFolderModalOpen && <AddFolderModal isOpen={addFolderModalOpen} setIsOpen={setAddFolderModalOpen} parentFolderId={null} />}
    </Layout>
  );
};

export default Home;
