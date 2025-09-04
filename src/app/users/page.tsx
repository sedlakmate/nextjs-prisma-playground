"use client";

import { useActionState, useEffect } from "react";
import { addUser, AddUserState } from "./actions";
import AddUserForm from "./AddUserForm";
import { useUsers } from "@/hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";

const initialState: AddUserState = {
  success: false,
  error: null,
};

export default function UsersPage() {
  const { data: users, isLoading, isError, error } = useUsers();

  const queryClient = useQueryClient();

  const [formState, formAction] = useActionState<AddUserState, FormData>(
    addUser,
    initialState,
  );

  useEffect(() => {
    if (formState.success) {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  }, [formState.success, queryClient]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center p-8 sm:p-20">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid min-h-screen place-items-center p-8 sm:p-20">
        <p className="text-sm text-red-600">
          Error: {(error as Error)?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>

      <AddUserForm formAction={formAction} formState={formState} />

      {users && users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="">
              <tr>
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
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
