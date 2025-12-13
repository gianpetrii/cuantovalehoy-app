"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import {
  TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string | React.ReactNode;
  className?: string;
  iconClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Componente de tooltip informativo con ícono de ayuda
 * Útil para explicar conceptos financieros a usuarios no técnicos
 */
export function InfoTooltip({
  content,
  className,
  iconClassName,
  side = "top",
}: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <TooltipRoot>
        <TooltipTrigger
          className={cn(
            "inline-flex items-center justify-center rounded-full",
            "text-muted-foreground hover:text-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          aria-label="Más información"
        >
          <HelpCircle className={cn("h-4 w-4", iconClassName)} />
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs text-sm">
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

