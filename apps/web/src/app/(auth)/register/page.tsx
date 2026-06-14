import RegisterForm from "./RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    // Return Not found page
    return <div></div>;
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-center pb-6 md:pb-8">
        Register
      </h1>

      <RegisterForm token={token} />

      <p className="text-xs text-foreground/50 text-center pt-6">
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
    </div>
  );
}
