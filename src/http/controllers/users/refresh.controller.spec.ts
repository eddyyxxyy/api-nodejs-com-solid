import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Refresh Token (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to refresh a token", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    const refreshTokenResponse = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(refreshTokenResponse.status).toEqual(200);
    expect((refreshTokenResponse.body as { token: string }).token).toEqual(
      expect.any(String),
    );
    expect(refreshTokenResponse.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
