import Link from "next/link";
import RoleSwitch from "../_Role/RoleSwitch";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
        Welcome back
      </h1>

      <LoginForm />

      <div className="flex flex-col py-6 gap-8">
        <p className="text-xs text-foreground/50 text-center">
          By continuing, you agree to Kurn's{" "}
          <a
            href="https://www.example.com/terms"
            className="text-foreground/70 hover:text-foreground underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="https://www.example.com/privacy"
            className="text-foreground/70 hover:text-foreground underline"
          >
            Privacy Policy
          </a>
        </p>

        <p className="text-xs md:text-sm text-foreground/50 text-center">
          Looking to get started?{" "}
          <Link
            href={"/request-access"}
            className=" text-foreground/70 hover:text-foreground underline lg:no-underline lg:hover:underline"
          >
            Request access
          </Link>
        </p>
      </div>

      <RoleSwitch />
    </div>
  );
}
