import { db } from "../index.js";
import { pipelines, Pipeline } from "../schema.js";
import { asc, desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export async function createPipe(pipe: Pipeline) {
  const [result] = await db.insert(pipelines).values(pipe).returning();
  return result;
}

export async function getAllpipes() {
  let query = db.select().from(pipelines).$dynamic();

  return await query;
}

export async function getPipeById(PipeId: string) {
  const [result] = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, PipeId));

  return result;
}

export async function deletePipeById(id: string) {
  const [deleted] = await db
    .delete(pipelines)
    .where(eq(pipelines.id, id))
    .returning();

  return deleted;
}

export async function updatePipe(id: string, data: Partial<Pipeline>) {
  const [result] = await db
    .update(pipelines)
    .set({
      ...data,
    })
    .where(eq(pipelines.id, id))
    .returning();
  return result;
}

export async function setSource(id: string, Source: string) {
  const [result] = await db
    .update(pipelines)
    .set({ source: Source })
    .where(eq(pipelines.id, id))
    .returning();
  return result;
}
