import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Metrics of Check-Ins (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to count the amount of check-ins (metrics)", async () => {
    const authResponse = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        name: "JavaScript Gym",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        { gym_id: gym.id, user_id: user.id },
        { gym_id: gym.id, user_id: user.id },
        { gym_id: gym.id, user_id: user.id },
      ],
    });

    const metricsOfCheckInsResponse = await request(app.server)
      .get("/check-ins/metrics")
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      );

    expect(metricsOfCheckInsResponse.statusCode).toEqual(200);
    expect(metricsOfCheckInsResponse.body).toEqual(
      expect.objectContaining({ checkInsCount: 3 }),
    );
  });
});
