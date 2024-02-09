import { CheckIn } from "@prisma/client";

import type { ICheckInsRepository } from "@/repositories/check-ins-repository";

import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryService {
  constructor(private readonly checkInRepository: ICheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page,
    );

    if (!checkIns) {
      throw new ResourceNotFoundError();
    }

    return { checkIns };
  }
}
