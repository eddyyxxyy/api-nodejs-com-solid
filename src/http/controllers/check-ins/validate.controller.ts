import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeValidateCheckInsService } from "@/services/factories/make-validate-check-in-service";

export async function validateController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<never> {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const checkInsService = makeValidateCheckInsService();

  await checkInsService.execute({
    checkInId,
  });

  return reply.status(204).send();
}
