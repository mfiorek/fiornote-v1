import React from "react";
import Link from "next/link";
import { Note } from "@prisma/client";
import { PencilSquareIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface NoteItemProps {
  note: Note;
  isSelected?: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, isSelected }) => {
  return (
    <Link href={`/note/${note.id}`} className={`flex w-full gap-2 rounded border border-emerald-600 p-3 bg-slate-700 ${isSelected && "bg-emerald-800"}`}>
      
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-1 gap-2">
          <PencilSquareIcon className={`h-6 w-6 ${!isSelected && "text-emerald-600"}`} />
          <p className={`${isSelected && "font-bold"}`}>{note.name}</p>
        </div>
        {isSelected && <ChevronRightIcon className="h-6 w-6" />}
      </div>
    </Link>
  );
};

export default NoteItem;
