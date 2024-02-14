import { Gym, Prisma } from "@prisma/client";

export interface IFindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface IGymsRepository {
  create(data: Prisma.GymUncheckedCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
  findManyNearby(params: IFindManyNearbyParams): Promise<Gym[]>;
  searchMany(query: string, page: number): Promise<Gym[]>;
}
