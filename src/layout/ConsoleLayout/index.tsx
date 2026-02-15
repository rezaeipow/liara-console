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
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
