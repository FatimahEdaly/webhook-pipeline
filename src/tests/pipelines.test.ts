import { describe, it, expect, test } from "vitest";
import { app } from "../server.js";
import request from "supertest";
describe("pipelines api", () => {
  test("create pipeline", async () => {
    const res = await request(app)
      .post("/api/pipelines")
      .send({
        action: "upperCase",
        subscribers: ["http://localhost:5000"],
      });

    expect(res.status).toBe(201);
  });
});
