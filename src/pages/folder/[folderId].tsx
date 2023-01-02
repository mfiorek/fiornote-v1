import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import FolderItem from "../../components/FolderItem";
import NoteItem from "../../components/NoteItem";
import { ChevronLeftIcon, FolderPlusIcon, PencilIcon } from "@heroicons/react/24/outline";

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

  const currentFolder = folderData.find((folder) => folder.id === folderId);

  return (
    <Layout>
      <div className="mb-4 flex w-full items-center justify-between">
        <div
          className="cursor-pointer rounded bg-slate-700 p-2"
          onClick={() => {
            currentFolder?.parent ? router.push(`/folder/${currentFolder.parent}`) : router.push("/");
          }}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </div>
        <div className="flex gap-2">
          <div className="rounded bg-slate-700 p-2">
            <FolderPlusIcon className="h-6 w-6" />
          </div>

          <div className="rounded bg-slate-700 p-2">
            <PencilIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid w-full grow grid-cols-[1fr_1px_2fr] gap-2">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2 empty:hidden">
            {folderData
              .filter((folder) => folder.parent === currentFolder?.parent)
              .map((folder) => (
                <FolderItem key={folder.id} folder={folder} isSelected={folder.id === currentFolder?.id} />
              ))}
          </div>
          <div className="flex w-full flex-col gap-2 empty:hidden">
            {noteData
              .filter((note) => note.parent === currentFolder?.parent)
              .map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
          </div>
        </div>

        <span className="bg-slate-600" />

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2 empty:hidden">
            {folderData
              .filter((folder) => folder.parent === folderId)
              .map((folder) => (
                <FolderItem key={folder.id} folder={folder} />
              ))}
          </div>
          <div className="flex w-full flex-col gap-2 empty:hidden">
            {noteData
              .filter((note) => note.parent === folderId)
              .map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FolderId;
