import "dotenv/config";

import { execSync } from "node:child_process";
import { randomUUID, UUID } from "node:crypto";

import type { Environment } from "vitest";

import { prisma } from "@/lib/prisma";

function generateDatabaseUrl(schema: UUID) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined.");
  }

  const url = new URL(
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}?schema=public`,
  );

  url.searchParams.set("schema", schema);

  return url.toString();
}

export default {
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schema = randomUUID();

    const databaseURL = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseURL;

    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );
        await prisma.$disconnect();
      },
    };
  },
} as Environment;
