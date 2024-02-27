import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service";

export async function searchController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<never> {
  const searchGymsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    query: z.string(),
  });

  const { page, query } = searchGymsQuerySchema.parse(request.body);

  const searchGymsService = makeSearchGymsService();

  const { gyms } = await searchGymsService.execute({
    page,
    query,
  });

  return reply.status(200).send({
    gyms,
  });
}
