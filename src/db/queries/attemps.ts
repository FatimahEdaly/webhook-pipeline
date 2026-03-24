import { db } from "../index.js";
import { deliveryAttempts, Attempt } from "../schema.js";
import { eq, and } from "drizzle-orm";

export async function getJobAttempts(jobId: string) {
  return await db
    .select()
    .from(deliveryAttempts)
    .where(eq(deliveryAttempts.jobId, jobId));
}

export async function createAttempt(attemp: Attempt) {
  const [result] = await db.insert(deliveryAttempts).values(attemp).returning();
  return result;
}

export async function getFailedAttempt(jobId: string) {
  return await db
    .select({ subscriberUrl: deliveryAttempts.subscriberUrl })
    .from(deliveryAttempts)
    .where(
      and(
        eq(deliveryAttempts.jobId, jobId),
        eq(deliveryAttempts.status, "failed"),
      ),
    );
}
