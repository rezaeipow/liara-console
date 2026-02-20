import { useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { createAppRouter } from "./routing/router";

export default function App() {
  const router = useMemo(() => createAppRouter(), []);
  return <RouterProvider router={router} />;
}
