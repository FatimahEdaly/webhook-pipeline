import type { MigrationConfig } from "drizzle-orm/migrator";
import "dotenv/config";



const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

function envOrThrow(key: string) {
  const value = process.env[key as keyof NodeJS.ProcessEnv];

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
