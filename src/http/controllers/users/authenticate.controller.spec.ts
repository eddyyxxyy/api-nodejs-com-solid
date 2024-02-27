import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Authenticate (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    const profileResponse = await request(app.server)
      .get("/me")
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .send();

    expect(authResponse.statusCode).toEqual(200);
    expect(authResponse.body).toEqual({
      token: expect.stringMatching(/^(?:[\w-]*\.){2}[\w-]*$/) as string,
    });
    expect(profileResponse.statusCode).toEqual(200);
  });
});
