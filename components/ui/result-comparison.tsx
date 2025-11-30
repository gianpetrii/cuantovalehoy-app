"use client";

import * as React from "react";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultComparisonProps {
  title?: string;
  beforeLabel: string;
  beforeValue: string | number;
  afterLabel: string;
  afterValue: string | number;
  changePercentage?: number;
  changeLabel?: string;
  variant?: "default" | "success" | "danger";
  className?: string;
}

/**
 * Componente para mostrar comparaciones antes/después
 * Visual e intuitivo para entender cambios de valor
 */
export function ResultComparison({
  title = "Comparación",
  beforeLabel,
  beforeValue,
  afterLabel,
  afterValue,
  changePercentage,
  changeLabel,
  variant = "default",
  className,
}: ResultComparisonProps) {
  const isPositive = changePercentage !== undefined && changePercentage > 0;
  const isNegative = changePercentage !== undefined && changePercentage < 0;

  const variantStyles = {
    default: "",
    success: "border-green-500/50 bg-green-500/5",
    danger: "border-red-500/50 bg-red-500/5",
  };

  return (
    <Card className={cn("transition-all", variantStyles[variant], className)}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(!title && "pt-6")}>
        <div className="flex items-center justify-between gap-4">
          {/* Before */}
          <div className="flex-1 text-center space-y-1">
            <p className="text-sm text-muted-foreground">{beforeLabel}</p>
            <p className="text-2xl font-bold">{beforeValue}</p>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* After */}
          <div className="flex-1 text-center space-y-1">
            <p className="text-sm text-muted-foreground">{afterLabel}</p>
            <p className="text-2xl font-bold">{afterValue}</p>
          </div>
        </div>

        {/* Change indicator */}
        {changePercentage !== undefined && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-center gap-2">
              {isPositive && (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
              {isNegative && (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive && "text-green-600 dark:text-green-400",
                  isNegative && "text-red-600 dark:text-red-400",
                  !isPositive && !isNegative && "text-muted-foreground"
                )}
              >
                {changePercentage > 0 && "+"}
                {changePercentage.toFixed(2)}%
              </span>
              {changeLabel && (
                <span className="text-sm text-muted-foreground">
                  {changeLabel}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

