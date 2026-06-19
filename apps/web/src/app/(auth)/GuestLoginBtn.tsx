"use client";
import { useRouter } from "next/navigation";
import type { TransitionStartFunction } from "react";
import { toast } from "sonner";
import { guestLoginHandler } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";

const GuestLoginBtn = ({
  isPending,
  startTransition,
}: {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}) => {
  const router = useRouter();
  const handleClick = () => {
    startTransition(async () => {
      const { error } = await guestLoginHandler();

      if (error) {
        toast.error(error);
        return;
      }

      router.replace("/");
    });
  };

  return (
    <Button
      variant="outline"
      disabled={isPending}
      className="w-fit text-xs cursor-pointer"
      onClick={handleClick}
    >
      Continue as Guest
    </Button>
  );
};

export default GuestLoginBtn;
