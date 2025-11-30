"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  tooltip?: string | React.ReactNode;
  error?: string;
  containerClassName?: string;
}

/**
 * Input mejorado con ícono, label y tooltip explicativo
 * Diseñado para ser intuitivo para usuarios no técnicos
 */
export const InputWithIcon = React.forwardRef<
  HTMLInputElement,
  InputWithIconProps
>(
  (
    {
      label,
      icon: Icon,
      tooltip,
      error,
      containerClassName,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <div className="flex items-center gap-2">
          <Label htmlFor={inputId} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{label}</span>
          </Label>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        <Input
          id={inputId}
          ref={ref}
          className={cn(error && "border-destructive", className)}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";

