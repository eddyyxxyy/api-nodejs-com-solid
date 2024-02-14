import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

import { getDistanceBetweenCordinates } from "@/utils/get-distance-between-cordinates";

import type {
  IFindManyNearbyParams,
  IGymsRepository,
} from "../gyms-repository";

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = [];

  async create(data: Gym) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };

    this.gyms.push(gym);

    return gym;
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async findManyNearby(params: IFindManyNearbyParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      );

      return distance < 10;
    });
  }

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.name.includes(query))
      .slice((page - 1) * 20, page * 20);
  }
}
