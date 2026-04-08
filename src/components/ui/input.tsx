import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-base font-medium transition-all outline-none placeholder:text-outline/40 focus-visible:border-primary-custom focus-visible:ring-3 focus-visible:ring-primary-custom/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-container-low/50 disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-3 aria-invalid:ring-error/10 dark:bg-surface-container-low dark:disabled:bg-surface-container-highest/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
