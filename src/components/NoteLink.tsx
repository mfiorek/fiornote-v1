import React from "react";
import Link from "next/link";
import { Note } from "@prisma/client";
import { DocumentIcon } from "@heroicons/react/24/outline";

interface NoteLinkProps {
  note: Note;
  selectedItemId: string | null;
}

const NoteLink: React.FC<NoteLinkProps> = ({ note, selectedItemId }) => {
  return (
    <Link
      href={`/${note.parentFolderId || "home"}?selectedItemId=${selectedItemId}`}
      as={`/${note.parentFolderId || "home"}`}
      className="flex w-full gap-2 rounded border border-emerald-600 bg-slate-700 p-3"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 gap-2">
          <DocumentIcon className="h-6 w-6 text-emerald-600" />
          <p>{note.name}</p>
        </div>
      </div>
    </Link>
  );
};

export default NoteLink;
