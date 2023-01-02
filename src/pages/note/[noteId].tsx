import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import FolderItem from "../../components/FolderItem";
import NoteItem from "../../components/NoteItem";
import { ChevronLeftIcon, FolderPlusIcon, PencilIcon } from "@heroicons/react/24/outline";

const NoteId: NextPage = () => {
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

  return (
    <Layout>
      <div className="mb-4 flex w-full items-center justify-between">
        <div
          className="cursor-pointer rounded bg-slate-700 p-2"
          onClick={() => {
            currentNote?.parent ? router.push(`/folder/${currentNote.parent}`) : router.push("/");
          }}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </div>
      </div>

      <div className="grid w-full grow grid-cols-[1fr_1px_2fr] gap-2">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2 empty:hidden">
            {folderData
              .filter((folder) => folder.parent === currentNote?.parent)
              .map((folder) => (
                <FolderItem key={folder.id} folder={folder} />
              ))}
          </div>
          <div className="flex w-full flex-col gap-2 empty:hidden">
            {noteData
              .filter((note) => note.parent === currentNote?.parent)
              .map((note) => (
                <NoteItem key={note.id} note={note} isSelected={note.id === currentNote?.id} />
              ))}
          </div>
        </div>

        <span className="bg-slate-600" />

        <div className="flex w-full flex-col gap-2">
          <p className="p-2 text-xl">{currentNote?.name}</p>
          {/* <input type="text" placeholder="Title" className="bg-transparent p-2 text-xl focus-visible:outline-none" value={currentNote?.name} /> */}
          <span className="h-[1px] w-full bg-slate-600" />
          <ReactMarkdown className="h-full w-full p-2">{currentNote?.text || ""}</ReactMarkdown>
          {/* <textarea className="h-full w-full whitespace-pre bg-transparent p-2 text-slate-200 focus-visible:outline-none" placeholder="Text"></textarea> */}
        </div>
      </div>
    </Layout>
  );
};

export default NoteId;
