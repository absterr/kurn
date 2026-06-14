import { tokenSchema } from "@/lib/schema/auth-schema";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const parsed = tokenSchema.safeParse(token);

  if (!token || !parsed.success) {
    return (
      <section className="flex flex-col items-center justify-center gap-1.5">
        <h1 className="font-extrabold text-5xl tracking-tight">404</h1>
        <p className="text-lg">Page not found</p>
      </section>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
        Reset Password
      </h1>
      <ResetPasswordForm token={token} />
    </div>
  );
}
