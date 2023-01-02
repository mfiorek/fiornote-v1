import React from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface NoteItemProps {
  name: string;
}

const NoteItem: React.FC<NoteItemProps> = ({ name }) => {
  return (
    <div className="flex w-full gap-2 rounded border border-emerald-600 bg-slate-300 p-3 dark:bg-slate-700">
      <PencilSquareIcon className="h-6 w-6 text-emerald-600" />
      <p>{name}</p>
    </div>
  );
};

export default NoteItem;
