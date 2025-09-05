"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/app/actions/users";
import { useRef } from "react";

type User = {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
};

export default function UsersClient({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const qc = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const users = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch users");
      return (await res.json()) as User[];
    },
    initialData: initialUsers, // hydrate client cache from RSC data
    staleTime: 10_000,
  });

  const create = useMutation({
    mutationFn: async (formData: FormData) => {
      const email = String(formData.get("email") ?? "");
      const name = String(formData.get("name") ?? "");
      return createUser({ email, name });
    },
    onSuccess: () => {
      // Server cache is already revalidated by the action via revalidateTag('users')
      // Now refresh client cache too:
      qc.invalidateQueries({ queryKey: ["users"] });
      formRef.current?.reset();
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users (Hybrid with hydartion)</h1>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(new FormData(e.currentTarget));
        }}
        className="flex items-end gap-2"
      >
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
        <button
          disabled={create.isPending}
          className="rounded border px-3 py-1.5 font-medium disabled:opacity-60"
        >
          {create.isPending ? "Adding…" : "Add user"}
        </button>
      </form>

      {users.isLoading ? (
        <p>Loading…</p>
      ) : users.isError ? (
        <p className="text-sm text-red-600">{(users.error as Error).message}</p>
      ) : (
        <ul className="divide-y">
          {users.data!.map((u) => (
            <li key={u.id} className="py-2">
              <div className="font-medium">{u.email}</div>
              <div className="text-sm opacity-70">{u.name ?? "—"}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
