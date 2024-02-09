import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { CheckInsService } from "./check-in";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let inMemoryGymsRespository: InMemoryGymsRepository;
let sut: CheckInsService;

describe("Check In Service", () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    inMemoryGymsRespository = new InMemoryGymsRepository();
    sut = new CheckInsService(
      inMemoryCheckInsRepository,
      inMemoryGymsRespository,
    );

    await inMemoryGymsRespository.create({
      id: "gym-01",
      name: "JavaScript Gym",
      description: "",
      latitude: new Decimal(-20.5232133),
      longitude: new Decimal(-47.4285735),
      phone: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -20.5232133,
      userLongitude: -47.4285735,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -20.5232133,
      userLongitude: -47.4285735,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -20.5232133,
        userLongitude: -47.4285735,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -20.5232133,
      userLongitude: -47.4285735,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -20.5232133,
      userLongitude: -47.4285735,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    await inMemoryGymsRespository.create({
      id: "gym-02",
      name: "JavaScript Gym",
      description: "",
      latitude: new Decimal(-20.5137528),
      longitude: new Decimal(-47.3668867),
      phone: "",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -20.5232133,
        userLongitude: -47.4285735,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
