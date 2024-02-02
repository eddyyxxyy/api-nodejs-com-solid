import { compare } from "bcrypt";
import { describe, expect, it } from "vitest";

import { RegisterUserService } from "./register";

describe("Register Service", () => {
  it("should hash user's password upon registration", async () => {
    const registerService = new RegisterUserService({
      async create(data) {
        return {
          id: "user-1",
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        };
      },
      async findByEmail() {
        return null;
      },
    });

    const { user } = await registerService.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
