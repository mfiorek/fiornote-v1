import React from "react";
import { Folder } from "@prisma/client";
import { FolderIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface FolderItemProps {
  folder: Folder;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder }) => {
  return (
    <Link href={`/folder/${folder.id}`} className="flex w-full gap-2 rounded border border-sky-600 bg-slate-300 p-3 dark:bg-slate-700">
      <FolderIcon className="h-6 w-6 text-sky-600" />
      <p>{folder.name}</p>
    </Link>
  );
};

export default FolderItem;
