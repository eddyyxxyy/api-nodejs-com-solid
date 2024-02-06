import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetUserProfileService } from "./get-user-profile";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Service", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(inMemoryUsersRepository);
  });

  it("should be able to get the user profile information", async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.id).toEqual(createdUser.id);
  });

  it("should not be able to get the user profile information with wrong id", async () => {
    void expect(() =>
      sut.execute({ userId: "non-existing-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
