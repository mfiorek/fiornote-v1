import { useState } from "react";
import { type NextPage } from "next";
import { Folder, Note } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import FolderItem from "../../components/FolderItem";
import NoteItem from "../../components/NoteItem";
import { ChevronLeftIcon, PencilSquareIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

interface NotePageContentsProps {
  currentNote: Note;
  folderData: Folder[];
  noteData: Note[];
}

const NotePageContents: React.FC<NotePageContentsProps> = ({ currentNote, folderData, noteData }) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentNote.name);
  const [text, setText] = useState(currentNote.text);

  return (
    <Layout>
      <div className="mb-4 flex w-full items-center justify-between">
        <div
          className="cursor-pointer rounded bg-slate-700 p-2"
          onClick={() => {
            currentNote.parent ? router.push(`/folder/${currentNote.parent}`) : router.push("/");
          }}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </div>
        <div className="cursor-pointer rounded bg-slate-700 p-2">
          {isEditing ? <DocumentCheckIcon className="h-6 w-6" onClick={() => setIsEditing(false)} /> : <PencilSquareIcon className="h-6 w-6" onClick={() => setIsEditing(true)} />}
        </div>
      </div>

      <div className="grid w-full grow grid-cols-[1fr_1px_2fr] gap-2">
        <div className="flex w-full flex-col gap-2">
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

        <div className="flex w-full flex-col gap-2">
          {isEditing ? (
            <input
              type="text"
              placeholder="Title"
              className="rounded bg-transparent p-2 text-xl focus-visible:outline focus-visible:outline-1 focus-visible:outline-slate-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="p-2 text-xl">{currentNote.name}</p>
          )}
          <span className="h-[1px] w-full bg-slate-600" />
          {isEditing ? (
            <textarea
              className="h-full w-full whitespace-pre rounded bg-transparent p-2 text-slate-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-slate-400"
              placeholder="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <ReactMarkdown className="h-full w-full p-2">{currentNote.text}</ReactMarkdown>
          )}
        </div>
      </div>
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
