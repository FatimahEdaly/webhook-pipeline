import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile(); //to load the environment variables in our .env file

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config = {
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};
