import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUserService } from "@/services/authenticate";

export function makeAuthenticateUserService() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateService = new AuthenticateUserService(usersRepository);

  return authenticateService;
}
