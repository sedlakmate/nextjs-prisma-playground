"use client";

import { useActionState, useEffect, useState } from "react";
import { z } from "zod";
import { addUser, AddUserState } from "./actions";
import AddUserForm from "./AddUserForm";

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

const initialState: AddUserState = {
  success: false,
  error: null,
};

export default function UsersPage() {
  const [state, setState] = useState<State>({
    users: undefined,
    loading: true,
  });

  // Explicitly type the useActionState hook
  const [formState, formAction] = useActionState<AddUserState, FormData>(
    addUser,
    initialState,
  );

  const loadData = async () => {
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const parsed = UsersResponse.safeParse(json);
      if (!parsed.success) {
        throw new Error("Invalid response shape");
      }
      setState({ users: parsed.data.users, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setState({
        users: undefined,
        loading: false,
        error: err?.message ?? "Failed to load",
      });
    }
  };

  // Load users when form submission is successful
  useEffect(() => {
    if (formState.success) {
      loadData();
    }
  }, [formState.success]);

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
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>

      <AddUserForm formAction={formAction} formState={formState} />

      {state.loading ? (
        <p>Loading users...</p>
      ) : state.error ? (
        <p className="text-red-500">Error: {state.error}</p>
      ) : state.users && state.users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {state.users.map((user) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.name || "-"}</td>
                  <td className="border p-2">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
