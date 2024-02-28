import { FastifyInstance } from "fastify";

import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { verifyJWT } from "../../middlewares/verify-jwt";
import { createController } from "./create.controller";
import { nearbyController } from "./nearby.controller";
import { searchController } from "./search.controller.ts";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/gyms/create", createController);

  app.get("/gyms/search", searchController);
  app.get(
    "/gyms/nearby",
    { onRequest: [verifyUserRole("ADMIN")] },
    nearbyController,
  );
}
