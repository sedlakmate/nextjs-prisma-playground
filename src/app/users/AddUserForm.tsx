"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { AddUserState } from "./actions";

type Props = {
  formAction: (formData: FormData) => void;
  formState: AddUserState;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700 disabled:bg-blue-300"
    >
      {pending ? "Adding..." : "Add User"}
    </button>
  );
}

export default function AddUserForm({ formAction, formState }: Props) {
  return (
    <div className="mb-8 rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-medium">Add New User</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full rounded border p-2"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full rounded border p-2"
            placeholder="John Doe"
          />
        </div>

        <SubmitButton />

        {formState.error && (
          <p className="mt-2 text-sm text-red-500">{formState.error}</p>
        )}
        {formState.success && (
          <p className="mt-2 text-sm text-green-500">
            User added successfully!
          </p>
        )}
      </form>
    </div>
  );
}
