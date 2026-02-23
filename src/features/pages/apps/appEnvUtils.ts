import type { EnvRow, RowErrors } from "./pageTypes";

export const ENV_KEY_PATTERN = /^[A-Z_][A-Z0-9_]*$/;

export const createEnvLocalId = () => `env-${Math.random().toString(36).slice(2, 9)}`;

export function createRowErrors(rows: EnvRow[]) {
  const errors: Record<string, RowErrors> = {};
  const duplicateMap = new Map<string, number>();

  rows.forEach((row) => {
    const normalizedKey = row.key.trim().toUpperCase();
    if (!normalizedKey) return;
    duplicateMap.set(normalizedKey, (duplicateMap.get(normalizedKey) ?? 0) + 1);
  });

  rows.forEach((row) => {
    const rowError: RowErrors = {};
    const normalizedKey = row.key.trim().toUpperCase();
    if (!normalizedKey) rowError.key = "Key is required.";
    else if (!ENV_KEY_PATTERN.test(normalizedKey)) rowError.key = "Use A-Z, 0-9, underscore; start with letter/underscore.";
    else if ((duplicateMap.get(normalizedKey) ?? 0) > 1) rowError.key = "Duplicate key.";
    if (!row.value.trim()) rowError.value = "Value is required.";
    if (rowError.key || rowError.value) errors[row.id] = rowError;
  });

  return errors;
}
