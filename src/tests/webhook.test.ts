import request from "supertest";
import { app } from "../server.js";
import { describe, expect, test } from "vitest";



describe("webhook", () => {
  test("creates job successfully", async () => {
    const pipeline = await request(app)
      .post("/pipelines")
      .send({
        name: "test pipeline",
      });

    const pipelineId = pipeline.body.id;

    const res = await request(app)
      .post(`/webhook/${pipelineId}`)
      .send({
        payload: { name: "fatimah" },
      });

    expect(res.status).toBe(202);
  });
});