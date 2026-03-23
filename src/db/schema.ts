import { pgTable, timestamp, varchar, uuid ,jsonb,integer} from "drizzle-orm/pg-core";


export const pipelines=pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
 
   source: varchar("source", {length: 256 }).unique(),
   action: varchar("action",{length: 256}).notNull(),
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


export const jobs = pgTable("jobs", {

  id: uuid("id").primaryKey().defaultRandom(),

  pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, { onDelete: "cascade" }),

  payload: jsonb("payload").notNull(),

  status: varchar("status", { length: 50 })
    .default("pending")
    .notNull(),

  attempts: integer("attempts")
    .default(0)
    .notNull(),

  lastAttemptAt: timestamp("last_attempt_at"),

  completedAt: timestamp("completed_at"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const deliveryAttempts = pgTable("delivery_attempts", {

  id: uuid("id").primaryKey().defaultRandom(),

  jobId: uuid("job_id")
    .references(() => jobs.id, { onDelete: "cascade" }),

  subscriberUrl: varchar("subscriber_url", { length: 512 }),

  status: varchar("status", { length: 50 }),

  responseCode: integer("response_code"),

  createdAt: timestamp("created_at").defaultNow(),

});
export type Pipeline = typeof pipelines.$inferInsert;
export type  Subscriber = typeof subscribers.$inferInsert;
export type  Job = typeof jobs.$inferInsert;
export type  Attempt=typeof deliveryAttempts.$inferInsert;

