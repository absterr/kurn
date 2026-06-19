"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { requestAccessHandler } from "@/actions/auth-actions";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { requestAccessSchema } from "@/lib/schema/auth-schema";
import GuestLoginBtn from "../GuestLoginBtn";

const RequestAccessForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof requestAccessSchema>>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (body: z.infer<typeof requestAccessSchema>) => {
    startTransition(async () => {
      const { data, error } = await requestAccessHandler(body);
      if (error || !data) {
        toast.error(error);
        return;
      }

      toast.success(data.message);
    });
  };

  return (
    <>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {(["name", "email"] as const).map((field) => (
          <div key={field}>
            <input
              type={field}
              placeholder={field === "email" ? "Email address" : "Name"}
              className="w-full h-12 text-xs md:text-sm px-4 rounded-xl bg-background dark:bg-foreground/5 border border-foreground/20 placeholder-foreground/50 focus:outline-none focus:border-foreground/60 focus:ring-1 focus:ring-foreground/60 font-medium transition-colors"
              {...form.register(field)}
            />
            {form.formState.errors[field] && (
              <p className="text-sm text-red-500 pt-1">
                <CircleAlert size={14} className="inline pr-1" />
                {form.formState.errors[field].message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/80 hover:cursor-pointer font-medium text-sm md:text-base transition-colors"
        >
          {isPending ? <LoadingSpinner /> : "Request Access"}
        </button>
      </form>

      <p className="text-xs md:text-sm text-foreground/50 text-center pt-8">
        Already have an account?{" "}
        <Link
          href={"/login"}
          className=" text-foreground/70 hover:text-foreground underline lg:no-underline lg:hover:underline"
        >
          Log in
        </Link>
      </p>
      <div className="py-6 flex items-center justify-center">
        <GuestLoginBtn
          isPending={isPending}
          startTransition={startTransition}
        />
      </div>
    </>
  );
};

export default RequestAccessForm;
