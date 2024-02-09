import { CheckIn } from "@prisma/client";

import type { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { IGymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCordinates } from "@/utils/get-distance-between-cordinates";

import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ICheckInsServiceRequest {
  gymId: string;
  userId: string;
  userLatitude: number;
  userLongitude: number;
}

interface ICheckInsServiceResponse {
  checkIn: CheckIn;
}

export class CheckInsService {
  constructor(
    private readonly checkInRepository: ICheckInsRepository,
    private readonly gymsRepository: IGymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: ICheckInsServiceRequest): Promise<ICheckInsServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
