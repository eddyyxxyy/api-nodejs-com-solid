import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateUserService } from "@/services/factories/make-authenticate-service";

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<never> {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateService = makeAuthenticateUserService();

    const { user } = await authenticateService.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
