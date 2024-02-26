import "@fastify/jwt";

import { UUID } from "crypto";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: UUID;
    };
  }
}
