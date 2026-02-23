import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { baseProjectsLoaderData, makeProject, renderProjectsPage, setProjectsLoaderData } from "./ProjectsPage.testUtils";

describe("ProjectsPage filters integration", () => {
  it("clears search from empty state CTA", async () => {
    setProjectsLoaderData(baseProjectsLoaderData({ query: "missing" }));
    renderProjectsPage(["/console/projects"]);
    const search = screen.getByLabelText(/Search projects/i);
    await userEvent.clear(search);
    await userEvent.type(search, "no-match");
    expect(screen.getByText(/No project matches this search/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear search/i })).toBeInTheDocument();
  });

  it("filters projects by health via query params", () => {
    setProjectsLoaderData(baseProjectsLoaderData({
      items: [
        makeProject({ id: "prj-healthy", name: "Healthy Project", servicesSummary: { apps: 2, vms: 1 }, healthStatus: "healthy" }),
        makeProject({ id: "prj-provisioning", name: "Provisioning Project", servicesSummary: { apps: 0, vms: 0 }, healthStatus: "provisioning" }),
      ],
      total: 2,
    }));
    renderProjectsPage(["/console/projects?health=healthy"]);
    expect(screen.getByText("Healthy Project")).toBeInTheDocument();
    expect(screen.queryByText("Provisioning Project")).not.toBeInTheDocument();
  });

  it("sorts projects by name via query params", () => {
    setProjectsLoaderData(baseProjectsLoaderData({ items: [makeProject({ id: "prj-b", name: "Beta Project" }), makeProject({ id: "prj-a", name: "Alpha Project" })], total: 2 }));
    renderProjectsPage(["/console/projects?sort=name-desc"]);
    const cards = screen.getAllByRole("link", { name: /Open overview/i });
    expect(cards[0].closest("div")).toHaveTextContent("Beta Project");
    expect(cards[1].closest("div")).toHaveTextContent("Alpha Project");
  });
});
