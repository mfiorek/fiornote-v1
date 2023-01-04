import React, { type PropsWithChildren } from "react";
import FiornoteHead from "./FiornoteHead";
import Navbar from "./Navbar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <FiornoteHead />
      <main className="flex min-h-screen flex-col text-slate-200">
        <Navbar />
        <div className="flex grow bg-slate-800">
          <div className="flex w-full flex-col items-center p-2">{children}</div>
        </div>
      </main>
    </>
  );
};

export default Layout;
