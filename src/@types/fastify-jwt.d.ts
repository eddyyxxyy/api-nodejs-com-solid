import "@fastify/jwt";

import type { UUID } from "node:crypto";

import type { ROLE } from "@prisma/client";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: UUID;
      role: ROLE;
    };
  }
}
