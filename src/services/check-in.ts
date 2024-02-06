import { CheckIn } from "@prisma/client";

import type { ICheckInsRepository } from "@/repositories/check-ins-repository";

interface ICheckInsServiceRequest {
  gymId: string;
  userId: string;
}

interface ICheckInsServiceResponse {
  checkIn: CheckIn;
}

export class CheckInsService {
  constructor(private readonly checkInRepository: ICheckInsRepository) {}

  async execute({
    gymId,
    userId,
  }: ICheckInsServiceRequest): Promise<ICheckInsServiceResponse> {
    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
