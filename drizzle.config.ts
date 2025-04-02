import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { config } from "dotenv";
import dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Ensure the database is provisioned.");
}

if (!process.env.DATABASE_USER) {
  throw new Error("DATABASE_USER is not set. Ensure the database user is configured.");
}

if (!process.env.DATABASE_PASSWORD) {
  throw new Error("DATABASE_PASSWORD is not set. Ensure the database password is configured.");
}
if (!process.env.DATABASE_NAME) {
  throw new Error("DATABASE_NAME is not set.  Ensure the database name is configured.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: false, // Disable SSL
  },
});
