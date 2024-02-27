import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { makeRegisterUserService } from "@/services/factories/make-register-service";

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<never> {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUserService = makeRegisterUserService();

    await registerUserService.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
