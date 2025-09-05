"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const UserInput = z.object({
  email: z.email(),
  name: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null),
});

export async function createUser(input: unknown) {
  const parsed = UserInput.parse(input);
  try {
    const user = await prisma.user.create({ data: parsed });
    revalidateTag("users");
    // If there are path-based cached pages too, revalidate them specifically:
    revalidatePath("/users/rsc");
    revalidatePath("/users/hybrid");
    return user;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new Error("Email already exists.");
    }
    throw err;
  }
}

export async function createUserFromForm(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const name = String(formData.get("name") ?? "");
  await createUser({ email, name });
}
