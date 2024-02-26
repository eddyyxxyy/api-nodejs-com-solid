import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

import { CheckInsService } from "../check-in";

export function makeCheckInsService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();

  const service = new CheckInsService(checkInsRepository, gymsRepository);

  return service;
}
