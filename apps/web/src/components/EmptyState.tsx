import type { LucideIcon } from "lucide-react";

const EmptyState = ({
  icon: Icon,
  headline,
  message,
}: {
  icon: LucideIcon;
  headline: string;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center w-full h-3/4 gap-3 text-center px-6">
    <div className="size-8 rounded-full bg-muted flex items-center justify-center">
      <Icon className="size-4 text-muted-foreground" />
    </div>
    <div>
      <p className="text-sm font-medium">{headline}</p>
      <p className="text-xs text-muted-foreground pt-1">{message}</p>
    </div>
  </div>
);

export default EmptyState;
