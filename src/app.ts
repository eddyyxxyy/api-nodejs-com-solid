import { fastifyJwt } from "@fastify/jwt";
import fastify from "fastify";
import { ZodError } from "zod";

import { env } from "./env";
import { usersRoutes } from "./http/controllers/users/routes";

export const app = fastify();

void app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

void app.register(usersRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.log(error);
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
