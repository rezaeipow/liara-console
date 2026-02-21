export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  twoFAEnabled: boolean;
};

export type AuthUser = User & {
  password: string;
};

export type Account = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  accountId: string;
  name: string;
  region: string;
  plan: string;
  createdAt: string;
};

export type App = {
  id: string;
  projectId: string;
  name: string;
  region: string;
  plan: string;
  status: "running" | "failed" | "deploying";
};

export type Deployment = {
  id: string;
  appId: string;
  version: string;
  status: "success" | "failed" | "running";
  createdAt: string;
};

export type EnvVar = {
  key: string;
  value: string;
  secret?: boolean;
};

export type Vm = {
  id: string;
  projectId: string;
  name: string;
  status: "running" | "stopped";
  cpu: number;
  ram: number;
  disk: number;
};

export type Payment = {
  id: string;
  amount: number;
  createdAt: string;
  status: "success" | "failed";
};

export type Invoice = {
  id: string;
  amount: number;
  createdAt: string;
  status: "paid" | "unpaid";
};

export type TicketReply = {
  id: string;
  body: string;
  createdAt: string;
  author: "user" | "support";
};

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  body: string;
  status: "open" | "pending" | "closed";
  createdAt: string;
  replies: TicketReply[];
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type BillingState = {
  credit: number;
  payments: Payment[];
  invoices: Invoice[];
};

export type MockDb = {
  token: string;
  user: User;
  authUsers: AuthUser[];
  activeAccountId: string | null;
  accounts: Account[];
  billingByAccountId: Record<string, BillingState>;
  projects: Project[];
  apps: App[];
  deployments: Deployment[];
  envByAppId: Record<string, EnvVar[]>;
  vms: Vm[];
  tickets: Ticket[];
  notifications: Notification[];
};

export const createSeedData = (): MockDb => {
  const now = new Date().toISOString();

  return {
    token: "seed-token",
    user: {
      id: "u-1",
      name: "Mohamad",
      email: "mohamad@example.com",
      twoFAEnabled: false,
    },
    authUsers: [
      {
        id: "u-1",
        name: "Mohamad",
        email: "mohamad@example.com",
        twoFAEnabled: false,
        password: "Password123!",
      },
    ],
    activeAccountId: "acc-1",
    accounts: [
      { id: "acc-1", name: "Main Account" },
      { id: "acc-2", name: "Team Account" },
    ],
    billingByAccountId: {
      "acc-1": {
        credit: 750000,
        payments: [],
        invoices: [{ id: "inv-1", amount: 150000, createdAt: now, status: "paid" }],
      },
      "acc-2": {
        credit: 230000,
        payments: [
          { id: "pay-seed-1", amount: 50000, createdAt: now, status: "success" },
          { id: "pay-seed-2", amount: 30000, createdAt: now, status: "failed" },
        ],
        invoices: [{ id: "inv-2", amount: 90000, createdAt: now, status: "unpaid" }],
      },
    },
    projects: [
      {
        id: "prj-1",
        accountId: "acc-1",
        name: "liara-console",
        region: "de-fra",
        plan: "starter",
        createdAt: now,
      },
    ],
    apps: [
      {
        id: "app-1",
        projectId: "prj-1",
        name: "frontend",
        region: "de-fra",
        plan: "starter",
        status: "running",
      },
    ],
    deployments: [
      {
        id: "dep-1",
        appId: "app-1",
        version: "v1",
        status: "success",
        createdAt: now,
      },
    ],
    envByAppId: {
      "app-1": [
        { key: "NODE_ENV", value: "production" },
        { key: "API_KEY", value: "secret-value", secret: true },
      ],
    },
    vms: [
      {
        id: "vm-1",
        projectId: "prj-1",
        name: "api-vm",
        status: "running",
        cpu: 2,
        ram: 4096,
        disk: 40,
      },
    ],
    tickets: [
      {
        id: "t-1",
        subject: "Deploy failed",
        category: "apps",
        body: "Build step timed out",
        status: "open",
        createdAt: now,
        replies: [],
      },
    ],
    notifications: [
      {
        id: "n-1",
        title: "Welcome",
        body: "Your account is ready.",
        read: false,
        createdAt: now,
      },
    ],
  };
};
