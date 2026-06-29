import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-full h-[90vh] flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-0.5">
        <h1 className="font-extrabold text-5xl tracking-tight">404</h1>
        <p className="text-lg">Well aren&apos;t you a lost one?</p>
      </div>
      <Button asChild className="cursor-pointer px-3 py-4 rounded-xl">
        <Link href="/">Go back</Link>
      </Button>
    </div>
  );
}
