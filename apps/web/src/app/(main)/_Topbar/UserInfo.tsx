"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";

const UserInfo = () => {
  const { data, isLoading } = useUser();

  if (isLoading) return <Skeleton className="p-4 md:p-5 rounded-full" />;

  if (!data) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-6">
      <div className="text-right hidden sm:block">
        <p className="font-semibold text-foreground/80 text-sm md:text-base">
          {data.name}
        </p>
        <p className="text-xs md:text-sm text-foreground/60">{data.email}</p>
      </div>
      <div className="p-2 md:p-3.5 rounded-full bg-linear-to-br from-green-700 to-green-500 font-semibold text-xs md:text-sm text-background">
        {data.name
          .split(" ")
          .slice(0, 2)
          .map((l) => l.charAt(0).toLocaleUpperCase())
          .join("")}
      </div>
    </div>
  );
};

export default UserInfo;
