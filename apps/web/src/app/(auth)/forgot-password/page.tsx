import Link from "next/link";
import RoleSwitch from "../_Role/RoleSwitch";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-center pb-2 md:pb-4">
        Forgot Password
      </h1>
      <p className="text-center text-xs md:text-sm pb-6 text-foreground/70">
        Enter your account email to receive a reset link.
      </p>
      <ForgotPasswordForm />

      <div className="py-5">
        <Link
          href={"/login"}
          className="text-center underline xl:no-underline xl:hover:underline text-foreground/60 hover:text-foreground"
        >
          <p className="text-xs md:text-sm">Back to Login</p>
        </Link>
      </div>

      <RoleSwitch />
    </div>
  );
}
