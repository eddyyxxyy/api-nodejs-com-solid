import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";

import type { ICheckInsRepository } from "@/repositories/check-ins-repository";

import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface IValidateCheckInsServiceRequest {
  checkInId: string;
}

interface IValidateCheckInsServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInsService {
  constructor(private readonly checkInRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: IValidateCheckInsServiceRequest): Promise<IValidateCheckInsServiceResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
