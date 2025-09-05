import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().nullable().optional(),
  createdAt: z.string(),
});

const UsersResponse = z.object({ users: z.array(UserSchema) });

type User = z.infer<typeof UserSchema>;

const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
};

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("/api/users", { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const parsed = UsersResponse.safeParse(json);
  if (!parsed.success) {
    throw new Error("Invalid response shape");
  }
  return parsed.data.users;
};

export { useUsers, fetchUsers, type User };
