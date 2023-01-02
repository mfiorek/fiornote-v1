import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import FolderItem from "../../components/FolderItem";
import NoteItem from "../../components/NoteItem";
import { useRouter } from "next/router";

const FolderId: NextPage = () => {
  const router = useRouter();
  const { folderId } = router.query;
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
      <h1 className="text-7xl font-extralight text-white">{folderData.find((folder) => folder.id === folderId)?.name}</h1>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col gap-2">
          {folderData
            .filter((folder) => folder.parent === folderId)
            .map((folder) => (
              <FolderItem folder={folder} />
            ))}
        </div>
        <div className="flex w-full flex-col gap-2">
          {noteData
            .filter((folder) => folder.parent === folderId)
            .map((note) => (
              <NoteItem name={note.name} />
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default FolderId;
