import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "slim" | "outline-solid";
  indicatorClassName?: string;
  indicatorStyle?: React.CSSProperties;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      variant = "default",
      indicatorClassName,
      indicatorStyle,
      ...props
    },
    ref,
  ) => {
    const isSlim = variant === "slim";
    const isOutline = variant === "outline-solid";

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full border h-3 bg-white/20",
          isSlim && "bg-background border-white/20",
          isOutline &&
            "bg-white/20 border h-3 border-white/20",
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "bg-white transition-all",
            isSlim
              ? "absolute top-1/2 -translate-y-1/2 h-[60%] rounded-full"
              : "h-full w-full flex-1",
            indicatorClassName,
          )}
          style={
            isSlim
              ? {
                  left: "4px",
                  width: `calc(${value || 0}% - 8px)`,
                  ...indicatorStyle,
                }
              : {
                  transform: `translateX(-${100 - (value || 0)}%)`,
                  ...indicatorStyle,
                }
          }
        />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
