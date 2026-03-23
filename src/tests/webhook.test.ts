import request from "supertest";
import { app } from "../server.js";
import { describe, it, expect, test } from "vitest";

describe("webhook", () => {
  test("creates job successfully", async () => {
    const pipelineId = "test-id";

    const res = await request(app)
      .post(`/webhook/${pipelineId}`)
      .send({
        payload: { name: "fatimah" },
      });

    expect(res.status).toBe(202);
  });
});
