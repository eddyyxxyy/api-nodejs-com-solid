import { Gym, Prisma } from "@prisma/client";

export interface IGymsRepository {
  create(data: Prisma.GymUncheckedCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
  searchMany(query: string, page: number): Promise<Gym[]>;
}
