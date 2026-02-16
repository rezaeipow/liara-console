import { createSeedData } from "./seed";

export const db = createSeedData();

export const resetDb = () => {
  const next = createSeedData();
  Object.assign(db, next);
};

export const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

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
