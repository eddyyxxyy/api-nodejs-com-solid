import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Profile (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
    const authResponse = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get("/me")
      .set(
        "Authorization",
        `Bearer ${(authResponse.body as { token: string }).token}`,
      )
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(
      (profileResponse.body as { user: { name: string; email: string } }).user,
    ).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
      }),
    );
  });
});
