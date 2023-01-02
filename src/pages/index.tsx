import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import Loader from "../components/Loader";
import Layout from "../components/Layout";
import FolderItem from "../components/FolderItem";
import NoteItem from "../components/NoteItem";

const Home: NextPage = () => {
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
      <h1 className="text-7xl font-extralight text-white">fiornote</h1>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col gap-2">
          {folderData.map((folder) => (
            <FolderItem name={folder.name} />
          ))}
        </div>
        <div className="flex w-full flex-col gap-2">
          {noteData.map((note) => (
            <NoteItem name={note.name} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
