import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ConsoleLayout from "../layout/ConsoleLayout/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ConsoleLayout />,
    children: [],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
