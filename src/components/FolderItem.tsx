import React from "react";
import { Folder } from "@prisma/client";
import { FolderIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface FolderItemProps {
  folder: Folder;
  isSelected?: boolean;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, isSelected }) => {
  return (
    <Link href={`/folder/${folder.id}`} className={`flex w-full gap-2 rounded border border-sky-600 bg-slate-700 p-3 ${isSelected && "bg-sky-800"}`}>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 gap-2">
          <FolderIcon className={`h-6 w-6 ${!isSelected && "text-sky-600"}`} />
          <p className={`${isSelected && "font-bold"}`}>{folder.name}</p>
        </div>
        {isSelected && <ChevronRightIcon className="h-6 w-6" />}
      </div>
    </Link>
  );
};

export default FolderItem;
