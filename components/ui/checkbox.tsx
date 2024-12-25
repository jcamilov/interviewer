"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn("checkbox checkbox-primary", className)}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
