"use client";
import type { ErrorInfo } from "next/error";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, unstable_retry }: ErrorInfo) {
  const message = error?.message ?? "An unexpected error occurred.";
  const tooManyAttempts = message.startsWith("Too many attempts");

  return (
    <div className="w-full h-[75vh] flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-0.5">
        <h1 className="font-semibold text-xl md:text-3xl tracking-tight">
          Well, damn
        </h1>
        <p className="text-sm md:text-base text-center">
          {message}. {tooManyAttempts && "Please try again later."}
        </p>
      </div>
      {!tooManyAttempts && (
        <Button
          onClick={unstable_retry}
          className="cursor-pointer px-3 py-4 rounded-xl md:text-base"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
