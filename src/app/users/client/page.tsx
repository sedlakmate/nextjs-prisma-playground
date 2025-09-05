"use client";

/**
 * 1) React Query–first (client fetches)
 * Reads via React Query from /api/users with cache: 'no-store'.
 * Writes via Server Action used as the mutationFn.
 * Invalidate React Query key after success.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/app/actions/users";
import { useRef } from "react";

type User = {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
};

async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default function UsersClientPage() {
  const qc = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const users = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const create = useMutation({
    mutationFn: async (formData: FormData) => {
      const email = String(formData.get("email") ?? "");
      const name = String(formData.get("name") ?? "");
      return createUser({ email, name });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      formRef.current?.reset();
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users (React Query focus)</h1>

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

      {create.isError && (
        <p className="text-sm text-red-600">
          {(create.error as Error).message}
        </p>
      )}

      {users.isLoading ? (
        <p>Loading…</p>
      ) : users.isError ? (
        <p className="text-sm text-red-600">{(users.error as Error).message}</p>
      ) : (
        <ul className="divide-y">
          {users.data?.map((u) => (
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
