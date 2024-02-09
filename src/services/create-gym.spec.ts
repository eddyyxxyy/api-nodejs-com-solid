import { Decimal } from "@prisma/client/runtime/library";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { CreateGymService } from "./create-gym";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Create Gym Service", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(inMemoryGymsRepository);
  });

  it("should be able to register", async () => {
    const { gym } = await sut.execute({
      name: "JavaScript Gym",
      description: null,
      latitude: new Decimal(-23.5505199),
      longitude: new Decimal(-46.6333093),
      phone: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
