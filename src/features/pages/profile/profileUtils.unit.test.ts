import { describe, expect, it } from "vitest";
import {
  formatProfileDateTime,
  getEmailError,
  getNameError,
  getOrCreateLastLogin,
  getPhoneError,
  getPhoneStorageKey,
  readStorage,
  validateAvatarFile,
  writeStorage,
} from "./profileUtils";

describe("profileUtils", () => {
  it("builds user phone storage key", () => {
    expect(getPhoneStorageKey("u-1")).toBe("console-profile-phone:u-1");
  });

  it("writes and reads storage values", () => {
    writeStorage("profile-name", "Mohamad");
    expect(readStorage("profile-name")).toBe("Mohamad");
  });

  it("removes storage entry when writing empty string", () => {
    writeStorage("profile-phone", "123");
    writeStorage("profile-phone", "");
    expect(readStorage("profile-phone")).toBe("");
  });

  it("creates and reuses last login timestamp", () => {
    const first = getOrCreateLastLogin();
    const second = getOrCreateLastLogin();
    expect(first).toBe(second);
  });

  it("validates email, name, and phone", () => {
    expect(getEmailError("bad-email")).toBe("Enter a valid email address.");
    expect(getNameError("a")).toBe("Name must be at least 2 characters.");
    expect(getPhoneError("abc")).toBe("Phone must contain valid digits and symbols.");
    expect(getPhoneError("+98 912 123 4567")).toBe("");
  });

  it("validates avatar files", () => {
    const textFile = new File(["x"], "file.txt", { type: "text/plain" });
    expect(validateAvatarFile(textFile)).toBe("Only image files are allowed.");

    const bigImage = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "big.png", {
      type: "image/png",
    });
    expect(validateAvatarFile(bigImage)).toBe("Image size must be less than 2MB.");

    const okImage = new File(["ok"], "ok.png", { type: "image/png" });
    expect(validateAvatarFile(okImage)).toBe("");
  });

  it("formats profile date-time value", () => {
    const formatted = formatProfileDateTime("2026-02-23T12:00:00.000Z");
    expect(typeof formatted).toBe("string");
    expect(formatted.length).toBeGreaterThan(0);
  });
});

