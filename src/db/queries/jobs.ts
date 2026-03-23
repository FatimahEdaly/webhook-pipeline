import { db } from "../index.js";
import { jobs, Job } from "../schema.js";
import { sql, eq, asc, lt, and, or } from "drizzle-orm";

export async function createJob(job: Job) {
  const [result] = await db.insert(jobs).values(job).returning();
  return result;
}

export async function getAllJobs() {
  let query = db.select().from(jobs);

  return await query;
}

export async function getJobById(jobId: string) {
  const [result] = await db.select().from(jobs).where(eq(jobs.id, jobId));

  return result;
}

export async function updateJobStatus(jobId: string, status: string) {
  const [result] = await db
    .update(jobs)
    .set({ status })
    .where(eq(jobs.id, jobId))
    .returning();

  return result;
}

export async function incrementAttempts(jobId: string) {
  const [result] = await db
    .update(jobs)
    .set({
      attempts: sql`${jobs.attempts} + 1`,
      lastAttemptAt: new Date(),
    })
    .where(eq(jobs.id, jobId))
    .returning();

  return result;
}

export async function getPipeJobs(pipeId: string) {
  return await db.select().from(jobs).where(eq(jobs.pipelineId, pipeId));
}

export async function getPendingJobs() {
  return db
    .select()
    .from(jobs)
    .where(
      and(
        or(eq(jobs.status, "pending"), eq(jobs.status, "failed")),
        lt(jobs.attempts, 3),
      ),
    )
    .orderBy(asc(jobs.createdAt))
    .limit(5);
}
