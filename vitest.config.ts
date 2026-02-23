import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "src/**/*.unit.test.ts",
      "src/**/*.unit.test.tsx",
      "src/**/*.integration.test.ts",
      "src/**/*.integration.test.tsx",
    ],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html"],
      all: true,
      include: [
        "src/app/store/**/*.ts",
        "src/shared/utils/**/*.ts",
        "src/features/pages/auth/passwordChecks.ts",
        "src/features/pages/billing/billingFormat.ts",
        "src/features/pages/profile/profileUtils.ts",
        "src/features/pages/settings/settingsStateUtils.ts",
        "src/features/pages/vms/projectVmsUtils.ts",
      ],
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.unit.test.ts",
        "**/*.unit.test.tsx",
        "**/*.integration.test.ts",
        "**/*.integration.test.tsx",
        "**/*.d.ts",
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
    css: true,
  },
});
