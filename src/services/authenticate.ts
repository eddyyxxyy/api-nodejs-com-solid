import { User } from "@prisma/client";
import { compare } from "bcrypt";

import { IUsersRepository } from "@/repositories/users-repository";

import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface IAuthenticateServiceRequest {
  email: string;
  password: string;
}

interface IAuthenticateServiceResponse {
  user: User;
}

export class AuthenticateService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateServiceRequest): Promise<IAuthenticateServiceResponse> {
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
