import { db } from "../index.js";
import { subscribers,Subscriber, Pipeline, pipelines} from "../schema.js";
import { asc,desc } from "drizzle-orm";
import { eq } from "drizzle-orm";


export async function createPipeline(pipe: Pipeline) {
  const [result] = await db
    .insert(pipelines)
    .values(pipe)
    .onConflictDoNothing()
    .returning();
  return result;
}


