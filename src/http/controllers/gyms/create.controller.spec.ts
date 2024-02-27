import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const authResponse = await createAndAuthenticateUser(app);

    const createResponse = await request(app.server)
      .post("/gyms/create")
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .send({
        name: "JavaScript Gym",
        description: "Some description",
        phone: "11999999999",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    expect(createResponse.statusCode).toEqual(201);
  });
});
