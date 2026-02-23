import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { store } from "@/app/store/index";
import ProjectVmsPage from "./ProjectVmsPage";
import { projectVmsAction } from "./vmsData";

function renderWithRouter() {
  const router = createMemoryRouter(
    [
      {
        path: "/console/projects/:projectId/vms",
        element: <ProjectVmsPage />,
        action: projectVmsAction,
      },
    ],
    { initialEntries: ["/console/projects/prj-1/vms"] },
  );
  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
}

describe("ProjectVmsPage integration", () => {
  it("creates a VM and shows it in the list", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Project Virtual Machines/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Add VM/i }));
    await userEvent.type(screen.getByLabelText(/VM name/i), "api-vm-2");

    await userEvent.click(screen.getByRole("button", { name: /Create VM/i }));

    await waitFor(() => {
      expect(screen.getByText("api-vm-2")).toBeInTheDocument();
    });
  });

  it("filters stopped VMs after creation", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Project Virtual Machines/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Add VM/i }));
    await userEvent.type(screen.getByLabelText(/VM name/i), "stopped-vm");
    await userEvent.click(screen.getByRole("button", { name: /Create VM/i }));

    await waitFor(() => {
      expect(screen.getByText("stopped-vm")).toBeInTheDocument();
    });

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog", { name: /Create Virtual Machine/i }),
    );

    await userEvent.click(screen.getByRole("button", { name: /^Stopped$/i }));

    await waitFor(() => {
      expect(screen.getByText("stopped-vm")).toBeInTheDocument();
      expect(screen.queryByText("api-vm")).not.toBeInTheDocument();
    });
  });
});

