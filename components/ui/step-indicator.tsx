"use client";

import * as React from "react";
import { Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

/**
 * Indicador visual de pasos para procesos multi-etapa
 * Ayuda a los usuarios a entender el flujo de cálculos complejos
 */
export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const Icon = step.icon;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-2 flex-1">
                {/* Circle indicator */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-background text-primary scale-110",
                    !isCompleted &&
                      !isCurrent &&
                      "border-muted bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors",
                      (isCompleted || isCurrent)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors -mt-8",
                    index < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

