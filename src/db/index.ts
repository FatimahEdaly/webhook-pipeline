import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";
import { config } from "../config.js";

const conn = postgres(config.db.url);
export const db = drizzle(conn, { schema }); //We'll use this db object to run queries against the databaseWe'll use this db object to run queries against the database
