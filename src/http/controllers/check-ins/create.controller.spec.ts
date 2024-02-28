import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Check-In (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check-in", async () => {
    const authResponse = await createAndAuthenticateUser(app, true);

    const gym = await prisma.gym.create({
      data: {
        name: "JavaScript Gym",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    const createCheckInResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    expect(createCheckInResponse.statusCode).toEqual(201);
  });
});
