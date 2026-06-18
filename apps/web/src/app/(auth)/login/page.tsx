import RoleSwitch from "../_Role/RoleSwitch";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
        Welcome back
      </h1>

      <LoginForm />
      <div className="flex justify-center py-5">
        <div className="h-1.5 w-1.5 rounded-full bg-foreground/70 self-center" />
      </div>
      <RoleSwitch />
    </div>
  );
}
