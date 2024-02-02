import { compare } from "bcrypt";
import { describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUserService } from "./register";

describe("Register Service", () => {
  it("should be able to register", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterUserService(inMemoryUsersRepository);

    const { user } = await registerService.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user's password upon registration", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterUserService(inMemoryUsersRepository);

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

  it("should not be able to register the same e-mail twice", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterUserService(inMemoryUsersRepository);

    const email = "john.doe@example.com";

    await registerService.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    void expect(() =>
      registerService.execute({
        name: "John Doe",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
