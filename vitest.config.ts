import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/admin/**/*.test.ts"],
    environment: "node",
  },
});
