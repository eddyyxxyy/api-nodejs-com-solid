import { Gym } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Neaby Gyms (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    const authResponse = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms/create")
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .send({
        id: "gym-01",
        name: "JavaScript Gym",
        description: "Some description",
        latitude: -20.5257455,
        longitude: -47.3912477,
        phone: "1199999999",
      });

    await request(app.server)
      .post("/gyms/create")
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .send({
        id: "gym-02",
        name: "TypeScript Gym",
        description: "Some description",
        latitude: -20.4024826,
        longitude: -47.4221343,
        phone: "1199999999",
      });

    const nearbyResponse = await request(app.server)
      .get("/gyms/nearby")
      .query({ userLatitude: -20.5257455, userLongitude: -47.3912477 })
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .send();

    expect(nearbyResponse.statusCode).toEqual(200);
    expect((nearbyResponse.body as { gyms: Gym[] }).gyms).toHaveLength(1);
    expect((nearbyResponse.body as { gyms: Gym[] }).gyms).toEqual([
      expect.objectContaining({
        name: "JavaScript Gym",
      }),
    ]);
  });
});
