import { Gym } from "@prisma/client";

import { IGymsRepository } from "@/repositories/gyms-repository";

interface ISearchGymsServiceRequest {
  query: string;
  page: number;
}

interface ISearchGymsServiceResponse {
  gyms: Gym[];
}

export class SearchGymsService {
  constructor(private readonly gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page,
  }: ISearchGymsServiceRequest): Promise<ISearchGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
