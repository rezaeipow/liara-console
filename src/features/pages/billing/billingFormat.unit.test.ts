import { describe, expect, it } from "vitest";
import { formatDateTime, formatIrr, formatShortDate } from "./billingFormat";

describe("billingFormat", () => {
  it("formats irr amount with suffix", () => {
    expect(formatIrr(120000)).toMatch(/120,?000 IRR/);
  });

  it("formats non-finite amount as zero", () => {
    expect(formatIrr(Number.NaN)).toMatch(/0 IRR/);
  });

  it("formats short date", () => {
    expect(formatShortDate("2026-02-23T12:00:00.000Z")).toBeTypeOf("string");
    expect(formatShortDate("2026-02-23T12:00:00.000Z").length).toBeGreaterThan(0);
  });

  it("formats date-time", () => {
    expect(formatDateTime("2026-02-23T12:00:00.000Z")).toBeTypeOf("string");
    expect(formatDateTime("2026-02-23T12:00:00.000Z").length).toBeGreaterThan(0);
  });
});

