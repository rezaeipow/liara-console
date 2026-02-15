import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MainContent from "./MainContent";

export default function ConsoleLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-background">
      <Topbar />
      <div className="flex-1 flex flex-col">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
