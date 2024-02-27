import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";

export async function nearbyController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<never> {
  const nearbyGymsBodySchema = z.object({
    userLatitude: z.number().refine((value) => Math.abs(value) <= 90),
    userLongitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { userLatitude, userLongitude } = nearbyGymsBodySchema.parse(
    request.body,
  );

  const fetchNearbyGymService = makeFetchNearbyGymsService();

  const { gyms } = await fetchNearbyGymService.execute({
    userLatitude,
    userLongitude,
  });

  return reply.status(200).send({ gyms });
}
