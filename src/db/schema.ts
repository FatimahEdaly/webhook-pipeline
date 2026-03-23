import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),

  source: varchar("source", { length: 256 }).unique(),
  action: varchar("action", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),

  pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, { onDelete: "cascade" }),
  subscriberUrl: varchar("subscriber_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Pipeline = typeof pipelines.$inferInsert;
export type Subscriber = typeof subscribers.$inferInsert;
