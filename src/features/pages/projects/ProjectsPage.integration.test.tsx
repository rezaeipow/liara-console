import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { store } from "../../../app/store/Index";
import ProjectsPage from "./ProjectsPage";
import type { ProjectsLoaderData } from "./projectsData";

let loaderData: ProjectsLoaderData;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useLoaderData: () => loaderData,
    useNavigation: () => ({ state: "idle" }),
  };
});

function renderWithRouter(initialEntries: string[]) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/console/projects" element={<ProjectsPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("ProjectsPage integration", () => {
  it("renders project list from loader", async () => {
    loaderData = {
      items: [
        {
          id: "prj-1",
          accountId: "acc-1",
          name: "liara-console",
          region: "de-fra",
          plan: "starter",
          createdAt: new Date().toISOString(),
          servicesSummary: { apps: 1, vms: 1 },
          healthStatus: "healthy",
        },
      ],
      page: 1,
      pageSize: 8,
      total: 1,
      query: "",
    };
    renderWithRouter(["/console/projects"]);

    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("liara-console")).toBeInTheDocument();
  });

  it("filters projects by search query", async () => {
    loaderData = {
      items: [],
      page: 1,
      pageSize: 8,
      total: 0,
      query: "does-not-exist",
    };
    renderWithRouter(["/console/projects"]);

    const search = screen.getByLabelText(/Search projects/i);
    await userEvent.clear(search);
    await userEvent.type(search, "does-not-exist");

    expect(screen.getByText(/No project matches this search/i)).toBeInTheDocument();
  });

  it("shows load more only when no query is active", async () => {
    loaderData = {
      items: [
        {
          id: "prj-1",
          accountId: "acc-1",
          name: "liara-console",
          region: "de-fra",
          plan: "starter",
          createdAt: new Date().toISOString(),
          servicesSummary: { apps: 1, vms: 1 },
          healthStatus: "healthy",
        },
      ],
      page: 1,
      pageSize: 8,
      total: 12,
      query: "",
    };
    renderWithRouter(["/console/projects"]);

    expect(screen.getByText(/Project Directory/i)).toBeInTheDocument();
    const loadMore = screen.queryByRole("button", { name: /Load more/i });
    expect(loadMore).toBeInTheDocument();
  });

  it("clears search from empty state CTA", async () => {
    loaderData = {
      items: [],
      page: 1,
      pageSize: 8,
      total: 0,
      query: "missing",
    };
    renderWithRouter(["/console/projects"]);

    const search = screen.getByLabelText(/Search projects/i);
    await userEvent.clear(search);
    await userEvent.type(search, "no-match");

    expect(screen.getByText(/No project matches this search/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear search/i })).toBeInTheDocument();
  });

  it("shows empty state when no projects exist", async () => {
    loaderData = {
      items: [],
      page: 1,
      pageSize: 8,
      total: 0,
      query: "",
    };

    renderWithRouter(["/console/projects"]);

    expect(
      screen.getByText(/No projects yet\. Create your first project/i),
    ).toBeInTheDocument();
  });

  it("filters projects by health via query params", async () => {
    loaderData = {
      items: [
        {
          id: "prj-healthy",
          accountId: "acc-1",
          name: "Healthy Project",
          region: "de-fra",
          plan: "starter",
          createdAt: new Date().toISOString(),
          servicesSummary: { apps: 2, vms: 1 },
          healthStatus: "healthy",
        },
        {
          id: "prj-provisioning",
          accountId: "acc-1",
          name: "Provisioning Project",
          region: "de-fra",
          plan: "starter",
          createdAt: new Date().toISOString(),
          servicesSummary: { apps: 0, vms: 0 },
          healthStatus: "provisioning",
        },
      ],
      page: 1,
      pageSize: 8,
      total: 2,
      query: "",
    };

    renderWithRouter(["/console/projects?health=healthy"]);

    expect(screen.getByText("Healthy Project")).toBeInTheDocument();
    expect(screen.queryByText("Provisioning Project")).not.toBeInTheDocument();
  });

  it("sorts projects by name via query params", async () => {
    loaderData = {
      items: [
        {
          id: "prj-b",
          accountId: "acc-1",
          name: "Beta Project",
          region: "de-fra",
          plan: "starter",
          createdAt: new Date().toISOString(),
          servicesSummary: { apps: 1, vms: 1 },
          healthStatus: "healthy",
        },
        {
          id: "prj-a",
          accountId: "acc-1",
          name: "Alpha Project",
          region: "de-fra",
          plan: "starter",
          createdAt: new Date().toISOString(),
          servicesSummary: { apps: 1, vms: 1 },
          healthStatus: "healthy",
        },
      ],
      page: 1,
      pageSize: 8,
      total: 2,
      query: "",
    };

    renderWithRouter(["/console/projects?sort=name-desc"]);

    const cards = screen.getAllByRole("link", { name: /Open overview/i });
    const firstCard = cards[0].closest("div");
    const secondCard = cards[1].closest("div");
    expect(firstCard).toHaveTextContent("Beta Project");
    expect(secondCard).toHaveTextContent("Alpha Project");
  });
});
