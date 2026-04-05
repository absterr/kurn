"use client";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-foreground text-background px-4 py-2 cursor-pointer"
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
};

export default SubmitButton;
