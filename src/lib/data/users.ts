import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getUsers = unstable_cache(
  async () => prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
  ["users"],
  { tags: ["users"] },
);
