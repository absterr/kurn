import ResetPasswordForm from "./ResetPasswordForm";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
        Reset Password
      </h1>
      <ResetPasswordForm />
    </div>
  );
}
