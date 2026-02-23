import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { store } from "@/app/store/index";
import ProjectAppsPage from "./ProjectAppsPage";
import { projectAppsAction } from "./appsData";

function renderWithRouter() {
  const router = createMemoryRouter(
    [
      {
        path: "/console/projects/:projectId/apps",
        element: <ProjectAppsPage />,
        action: projectAppsAction,
      },
    ],
    { initialEntries: ["/console/projects/prj-1/apps"] },
  );
  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
}

describe("ProjectAppsPage integration", () => {
  it("creates an app and shows it in the list", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Project Apps/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Create App/i }));

    await userEvent.type(screen.getByLabelText(/App name/i), "new-app");
    await userEvent.click(screen.getByRole("button", { name: /^Create$/i }));

    await waitFor(() => {
      expect(screen.getAllByText("new-app").length).toBeGreaterThan(0);
    });
  });

  it("switches to table view and shows headers", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Project Apps/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Table/i }));

    await waitFor(() => {
      expect(screen.getByText(/Last deployment/i)).toBeInTheDocument();
    });
  });
});
