import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { fetchUsers } from "@/hooks/useUsers";

export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({});
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["users"],
      queryFn: () => fetchUsers(),
    }),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
