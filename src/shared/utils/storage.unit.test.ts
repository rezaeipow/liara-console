import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getStorageItem,
  getStorageJson,
  removeStorageItem,
  setStorageItem,
  setStorageJson,
} from "./storage";

describe("storage utils", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("reads a stored string item", () => {
    localStorage.setItem("key", "value");
    expect(getStorageItem("key")).toBe("value");
  });

  it("returns null when getStorageItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getStorageItem("key")).toBeNull();
  });

  it("writes a string item", () => {
    expect(setStorageItem("name", "mohamad")).toBe(true);
    expect(localStorage.getItem("name")).toBe("mohamad");
  });

  it("returns false when setStorageItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(setStorageItem("name", "mohamad")).toBe(false);
  });

  it("removes an item", () => {
    localStorage.setItem("temp", "1");
    expect(removeStorageItem("temp")).toBe(true);
    expect(localStorage.getItem("temp")).toBeNull();
  });

  it("parses stored json", () => {
    localStorage.setItem("json", JSON.stringify({ a: 1 }));
    expect(getStorageJson("json", { a: 0 })).toEqual({ a: 1 });
  });

  it("returns fallback for invalid json", () => {
    localStorage.setItem("json", "{invalid");
    expect(getStorageJson("json", { a: 0 })).toEqual({ a: 0 });
  });

  it("stores json string", () => {
    expect(setStorageJson("json", { a: 2, b: "x" })).toBe(true);
    expect(localStorage.getItem("json")).toBe(JSON.stringify({ a: 2, b: "x" }));
  });
});

