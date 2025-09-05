/**
 * 2) RSC–first (server fetches)
 * The page is a Server Component that fetches with a cache tag.
 * The form posts directly to a Server Action (createUserFromForm).
 * The action calls revalidateTag('users'), so the next render gets fresh data—no React Query involved.
 */

import { createUserFromForm } from "@/app/actions/users";
import { getUsers } from "@/lib/data/users";

export default async function UsersRSCPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users (React Server Component)</h1>

      <form action={createUserFromForm} className="flex items-end gap-2">
        <div className="flex flex-col">
          <label className="text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="rounded border px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Name</label>
          <input name="name" type="text" className="rounded border px-2 py-1" />
        </div>
        <button className="rounded border px-3 py-1.5 font-medium">
          Add user
        </button>
      </form>

      <ul className="divide-y">
        {users.map((u) => (
          <li key={u.id} className="py-2">
            <div className="font-medium">{u.email}</div>
            <div className="text-sm opacity-70">{u.name ?? "—"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
