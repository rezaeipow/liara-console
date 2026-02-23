import { describe, expect, it } from "vitest";
import {
  createDateFormatter,
  createDateTimeFormatter,
  createMonthDayTimeFormatter,
  createTimeWithSecondsFormatter,
  formatWith,
} from "./dateTime";

describe("dateTime utils", () => {
  it("creates date formatter instance", () => {
    expect(createDateFormatter()).toBeInstanceOf(Intl.DateTimeFormat);
  });

  it("creates month-day-time formatter instance", () => {
    expect(createMonthDayTimeFormatter()).toBeInstanceOf(Intl.DateTimeFormat);
  });

  it("creates time-with-seconds formatter instance", () => {
    expect(createTimeWithSecondsFormatter()).toBeInstanceOf(Intl.DateTimeFormat);
  });

  it("creates date-time formatter instance", () => {
    expect(createDateTimeFormatter()).toBeInstanceOf(Intl.DateTimeFormat);
  });

  it("formats different date input types", () => {
    const formatter = createDateFormatter("en-US");
    expect(formatWith(formatter, "2026-02-23T12:00:00.000Z")).toBeTypeOf("string");
    expect(formatWith(formatter, 1771857600000)).toBeTypeOf("string");
    expect(formatWith(formatter, new Date("2026-02-23T12:00:00.000Z"))).toBeTypeOf("string");
  });
});

