import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="flex w-full items-center justify-center bg-slate-700 p-2">
      <h1 className="text-2xl font-extralight">fiornote</h1>
      {/* {session?.user && <span>{session.user.name}</span>} */}
    </div>
  );
};

export default Navbar;
