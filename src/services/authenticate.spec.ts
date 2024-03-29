import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { AuthenticateUserService } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: AuthenticateUserService;

describe("Authenticate Service", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUserService(inMemoryUsersRepository);
  });

  it("should be able to authenticate", async () => {
    await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong e-mail", async () => {
    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "654321",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
