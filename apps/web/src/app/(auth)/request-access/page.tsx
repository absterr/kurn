import Link from "next/link";
import RequestAccessForm from "./RequestAccessForm";

export default function RequestAccess() {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
        Request Access
      </h1>

      <RequestAccessForm />

      <p className="text-xs md:text-sm text-foreground/50 text-center pt-8">
        Already have an account?{" "}
        <Link
          href={"/login"}
          className=" text-foreground/70 hover:text-foreground underline lg:no-underline lg:hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
