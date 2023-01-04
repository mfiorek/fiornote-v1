import React from "react";
import Link from "next/link";
import { Note } from "@prisma/client";
import { DocumentIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface NoteItemProps {
  note: Note;
  isSelected?: boolean;
  onClick: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, isSelected, onClick }) => {
  return (
    <button onClick={onClick} className={`flex w-full gap-2 rounded border border-emerald-600 bg-slate-700 p-3 ${isSelected && "bg-emerald-800"}`}>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 gap-2">
          <DocumentIcon className={`h-6 w-6 ${!isSelected && "text-emerald-600"}`} />
          <p className={`${isSelected && "font-bold"}`}>{note.name}</p>
        </div>
      </div>
    </button>
  );
};

export default NoteItem;
