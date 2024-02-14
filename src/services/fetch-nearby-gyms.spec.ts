import { Decimal } from "@prisma/client/runtime/library";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { FetchNearbyGymsService } from "./fetch-nearby-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe("Fetch Neaby Gyms Service", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(inMemoryGymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await inMemoryGymsRepository.create({
      id: "gym-01",
      name: "Near Gym",
      description: null,
      latitude: new Decimal(-20.5257455),
      longitude: new Decimal(-47.3912477),
      phone: null,
    });

    await inMemoryGymsRepository.create({
      id: "gym-02",
      name: "Far Gym",
      description: null,
      latitude: new Decimal(-20.4024826),
      longitude: new Decimal(-47.4221343),
      phone: null,
    });

    const { gyms } = await sut.execute({
      userLatitude: -20.5315128,
      userLongitude: -47.381817,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ name: "Near Gym" })]);
  });
});
