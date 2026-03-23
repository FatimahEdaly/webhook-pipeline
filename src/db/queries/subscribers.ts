import { db } from "../index.js";
import { subscribers, Subscriber, Pipeline, pipelines } from "../schema.js";
import { asc, desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export async function createSub(subs: Subscriber[]) {
  const [result] = await db.insert(subscribers).values(subs).returning();
  return result;
}

export async function getSubs(PipeId: string) {
  const [result] = await db
    .select({ subscriberUrl: subscribers.subscriberUrl })
    .from(subscribers)
    .where(eq(subscribers.pipelineId, PipeId));

  return result;
}
