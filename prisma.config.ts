import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // On Vercel: DATABASE_URL is injected as env var directly
    // Locally: loaded from .env.local by Next.js dev server
    url: process.env["DATABASE_URL"] ?? "",
  },
});
