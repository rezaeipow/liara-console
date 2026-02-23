import { createSeedData, type BillingState, type MockDb, type Notification, type Project, type Ticket } from "./seed";

const ACCOUNTS_STORAGE_KEY = "mock-accounts-state";
const RUNTIME_STORAGE_KEY = "mock-runtime-state";

type PersistedAccountsState = {
  accounts: MockDb["accounts"];
  activeAccountId: string | null;
};

type PersistedRuntimeState = {
  projects: Project[];
  billingByAccountId: Record<string, BillingState>;
  tickets: Ticket[];
  notifications: Notification[];
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readPersistedAccountsState(): PersistedAccountsState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedAccountsState>;
    if (!Array.isArray(parsed.accounts)) return null;
    const accounts = parsed.accounts
      .filter(
        (item): item is MockDb["accounts"][number] =>
          Boolean(item) &&
          typeof item.id === "string" &&
          item.id.trim().length > 0 &&
          typeof item.name === "string" &&
          item.name.trim().length > 0,
      )
      .map((item) => ({ id: item.id.trim(), name: item.name.trim() }));
    if (accounts.length === 0) return null;

    return {
      accounts,
      activeAccountId:
        typeof parsed.activeAccountId === "string" ? parsed.activeAccountId : null,
    };
  } catch {
    return null;
  }
}

function applyPersistedAccountsState(target: MockDb) {
  const persisted = readPersistedAccountsState();
  if (!persisted) return;
  target.accounts = persisted.accounts;
  target.activeAccountId =
    persisted.activeAccountId &&
    persisted.accounts.some((item) => item.id === persisted.activeAccountId)
      ? persisted.activeAccountId
      : persisted.accounts[0]?.id ?? null;
}

function readPersistedRuntimeState(): PersistedRuntimeState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(RUNTIME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedRuntimeState>;
    if (!Array.isArray(parsed.projects)) return null;
    if (!parsed.billingByAccountId || typeof parsed.billingByAccountId !== "object") return null;
    if (!Array.isArray(parsed.tickets)) return null;
    if (!Array.isArray(parsed.notifications)) return null;

    return {
      projects: parsed.projects,
      billingByAccountId: parsed.billingByAccountId,
      tickets: parsed.tickets,
      notifications: parsed.notifications,
    };
  } catch {
    return null;
  }
}

function applyPersistedRuntimeState(target: MockDb) {
  const persisted = readPersistedRuntimeState();
  if (!persisted) return;
  target.projects = persisted.projects;
  target.billingByAccountId = persisted.billingByAccountId;
  target.tickets = persisted.tickets;
  target.notifications = persisted.notifications;
}

const initialDb = createSeedData();
applyPersistedAccountsState(initialDb);
applyPersistedRuntimeState(initialDb);

export const db = initialDb;

export const resetDb = () => {
  const next = createSeedData();
  applyPersistedAccountsState(next);
  applyPersistedRuntimeState(next);
  Object.assign(db, next);
};

export const persistAccountsState = () => {
  if (!canUseStorage()) return;
  try {
    const payload: PersistedAccountsState = {
      accounts: db.accounts.map((item) => ({ id: item.id, name: item.name })),
      activeAccountId: db.activeAccountId,
    };
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
};

export const persistRuntimeState = () => {
  if (!canUseStorage()) return;
  try {
    const payload: PersistedRuntimeState = {
      projects: db.projects,
      billingByAccountId: db.billingByAccountId,
      tickets: db.tickets,
      notifications: db.notifications,
    };
    window.localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
};

export const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const createEmptyBillingState = () => ({
  credit: 0,
  payments: [],
  invoices: [],
});

export const getBillingByAccountId = (accountId: string) => {
  if (!db.billingByAccountId[accountId]) {
    db.billingByAccountId[accountId] = createEmptyBillingState();
    persistRuntimeState();
  }
  return db.billingByAccountId[accountId];
};

export const getActiveBilling = () => {
  const fallbackAccountId = db.accounts[0]?.id ?? "acc-default";
  const activeAccountId = db.activeAccountId ?? fallbackAccountId;
  if (!db.activeAccountId) {
    db.activeAccountId = activeAccountId;
    persistAccountsState();
  }
  return getBillingByAccountId(activeAccountId);
};

export const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize: safePageSize,
    total: items.length,
  };
};
