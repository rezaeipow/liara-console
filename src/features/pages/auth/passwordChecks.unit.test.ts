import { describe, expect, it } from "vitest";
import { buildPasswordChecks } from "./passwordChecks";

describe("buildPasswordChecks", () => {
  it("returns all checks true for a strong password", () => {
    const checks = buildPasswordChecks("Password123!");
    expect(checks).toEqual({
      length: true,
      upper: true,
      lower: true,
      number: true,
      special: true,
    });
  });

  it("fails length check for short passwords", () => {
    expect(buildPasswordChecks("A1!bc").length).toBe(false);
  });

  it("fails upper check when uppercase is missing", () => {
    expect(buildPasswordChecks("password123!").upper).toBe(false);
  });

  it("fails lower check when lowercase is missing", () => {
    expect(buildPasswordChecks("PASSWORD123!").lower).toBe(false);
  });

  it("fails number and special checks when missing", () => {
    const checks = buildPasswordChecks("PasswordOnly");
    expect(checks.number).toBe(false);
    expect(checks.special).toBe(false);
  });
});

