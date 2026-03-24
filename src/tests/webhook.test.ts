import request from "supertest";
import { app } from "../server.js";
import { describe, expect, test } from "vitest";

describe("webhook", () => {
  test("creates job successfully", async () => {
    const pipelineRes = await request(app)
      .post("/api/pipelines")
      .send({
        action: "print",
        subscribers: ["https://example.com"],
      });

    const pipelineId = pipelineRes.body.pipeline.id;

    const res = await request(app)
      .post(`/webhook/${pipelineId}`)
      .send({
        payload: { name: "fatimah" },
      });

    expect(res.status).toBe(202);
  });
});
