import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

import { ValidateCheckInsService } from "../validate-check-in";

export function makeValidateCheckInsService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const service = new ValidateCheckInsService(checkInsRepository);

  return service;
}
