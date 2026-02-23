import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { store } from "@/app/store/index";
import ProjectsPage from "./ProjectsPage";
import type { ProjectListItem, ProjectsLoaderData } from "./projectsData";

let loaderData: ProjectsLoaderData;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useLoaderData: () => loaderData, useNavigation: () => ({ state: "idle" }) };
});

export function setProjectsLoaderData(data: ProjectsLoaderData) {
  loaderData = data;
}

export function makeProject(partial: Partial<ProjectListItem> & Pick<ProjectListItem, "id" | "name">): ProjectListItem {
  return {
    id: partial.id,
    accountId: partial.accountId ?? "acc-1",
    name: partial.name,
    region: partial.region ?? "de-fra",
    plan: partial.plan ?? "starter",
    createdAt: partial.createdAt ?? new Date().toISOString(),
    servicesSummary: partial.servicesSummary ?? { apps: 1, vms: 1 },
    healthStatus: partial.healthStatus ?? "healthy",
  };
}

export function baseProjectsLoaderData(overrides: Partial<ProjectsLoaderData>): ProjectsLoaderData {
  return { items: [], page: 1, pageSize: 8, total: 0, query: "", ...overrides };
}

export function renderProjectsPage(initialEntries: string[]) {
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
