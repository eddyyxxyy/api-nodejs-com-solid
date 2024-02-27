import { Gym } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gyms (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search gyms by name", async () => {
    const authResponse = await createAndAuthenticateUser(app);

    await request(app.server)
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

    await request(app.server)
      .post("/gyms/create")
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .send({
        name: "TypeScript Gym",
        description: "Some description",
        phone: "11999999999",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    const searchResponse = await request(app.server)
      .get("/gyms/search")
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .query({ query: "JavaScript" })
      .send();

    expect(searchResponse.statusCode).toEqual(200);
    expect((searchResponse.body as { gyms: Gym[] }).gyms).toHaveLength(1);
    expect((searchResponse.body as { gyms: Gym[] }).gyms).toEqual([
      expect.objectContaining({
        name: "JavaScript Gym",
      }),
    ]);
  });
});
