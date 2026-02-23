import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => {
    console.log("PAGEERROR:", error.message);
  });
  page.on("console", (message) => {
    const type = message.type();
    console.log(`CONSOLE ${type.toUpperCase()}:`, message.text());
  });
  page.on("response", (response) => {
    if (response.url().includes("/projects")) {
      console.log(`HTTP ${response.status()} -> ${response.url()}`);
    }
    if (response.status() >= 400) {
      console.log(`HTTP ${response.status()} -> ${response.url()}`);
    }
  });
  page.on("requestfailed", (request) => {
    console.log(`REQUEST FAILED -> ${request.url()} (${request.failure()?.errorText ?? "unknown"})`);
  });

  await page.addInitScript(() => {
    localStorage.clear();
    const session = {
      token: "e2e-token",
      user: {
        id: "u-1",
        name: "Mohamad",
        email: "mohamad@example.com",
        twoFAEnabled: false,
      },
    };
    localStorage.setItem("console-auth-session", JSON.stringify(session));
  });

  await page.goto("/console");
  await page.waitForFunction(() => (window as { __mswReady?: boolean }).__mswReady === true);
});

test("projects list navigation to overview, apps, and vms", async ({ page }) => {
  const projectName = `e2e-nav-project-${Date.now()}`;

  await page.goto("/console/projects/new");
  await page.getByLabel("Project name").fill(projectName);
  await page.getByRole("button", { name: "Create Project" }).click();

  await expect(page).toHaveURL(/\/console\/projects\/prj-/);
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  await page.getByRole("link", { name: "Open apps" }).click();
  await expect(page.getByRole("heading", { name: "Project Apps" })).toBeVisible();

  await page.getByRole("link", { name: "Back to Project" }).click();
  await expect(page).toHaveURL(/\/console\/projects\/prj-/);
  await page.getByRole("link", { name: "Open VMs" }).click();
  await expect(page.getByRole("heading", { name: "Project Virtual Machines" })).toBeVisible();
});

test("create and delete a project from overview flow", async ({ page }) => {
  const projectName = `e2e-project-${Date.now()}`;

  await page.goto("/console/projects/new");
  await page.getByLabel("Project name").fill(projectName);
  await page.getByRole("button", { name: "Create Project" }).click();

  await expect(page).toHaveURL(/\/console\/projects\/prj-/);
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByLabel("Confirm project name").fill(projectName);
  await page.getByRole("button", { name: "Delete" }).last().click();

  await expect(page).toHaveURL(/\/console\/projects\?deleted=1/);
  await page.getByLabel("Search projects").fill(projectName);
  await expect(page.getByText("No project matches this search.")).toBeVisible();
});
