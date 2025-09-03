"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().nullable().optional(),
  createdAt: z.string(),
});

const UsersResponse = z.object({ users: z.array(UserSchema) });

type User = z.infer<typeof UserSchema>;

type State = {
  users?: User[];
  loading: boolean;
  error?: string;
};

export default function UsersPage() {
  const [state, setState] = useState<State>({
    users: undefined,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const parsed = UsersResponse.safeParse(json);
        if (!parsed.success) {
          throw new Error("Invalid response shape");
        }
        if (!cancelled) setState({ users: parsed.data.users, loading: false });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (!cancelled)
          setState({
            users: undefined,
            loading: false,
            error: err?.message ?? "Failed to load",
          });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="grid min-h-screen place-items-center p-8 sm:p-20">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="grid min-h-screen place-items-center p-8 sm:p-20">
        <p className="text-sm text-red-600">Error: {state.error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <h1 className="mb-6 text-2xl font-semibold">Users</h1>
      {state.users?.length === 0 ? (
        <p className="text-sm text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-md border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b px-3 py-2 text-left">ID</th>
                <th className="border-b px-3 py-2 text-left">Email</th>
                <th className="border-b px-3 py-2 text-left">Name</th>
                <th className="border-b px-3 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {state.users?.map((u) => (
                <tr key={u.id} className="even:bg-gray-50/60">
                  <td className="border-b px-3 py-2">{u.id}</td>
                  <td className="border-b px-3 py-2">{u.email}</td>
                  <td className="border-b px-3 py-2">{u.name ?? "—"}</td>
                  <td className="border-b px-3 py-2">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
