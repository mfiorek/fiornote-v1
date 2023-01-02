import React from "react";
import { FolderIcon } from "@heroicons/react/24/outline";

interface FolderItemProps {
  name: string;
}

const FolderItem: React.FC<FolderItemProps> = ({ name }) => {
  return (
    <div className="flex w-full gap-2 rounded border border-sky-600 bg-slate-300 p-3 dark:bg-slate-700">
      <FolderIcon className="h-6 w-6 text-sky-600" />
      <p>{name}</p>
    </div>
  );
};

export default FolderItem;
