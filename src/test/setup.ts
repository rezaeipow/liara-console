import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, afterAll, beforeAll } from "vitest";
import { server } from "./mswServer";

// Ensure AbortController/AbortSignal are compatible with undici/MSW in jsdom.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "AbortController", {
    value: globalThis.AbortController,
    writable: true,
  });
  Object.defineProperty(window, "AbortSignal", {
    value: globalThis.AbortSignal,
    writable: true,
  });
}

// Normalize fetch for jsdom: resolve relative URLs + strip AbortSignal.
const originalFetch = globalThis.fetch;
if (originalFetch) {
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const resolveInput = (value: RequestInfo | URL) => {
      if (typeof value === "string") {
        return new URL(value, "http://localhost").toString();
      }
      if (value instanceof URL) {
        return new URL(value.toString(), "http://localhost").toString();
      }
      return value;
    };

    const nextInput = resolveInput(input);
    if (!init?.signal) return originalFetch(nextInput, init);
    const rest = { ...init };
    delete rest.signal;
    return originalFetch(nextInput, rest);
  }) as typeof fetch;
}

// Strip AbortSignal from Request to avoid undici/jsdom mismatch in data router actions.
const OriginalRequest = globalThis.Request;
if (OriginalRequest) {
  globalThis.Request = class RequestWithoutSignal extends OriginalRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      if (init?.signal) {
        const rest = { ...init };
        delete rest.signal;
        super(input, rest);
      } else {
        super(input, init);
      }
    }
  } as typeof Request;

  if (typeof window !== "undefined") {
    window.Request = globalThis.Request;
  }
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
