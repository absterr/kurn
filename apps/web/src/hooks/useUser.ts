"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsHandler } from "@/lib/queries/session-queries";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUserDetailsHandler,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
