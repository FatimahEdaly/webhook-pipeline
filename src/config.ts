import type { MigrationConfig } from "drizzle-orm/migrator";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

// للحصول على المسار الحالي للملف في نظام ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تحديد مكان الميغريشن بناءً على بيئة التشغيل
// داخل الدوكر ستكون في dist/db/migrations
// محلياً ستكون في src/db/migrations
const isProduction = process.env.NODE_ENV === "production";
const migrationsPath = isProduction
  ? path.join(__dirname, "db", "migrations") // في الدوكر (داخل dist)
  : path.join(process.cwd(), "src", "db", "migrations"); // محلياً

const migrationConfig: MigrationConfig = {
  migrationsFolder: migrationsPath,
};

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

function envOrThrow(key: string) {
  // eslint-disable-next-line security/detect-object-injection
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
