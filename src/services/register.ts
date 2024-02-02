import { User } from "@prisma/client";
import { hash } from "bcrypt";

import { IUsersRepository } from "@/repositories/users-repository";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface IRegisterUserService {
  name: string;
  email: string;
  password: string;
}

interface IRegisterUserServiceResponse {
  user: User;
}

export class RegisterUserService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: IRegisterUserService): Promise<IRegisterUserServiceResponse> {
    const userWithEmail = await this.usersRepository.findByEmail(email);

    if (userWithEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });

    return { user };
  }
}
