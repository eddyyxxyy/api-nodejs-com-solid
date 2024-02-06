import { randomUUID } from "node:crypto";

import type { CheckIn, Prisma } from "@prisma/client";

import type { ICheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }
}
