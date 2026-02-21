import { createSeedData } from "./seed";

export const db = createSeedData();

export const resetDb = () => {
  const next = createSeedData();
  Object.assign(db, next);
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
  }
  return db.billingByAccountId[accountId];
};

export const getActiveBilling = () => {
  const fallbackAccountId = db.accounts[0]?.id ?? "acc-default";
  const activeAccountId = db.activeAccountId ?? fallbackAccountId;
  if (!db.activeAccountId) {
    db.activeAccountId = activeAccountId;
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
