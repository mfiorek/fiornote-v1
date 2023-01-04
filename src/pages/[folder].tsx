import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Folder, Note } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAddNewNote } from "../hooks/useAddNewNote";
import Link from "next/link";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import FolderItem from "../components/FolderItem";
import FolderLink from "../components/FolderLink";
import NoteItem from "../components/NoteItem";
import NoteLink from "../components/NoteLink";
import ReactMarkdown from "react-markdown";
import AddFolderModal from "../components/AddFolderModal";
import {
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  DocumentCheckIcon,
  DocumentIcon,
  DocumentPlusIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  HomeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

interface SelectedFolderContentsProps {
  currentFolder: Folder | null;
  selectedFolder: Folder;
  folderData: Folder[];
  noteData: Note[];
}
const SelectedFolderContents: React.FC<SelectedFolderContentsProps> = ({ currentFolder, selectedFolder, folderData, noteData }) => {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  const mutateAddNewNote = useAddNewNote();

  return (
    <>
      {/* NAV */}
      <div id="rightFolderNav" className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={currentFolder ? `/${currentFolder.parentFolderId || "home"}?selectedItemId=${currentFolder.id}` : "/"}
            as={currentFolder ? `/${currentFolder.parentFolderId || "home"}` : "/"}
            className="block rounded bg-slate-700 p-2 sm:hidden"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Link>
          <FolderOpenIcon className="h-6 w-6" />
          <p className="text-xl">{selectedFolder.name}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded bg-slate-700 p-2" onClick={() => setAddFolderModalOpen(true)}>
            <FolderPlusIcon className="h-6 w-6" />
          </button>
          <button className="rounded bg-slate-700 p-2" onClick={() => mutateAddNewNote({ id: crypto.randomUUID(), parentFolderId: selectedFolder.id })}>
            <DocumentPlusIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* DIVIDER */}
      <span id="rightFolderDivider" className="h-px bg-slate-600" />
      {/* CONTENTS */}
      <div id="rightFolderFolders" className="flex w-full flex-col gap-2 empty:hidden">
        {folderData
          .filter((folder) => folder.parentFolderId === selectedFolder.id)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map((folder) => (
            <FolderLink key={folder.id} folder={folder} selectedItemId={folder.id} />
          ))}
      </div>
      <div id="rightFolderNotes" className="flex w-full flex-col gap-2 empty:hidden">
        {noteData
          .filter((note) => note.parentFolderId === selectedFolder.id)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map((note) => (
            <NoteLink key={note.id} note={note} selectedItemId={note.id} />
          ))}
      </div>
      {addFolderModalOpen && <AddFolderModal isOpen={addFolderModalOpen} setIsOpen={setAddFolderModalOpen} parentFolderId={selectedFolder.id} />}
    </>
  );
};

const SelectedNoteContents: React.FC<{ currentFolder: Folder | null; selectedNote: Note }> = ({ currentFolder, selectedNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue } = useForm<{ name: string; text: string }>({ defaultValues: { name: selectedNote.name, text: selectedNote.text } });

  useEffect(() => {
    cancelEdit();
  }, [selectedNote]);

  const utils = trpc.useContext();
  const { mutate: mutateUpdateNote } = trpc.note.update.useMutation({
    onMutate: async ({ name, text }) => {
      await utils.note.getAll.cancel();
      const previousNotes = utils.note.getAll.getData();
      if (previousNotes) {
        utils.note.getAll.setData(undefined, [...previousNotes.filter((note) => note.id !== selectedNote.id), { ...selectedNote, name, text }]);
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

  const saveNote: SubmitHandler<{ name: string; text: string }> = (data) => {
    setIsEditing(false);
    mutateUpdateNote({ id: selectedNote.id, name: data.name || `Untitled ${new Date().toLocaleDateString()}`, text: data.text });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setValue("name", selectedNote.name);
    setValue("text", selectedNote.text);
  };

  return isEditing ? (
    <form id="noteForm" className="flex h-full w-full flex-col gap-2" onSubmit={handleSubmit(saveNote)}>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={currentFolder ? `/${currentFolder.parentFolderId || "home"}?selectedItemId=${currentFolder.id}` : "/"}
          as={currentFolder ? `/${currentFolder.parentFolderId || "home"}` : "/"}
          className="block rounded bg-slate-700 p-2 sm:hidden"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Link>
        <input
          type="text"
          placeholder={`Untitled ${new Date().toLocaleDateString()}`}
          className="grow rounded border border-slate-400 bg-transparent px-2 py-1 text-xl focus-visible:outline focus-visible:outline-1 focus-visible:outline-slate-400"
          {...register("name")}
        />
        <div className="flex gap-2">
          <button className="rounded bg-slate-700 p-2" type="submit" form="noteForm">
            <DocumentCheckIcon className="h-6 w-6" />
          </button>
          <button className="rounded bg-slate-700 p-2" onClick={cancelEdit}>
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
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href={currentFolder ? `/${currentFolder.parentFolderId || "home"}?selectedItemId=${currentFolder.id}` : "/"}
            as={currentFolder ? `/${currentFolder.parentFolderId || "home"}` : "/"}
            className="block rounded bg-slate-700 p-2 sm:hidden"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Link>
          <DocumentIcon className="h-6 w-6" />
          <p className="text-xl">{selectedNote.name}</p>
        </div>
        <button className="rounded bg-slate-700 p-2" onClick={() => setIsEditing(true)}>
          <PencilSquareIcon className="h-6 w-6" />
        </button>
      </div>
      <span className="h-px bg-slate-600" />
      <ReactMarkdown className="markdown h-full w-full overflow-scroll p-2">{selectedNote.text}</ReactMarkdown>
    </>
  );
};

interface NotePageContentsProps {
  currentFolder: Folder | null;
  folderData: Folder[];
  noteData: Note[];
  initialSelectedItemId: string | null;
}
const FolderPageContents: React.FC<NotePageContentsProps> = ({ currentFolder, folderData, noteData, initialSelectedItemId }) => {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(initialSelectedItemId);
  const selectedFolder = folderData.find((f) => f.id === selectedItemId);
  const selectedNote = noteData.find((n) => n.id === selectedItemId);

  const mutateAddNewNote = useAddNewNote();

  useEffect(() => {
    setSelectedItemId(initialSelectedItemId);
  }, [initialSelectedItemId]);

  const handleSelectItem = (itemId: string) => {
    selectedItemId === itemId ? setSelectedItemId(null) : setSelectedItemId(itemId);
  };

  return (
    <Layout>
      <div className="w-full grow grid-cols-[1fr_1px_2fr] gap-2 sm:grid">
        {/* LEFT COLUMN */}
        <div id="leftColumn" className="hidden w-full flex-col gap-2 sm:flex">
          {/* LEFT NAV */}
          <div id="leftNav" className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href={currentFolder ? `/${currentFolder.parentFolderId || "home"}?selectedItemId=${currentFolder.id}` : "/"}
                as={currentFolder ? `/${currentFolder.parentFolderId || "home"}` : "/"}
                className="rounded bg-slate-700 p-2"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Link>
              {currentFolder ? <FolderOpenIcon className="h-6 w-6" /> : <HomeIcon className="h-6 w-6" />}
              <p className="text-xl">{currentFolder?.name || "Home"}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded bg-slate-700 p-2" onClick={() => setAddFolderModalOpen(true)}>
                <FolderPlusIcon className="h-6 w-6" />
              </button>
              <button className="rounded bg-slate-700 p-2" onClick={() => mutateAddNewNote({ id: crypto.randomUUID(), parentFolderId: currentFolder?.id || null })}>
                <DocumentPlusIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          {/* LEFT DIVIDER */}
          <span id="leftDivider" className="h-px bg-slate-600" />
          {/* LEFT CONTENTS */}
          <div id="leftFolders" className="flex w-full flex-col gap-2 empty:hidden">
            {folderData
              .filter((folder) => (currentFolder ? folder.parentFolderId === currentFolder.id : folder.parentFolderId === null))
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((folder) => (
                <FolderItem key={folder.id} folder={folder} isSelected={folder.id === selectedItemId} onClick={() => handleSelectItem(folder.id)} />
              ))}
          </div>
          <div id="leftNotes" className="flex w-full flex-col gap-2 empty:hidden">
            {noteData
              .filter((note) => (currentFolder ? note.parentFolderId === currentFolder.id : note.parentFolderId === null))
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((note) => (
                <NoteItem key={note.id} note={note} isSelected={note.id === selectedItemId} onClick={() => handleSelectItem(note.id)} />
              ))}
          </div>
        </div>

        {/* DIVIDER */}
        <span id="divider" className="hidden bg-slate-600 sm:block" />

        {/* RIGHT COLUMN */}
        <div id="rightColumn" className="flex w-full flex-col gap-2">
          {/* FOLDER SELECTED */}
          {selectedFolder && <SelectedFolderContents currentFolder={currentFolder} selectedFolder={selectedFolder} folderData={folderData} noteData={noteData} />}
          {/* NOTE SELECTED */}
          {selectedNote && <SelectedNoteContents currentFolder={currentFolder} selectedNote={selectedNote} />}
        </div>
      </div>
      {addFolderModalOpen && <AddFolderModal isOpen={addFolderModalOpen} setIsOpen={setAddFolderModalOpen} parentFolderId={currentFolder?.id || null} />}
    </Layout>
  );
};

const FolderPage = () => {
  const router = useRouter();
  const { folder, selectedItemId } = router.query;

  const { data: folderData, isLoading: folderLoading } = trpc.folder.getAll.useQuery();
  const { data: noteData, isLoading: noteLoading } = trpc.note.getAll.useQuery();

  if (folderLoading || noteLoading || !folderData || !noteData) {
    return (
      <Layout>
        <Loader text="Loading data..." />
      </Layout>
    );
  }
  const currentFolder = folderData.find((f) => f.id === folder);
  if (!currentFolder && folder !== "home") {
    router.push("/404");
    return null;
  }
  return (
    <FolderPageContents
      currentFolder={currentFolder || null}
      folderData={folderData}
      noteData={noteData}
      initialSelectedItemId={typeof selectedItemId === "string" ? selectedItemId : null}
    />
  );
};

export default FolderPage;
