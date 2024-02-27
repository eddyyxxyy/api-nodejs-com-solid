import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCreateGymService } from "@/services/factories/make-create-gym-service";

export async function createController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<never> {
  const createGymBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { name, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body);

  const createGymService = makeCreateGymService();

  await createGymService.execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}
