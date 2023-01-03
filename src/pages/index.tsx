import { useState } from "react";
import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import Loader from "../components/Loader";
import Layout from "../components/Layout";
import FolderItem from "../components/FolderItem";
import NoteItem from "../components/NoteItem";
import AddFolderModal from "../components/AddFolderModal";
import { FolderPlusIcon, PencilIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  const { data: folderData, isLoading: folderLoading } = trpc.folder.getAll.useQuery();
  const { data: noteData, isLoading: noteLoading } = trpc.note.getAll.useQuery();

  if (folderLoading || noteLoading || !folderData || !noteData) {
    return (
      <Layout>
        <Loader text="Loading data..." />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="mx-auto w-full lg:max-w-5xl">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-2xl font-extralight">fiornote</h1>
          <div className="flex gap-2">
            <button className="rounded bg-slate-700 p-2" onClick={() => setAddFolderModalOpen(true)} >
              <FolderPlusIcon className="h-6 w-6" />
            </button>
            <button className="rounded bg-slate-700 p-2">
              <PencilIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2">
            {folderData
              .filter((folder) => !folder.parent)
              .map((folder) => (
                <FolderItem key={folder.id} folder={folder} />
              ))}
          </div>
          <div className="flex w-full flex-col gap-2">
            {noteData
              .filter((note) => !note.parent)
              .map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
          </div>
        </div>
      </div>
      {addFolderModalOpen && <AddFolderModal isOpen={addFolderModalOpen} setIsOpen={setAddFolderModalOpen} parent={null} />}
    </Layout>
  );
};

export default Home;
