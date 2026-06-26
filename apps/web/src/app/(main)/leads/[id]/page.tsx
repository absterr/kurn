import { Ban } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import EmptyState from "@/components/EmptyState";
import { LeadsProvider } from "@/lib/LeadsProvider";
import LeadQueryWrapper from "./LeadQueryWrapper";

export default async function LeadQuery({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headersList = await headers();
  const role = headersList.get("x-role");
  const parsed = z.uuid().safeParse(id);

  if (!role || role === "admin") redirect("/login");
  if (!parsed.success) {
    return (
      <EmptyState
        icon={Ban}
        headline="Invalid ID"
        message="The provided ID is not valid"
      />
    );
  }

  return (
    <LeadsProvider role={role}>
      <LeadQueryWrapper id={id} role={role} />;
    </LeadsProvider>
  );
}
