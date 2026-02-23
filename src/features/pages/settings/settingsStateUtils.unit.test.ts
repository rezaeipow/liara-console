import { describe, expect, it } from "vitest";
import type { UIPreferences } from "@/app/store/slices/uiSlice";
import type { SecurityPreferences } from "./types";
import {
  DEFAULT_SECURITY_PREFERENCES,
  DEFAULT_UI_PREFERENCES,
  SECURITY_STORAGE_KEY,
  UI_STORAGE_KEY,
  arePreferenceEqual,
  areSecurityEqual,
  createMockRecoveryCodes,
  loadSecurityPreferences,
  loadUiPreferencesFromStorage,
  saveSecurityPreferences,
} from "./settingsStateUtils";

describe("settingsStateUtils", () => {
  it("loads default security preferences when storage is empty", () => {
    localStorage.removeItem(SECURITY_STORAGE_KEY);
    expect(loadSecurityPreferences()).toEqual(DEFAULT_SECURITY_PREFERENCES);
  });

  it("normalizes stored security values", () => {
    localStorage.setItem(
      SECURITY_STORAGE_KEY,
      JSON.stringify({ twoFAEnabled: true, backupCodesEnabled: false, emailAlertsEnabled: false }),
    );
    expect(loadSecurityPreferences()).toEqual({
      twoFAEnabled: true,
      backupCodesEnabled: false,
      emailAlertsEnabled: false,
    });
  });

  it("saves security preferences to storage", () => {
    const payload: SecurityPreferences = {
      twoFAEnabled: true,
      backupCodesEnabled: true,
      emailAlertsEnabled: true,
    };
    saveSecurityPreferences(payload);
    expect(JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEY) ?? "{}")).toEqual(payload);
  });

  it("loads default ui preferences when storage is empty", () => {
    localStorage.removeItem(UI_STORAGE_KEY);
    expect(loadUiPreferencesFromStorage()).toEqual(DEFAULT_UI_PREFERENCES);
  });

  it("normalizes invalid ui preference values", () => {
    localStorage.setItem(
      UI_STORAGE_KEY,
      JSON.stringify({ sidebarMode: "bad", tableDensity: "invalid" }),
    );
    expect(loadUiPreferencesFromStorage()).toEqual(DEFAULT_UI_PREFERENCES);
  });

  it("generates six mock recovery codes", () => {
    const codes = createMockRecoveryCodes();
    expect(codes).toHaveLength(6);
    expect(codes.every((code) => /^LR-\d{2}-\d{4}$/.test(code))).toBe(true);
  });

  it("compares ui preference objects", () => {
    const left: UIPreferences = { sidebarMode: "expanded", tableDensity: "standard" };
    const right: UIPreferences = { sidebarMode: "expanded", tableDensity: "standard" };
    const changed: UIPreferences = { sidebarMode: "collapsed", tableDensity: "standard" };
    expect(arePreferenceEqual(left, right)).toBe(true);
    expect(arePreferenceEqual(left, changed)).toBe(false);
  });

  it("compares security preference objects", () => {
    const left: SecurityPreferences = {
      twoFAEnabled: false,
      backupCodesEnabled: false,
      emailAlertsEnabled: true,
    };
    const right: SecurityPreferences = {
      twoFAEnabled: false,
      backupCodesEnabled: false,
      emailAlertsEnabled: true,
    };
    const changed: SecurityPreferences = {
      twoFAEnabled: true,
      backupCodesEnabled: false,
      emailAlertsEnabled: true,
    };
    expect(areSecurityEqual(left, right)).toBe(true);
    expect(areSecurityEqual(left, changed)).toBe(false);
  });
});

