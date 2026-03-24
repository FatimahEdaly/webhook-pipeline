import { db } from "../index.js";
import { subscribers, Subscriber } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createSub(subs: Subscriber[]) {
  const [result] = await db.insert(subscribers).values(subs).returning();
  return result;
}

export async function getSubs(pipeId: string) {
  return db
    .select({ subscriberUrl: subscribers.subscriberUrl })
    .from(subscribers)
    .where(eq(subscribers.pipelineId, pipeId));
}
