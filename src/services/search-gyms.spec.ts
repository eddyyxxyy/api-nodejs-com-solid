import { Decimal } from "@prisma/client/runtime/library";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { SearchGymsService } from "./search-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe("Search Gyms Service", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(inMemoryGymsRepository);
  });

  it("should be able to search gyms by name", async () => {
    await inMemoryGymsRepository.create({
      id: "gym-01",
      name: "JavaScript Gym",
      description: null,
      latitude: new Decimal(-23.5505199),
      longitude: new Decimal(-46.6333093),
      phone: null,
    });

    await inMemoryGymsRepository.create({
      id: "gym-02",
      name: "TypeScript Gym",
      description: null,
      latitude: new Decimal(-23.5505199),
      longitude: new Decimal(-46.6333093),
      phone: null,
    });

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ name: "JavaScript Gym" })]);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        id: `gym-${i}`,
        name: `JavaScript Gym ${i}`,
        description: null,
        latitude: new Decimal(-23.5505199),
        longitude: new Decimal(-46.6333093),
        phone: null,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: "JavaScript Gym 21" }),
      expect.objectContaining({ name: "JavaScript Gym 22" }),
    ]);
  });
});
