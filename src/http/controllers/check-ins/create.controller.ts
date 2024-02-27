import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCheckInsService } from "@/services/factories/make-check-in-service";

export async function createController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<never> {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const checkInsService = makeCheckInsService();

  await checkInsService.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
