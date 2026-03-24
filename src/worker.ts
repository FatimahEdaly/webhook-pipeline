import { upperCase, sortAsc, sortDesc } from "./actions.js";
import {
  getPendingJobs,
  updateJobStatus,
  incrementAttempts,
} from "./db/queries/jobs.js";
import { getPipeById } from "./db/queries/pipelines.js";
import { Job } from "./db//schema.js";
import { getSubs } from "./db/queries/subscribers.js";
import { createAttempt, getFailedAttempt } from "./db/queries/attemps.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processJob(job: Job, originalStatus: string) {
  let result;
  let flag = 1;
  const pipe = await getPipeById(job.pipelineId);

  if (!pipe) {
    await updateJobStatus(job.id as string, "failed");

    return;
  }

  switch (pipe.action) {
    case "sortAsc":
      if (!Array.isArray(job.payload)) {
        throw new Error("payload must be number[]");
      }

      result = sortAsc(job.payload as number[]);
      break;

    case "sortDesc":
      if (!Array.isArray(job.payload)) {
        throw new Error("payload must be number[]");
      }

      result = sortDesc(job.payload as number[]);
      break;

    case "upperCase":
      if (typeof job.payload !== "object" || job.payload === null) {
        throw new Error("payload must be an object");
      }

      result = upperCase(job.payload as Record<string, string>);
      break;

    default:
      throw new Error("Unknown action");
  }
  let subs;

  if (originalStatus === "failed")
    subs = await getFailedAttempt(job.id as string);
  else subs = await getSubs(pipe.id);

  await incrementAttempts(job.id as string);
  if (!Array.isArray(subs) || subs.length === 0) {
    return;
  }

  for (const sub of subs) {
    try {
      const res = await fetch(sub.subscriberUrl as string, {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let status;

      if (res.status >= 500) {
        status = "failed";
        flag = 0;
      } else {
        status = "success";
      }

      await createAttempt({
        jobId: job.id,
        subscriberUrl: sub.subscriberUrl,
        responseCode: res.status,
        status,
      });
    } catch (err) {
      flag = 0;

      await createAttempt({
        jobId: job.id,
        subscriberUrl: sub.subscriberUrl,
        responseCode: 0,
        status: "failed",
      });
      console.error(err);
    }
  }

  if (!flag) await updateJobStatus(job.id as string, "failed");
  else await updateJobStatus(job.id as string, "success");
}

export async function worker() {
  while (true) {
    try {
      const jobs = await getPendingJobs();

      if (!jobs || jobs.length === 0) {
        await sleep(3000);
        continue;
      }
      for (const job of jobs) {
        try {
          const originalStatus = job.status;

          await updateJobStatus(job.id, "processing");

          await processJob(job, originalStatus);
        } catch (err) {
          await updateJobStatus(job.id as string, "failed");
          console.error(err);
        }
      }

      await sleep(5000);
    } catch (err) {
      console.error("worker error:", err);
    }
  }
}
