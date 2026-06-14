import AppIcon from "@/components/icons/AppIcon";
import { RoleProvider } from "./role-provider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleProvider>
      <div className="min-h-screen flex items-center justify-center p-4 bg-foreground/5 dark:bg-background">
        <div className="w-full max-w-md px-6 py-12">
          <div className="flex justify-center pb-4">
            <AppIcon className="size-12" />
          </div>
          {children}
        </div>
      </div>
    </RoleProvider>
  );
}
