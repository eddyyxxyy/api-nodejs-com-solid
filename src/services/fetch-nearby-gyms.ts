import { Gym } from "@prisma/client";

import { IGymsRepository } from "@/repositories/gyms-repository";

interface IFetchNearbyGymsServiceRequest {
  userLatitude: number;
  userLongitude: number;
}

interface IFetchNearbyGymsServiceResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsService {
  constructor(private readonly gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsServiceRequest): Promise<IFetchNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
