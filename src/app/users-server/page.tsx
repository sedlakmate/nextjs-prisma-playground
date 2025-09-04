import { Suspense } from "react";
import prisma from "@/lib/prisma";

async function UsersTable() {
  let users: Array<{
    id: number;
    email: string;
    name: string | null;
    createdAt: Date;
  }>;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
    users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return (
      <div className="grid place-items-center">
        <p className="text-sm text-red-600">Error: Failed to load</p>
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-sm">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-md border border-gray-200">
        <thead className="">
          <tr>
            <th className="border-b px-3 py-2 text-left">ID</th>
            <th className="border-b px-3 py-2 text-left">Email</th>
            <th className="border-b px-3 py-2 text-left">Name</th>
            <th className="border-b px-3 py-2 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="even:bg-gray-50/60">
              <td className="border-b px-3 py-2">{user.id}</td>
              <td className="border-b px-3 py-2">{user.email}</td>
              <td className="border-b px-3 py-2">{user.name ?? "—"}</td>
              <td className="border-b px-3 py-2">
                {new Date(user.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UsersPage() {
  return (
    <div className="min-h-screen p-8 sm:p-20">
      <h1 className="mb-6 text-2xl font-semibold">Users</h1>
      <Suspense fallback={<div className="text-l font-bold">Loading...</div>}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
