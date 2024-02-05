import { User } from "@prisma/client";
import { compare } from "bcrypt";

import { IUsersRepository } from "@/repositories/users-repository";

import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface IAuthenticateUserServiceRequest {
  email: string;
  password: string;
}

interface IAuthenticateUserServiceResponse {
  user: User;
}

export class AuthenticateUserService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUserServiceRequest): Promise<IAuthenticateUserServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
