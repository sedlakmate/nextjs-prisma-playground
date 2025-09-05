/**
 * 3) Hybrid (server renders list; client enhances)
 * Server renders initial list using tags for a fast first paint.
 * Client hydrates with React Query (initialData) to enable refetch/optimistic UX.
 * Mutation uses Server Action and invalidates both caches (server via revalidateTag, client via invalidateQueries).
 */

import { getUsers } from "@/lib/data/users";
import UsersClient from "./users-client";

export default async function UsersHybridPage() {
  const users = await getUsers(); // from DB via cached getter
  const initialUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt.toISOString(),
  }));
  return <UsersClient initialUsers={initialUsers} />;
}
