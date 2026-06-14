import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./_Theme/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kurn",
  description: "An outbound automation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster
            richColors
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: `${poppins.className} antialiased rounded-md shadow-md border text-sm`,
                success: "bg-green-100 border-green-500 text-green-900",
                error: "bg-red-100 border-red-500 text-red-900",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
