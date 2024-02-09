import { Gym } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { IGymsRepository } from "@/repositories/gyms-repository";

interface IRegisterGymServiceRequest {
  name: string;
  description: string | null;
  phone: string | null;
  latitude: Decimal;
  longitude: Decimal;
}

interface IRegisterGymServiceResponse {
  gym: Gym;
}

export class CreateGymService {
  constructor(private readonly gymsRepository: IGymsRepository) {}

  async execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  }: IRegisterGymServiceRequest): Promise<IRegisterGymServiceResponse> {
    const gym = await this.gymsRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
