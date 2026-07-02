import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1b5e20] text-white hover:bg-[#2e7d32] focus-visible:ring-[#1b5e20]",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-[#1b5e20] text-[#1b5e20] hover:bg-[#e8f5e9] dark:border-[#4caf50] dark:text-[#4caf50] dark:hover:bg-[#1b5e20]/20",
        secondary: "bg-[#f9a825] text-black hover:bg-[#ffa000]",
        ghost: "hover:bg-[#e8f5e9] hover:text-[#1b5e20] dark:hover:bg-[#1b5e20]/20 dark:hover:text-[#4caf50]",
        link: "text-[#1b5e20] underline-offset-4 hover:underline dark:text-[#4caf50]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
