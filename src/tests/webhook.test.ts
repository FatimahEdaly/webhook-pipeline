import request from "supertest";
import { app } from "../server.js";
import { describe, expect, test } from "vitest";

describe("webhook", () => {
  test("creates job successfully", async () => {
    const pipelineId = "00000000-0000-0000-0000-000000000000";

    const res = await request(app)
      .post(`/webhook/${pipelineId}`)
      .send({
        payload: { name: "fatimah" },
      });
              
    expect(res.status).toBe(202);
  });
});
