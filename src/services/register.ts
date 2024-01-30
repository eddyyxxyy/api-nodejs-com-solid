import { hash } from "bcrypt";

import { IUsersRepository } from "@/repositories/users-repository";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface IRegisterUserService {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: IRegisterUserService) {
    const userWithEmail = await this.usersRepository.findByEmail(email);

    if (userWithEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });
  }
}
