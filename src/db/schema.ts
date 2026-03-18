import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";


export const pipelines=pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
 
   source: varchar("source", {length: 256 }).unique().notNull(),
   action: varchar("action",{length: 256})
});


export const subscribers = pgTable("subscribers", {

 id: uuid("id").primaryKey().defaultRandom(),


pipelineId: uuid("pipelineId")
    .notNull()
    .references(() => pipelines.id, { onDelete: "cascade" }),
    subscriberUrl: varchar("subscriber_url", { length: 255 }).notNull(),

});

export type Pipeline = typeof pipelines.$inferInsert;
export type  Subscriber = typeof subscribers.$inferInsert;