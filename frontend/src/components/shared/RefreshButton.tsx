"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { useTransition } from "react";

interface RefreshButtonProps {
  size?: "sm" | "lg" | "default";
  variant?: "default" | "outline" | "ghost";
  showLabel?: boolean;
}

const RefreshButton = ({
  showLabel = true,
  size = "default",
  variant,
}: RefreshButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };
  return (
    <Button
      size={size}
      variant={variant}
      disabled={isPending}
      onClick={handleRefresh}
    >
      <RefreshCcw
        className={`size-4 ${isPending ? "animate-spin" : ""} ${
          showLabel ? "mr-2" : ""
        }`}
      />
      {showLabel && "Refresh"}
    </Button>
  );
};

export default RefreshButton;
