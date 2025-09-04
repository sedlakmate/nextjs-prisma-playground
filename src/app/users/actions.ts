"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type AddUserState = {
  success: boolean;
  error: string | null;
};

export async function addUser(
  _prevState: AddUserState,
  formData: FormData,
): Promise<AddUserState> {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!email) {
    return {
      success: false,
      error: "Email is required",
    };
  }

  try {
    await prisma.user.create({
      data: {
        email,
        name: name || null,
      },
    });

    // Revalidate the users page to show the new user immediately
    revalidatePath("/users");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Failed to add user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add user",
    };
  }
}
