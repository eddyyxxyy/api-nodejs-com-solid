import type { Gym } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type {
  IFindManyNearbyParams,
  IGymsRepository,
} from "../gyms-repository";

export class PrismaGymsRepository implements IGymsRepository {
  async create(data: Gym) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    if (!gym) {
      return null;
    }

    return gym;
  }

  async findManyNearby({ latitude, longitude }: IFindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }
}
