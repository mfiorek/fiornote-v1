import React from "react";
import { Folder } from "@prisma/client";
import { FolderIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface FolderLinkProps {
  folder: Folder;
  selectedItemId: string | null;
}

const FolderLink: React.FC<FolderLinkProps> = ({ folder, selectedItemId }) => {
  return (
    <Link
      href={`/${folder.parentFolderId || "home"}?selectedItemId=${selectedItemId}`}
      as={`/${folder.parentFolderId || "home"}`}
      className="flex w-full gap-2 rounded border border-sky-600 bg-slate-700 p-3"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 gap-2">
          <FolderIcon className="h-6 w-6 text-sky-600" />
          <p>{folder.name}</p>
        </div>
      </div>
    </Link>
  );
};

export default FolderLink;
