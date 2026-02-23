import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { baseProjectsLoaderData, makeProject, renderProjectsPage, setProjectsLoaderData } from "./ProjectsPage.testUtils";

describe("ProjectsPage integration", () => {
  it("renders project list from loader", () => {
    setProjectsLoaderData(baseProjectsLoaderData({ items: [makeProject({ id: "prj-1", name: "liara-console" })], total: 1 }));
    renderProjectsPage(["/console/projects"]);
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("liara-console")).toBeInTheDocument();
  });

  it("filters projects by search query", async () => {
    setProjectsLoaderData(baseProjectsLoaderData({ query: "does-not-exist" }));
    renderProjectsPage(["/console/projects"]);
    const search = screen.getByLabelText(/Search projects/i);
    await userEvent.clear(search);
    await userEvent.type(search, "does-not-exist");
    expect(screen.getByText(/No project matches this search/i)).toBeInTheDocument();
  });

  it("shows load more only when no query is active", () => {
    setProjectsLoaderData(baseProjectsLoaderData({ items: [makeProject({ id: "prj-1", name: "liara-console" })], total: 12 }));
    renderProjectsPage(["/console/projects"]);
    expect(screen.getByRole("heading", { name: /Project Directory/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Load more/i })).toBeInTheDocument();
  });

  it("shows empty state when no projects exist", () => {
    setProjectsLoaderData(baseProjectsLoaderData({}));
    renderProjectsPage(["/console/projects"]);
    expect(screen.getByText(/No projects yet\. Create your first project/i)).toBeInTheDocument();
  });
});
