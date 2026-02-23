import { render, screen, waitFor, within } from "@testing-library/react";
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

    const [addVmButton] = screen.getAllByRole("button", { name: /^Add VM$/i });
    await userEvent.click(addVmButton);

    const createDialog = await screen.findByRole("dialog", {
      name: /Create Virtual Machine/i,
    });
    await userEvent.type(within(createDialog).getByLabelText(/VM name/i), "api-vm-2");
    await userEvent.click(within(createDialog).getByRole("button", { name: /Create VM/i }));

    expect(await screen.findByText("api-vm-2")).toBeInTheDocument();
  }, 10000);

  it("filters stopped VMs after creation", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Project Virtual Machines/i)).toBeInTheDocument();
    });

    const [addVmButton] = screen.getAllByRole("button", { name: /^Add VM$/i });
    await userEvent.click(addVmButton);

    const createDialog = await screen.findByRole("dialog", {
      name: /Create Virtual Machine/i,
    });
    await userEvent.type(within(createDialog).getByLabelText(/VM name/i), "stopped-vm");
    await userEvent.click(within(createDialog).getByRole("button", { name: /Create VM/i }));

    expect(await screen.findByText("stopped-vm")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /Create Virtual Machine/i })).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /^Stopped$/i }));

    await waitFor(() => {
      expect(screen.getByText("stopped-vm")).toBeInTheDocument();
      expect(screen.queryByText("api-vm")).not.toBeInTheDocument();
    });
  });
});

