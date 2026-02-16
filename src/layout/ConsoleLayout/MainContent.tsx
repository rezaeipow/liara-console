import React from "react";
import { Outlet } from "react-router-dom";

export default function MainContent({ children }: { children?: React.ReactNode }) {
  return (
    <main className="flex-1 p-4 overflow-auto">
      {children || <Outlet />}
    </main>
  );
}
