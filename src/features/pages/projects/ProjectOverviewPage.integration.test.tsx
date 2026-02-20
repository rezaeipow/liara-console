import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { store } from "../../../app/store/index";
import ProjectOverviewPage from "./ProjectOverviewPage";
import type { ProjectOverviewLoaderData } from "./projectsData";

let loaderData: ProjectOverviewLoaderData;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useLoaderData: () => loaderData,
    useFetcher: () => ({
      state: "idle",
      formData: undefined,
      data: undefined,
      submit: vi.fn(),
    }),
  };
});

function renderWithRouter(initialEntries: string[]) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/console/projects/:projectId" element={<ProjectOverviewPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("ProjectOverviewPage integration", () => {
  const baseProject = {
    id: "prj-1",
    accountId: "acc-1",
    name: "liara-console",
    region: "de-fra",
    plan: "starter",
    createdAt: new Date().toISOString(),
    servicesSummary: { apps: 1, vms: 1 },
    billingSnapshot: { credit: 750000 },
    activity: [],
  };

  it("renders overview and opens rename dialog", async () => {
    loaderData = { project: baseProject };
    renderWithRouter(["/console/projects/prj-1"]);

    expect(screen.getByText("liara-console")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Rename/i }));
    expect(screen.getByLabelText(/Project name/i)).toBeInTheDocument();
  });

  it("opens delete dialog and requires name confirmation", async () => {
    loaderData = { project: baseProject };
    renderWithRouter(["/console/projects/prj-1"]);

    expect(screen.getByText("liara-console")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));
    expect(screen.getByLabelText(/Confirm project name/i)).toBeInTheDocument();
  });

  it("disables delete confirmation until project name matches", async () => {
    loaderData = { project: baseProject };
    renderWithRouter(["/console/projects/prj-1"]);

    expect(screen.getByText("liara-console")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /^Delete$/i }));

    const confirmInput = screen.getByLabelText(/Confirm project name/i);
    const deleteButtons = screen.getAllByRole("button", { name: /^Delete$/i });
    const confirmButton = deleteButtons[deleteButtons.length - 1];

    expect(confirmButton).toBeDisabled();
    await userEvent.type(confirmInput, "wrong-name");
    expect(confirmButton).toBeDisabled();

    await userEvent.clear(confirmInput);
    await userEvent.type(confirmInput, "liara-console");
    expect(confirmButton).toBeEnabled();
  });

  it("disables rename save when name is too short", async () => {
    loaderData = { project: baseProject };
    renderWithRouter(["/console/projects/prj-1"]);

    expect(screen.getByText("liara-console")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Rename/i }));

    const nameInput = screen.getByLabelText(/Project name/i);
    const saveButton = screen.getByRole("button", { name: /Save/i });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "ab");
    expect(saveButton).toBeDisabled();

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "alpha");
    expect(saveButton).toBeEnabled();
  });
});

