"use client";

import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface ComparisonCardProps {
  title: string;
  beforeLabel: string;
  beforeValue: string;
  afterLabel: string;
  afterValue: string;
  changePercent?: number;
  changeLabel?: string;
  variant?: "neutral" | "positive" | "negative";
  className?: string;
}

export function ComparisonCard({
  title,
  beforeLabel,
  beforeValue,
  afterLabel,
  afterValue,
  changePercent,
  changeLabel,
  variant = "neutral",
  className,
}: ComparisonCardProps) {
  const isPositive = variant === "positive";
  const isNegative = variant === "negative";

  return (
    <div
      className={cn(
        "p-6 rounded-lg border bg-card space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground">{title}</h4>
        {changePercent !== undefined && (
          <Badge
            variant={isPositive ? "success" : isNegative ? "destructive" : "secondary"}
            className="flex items-center gap-1"
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {changePercent > 0 ? "+" : ""}
            {changePercent.toFixed(1)}%
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Before */}
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">{beforeLabel}</p>
          <p className="text-lg font-bold">{beforeValue}</p>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* After */}
        <div className="flex-1 space-y-1 text-right">
          <p className="text-xs text-muted-foreground">{afterLabel}</p>
          <p
            className={cn(
              "text-lg font-bold",
              isPositive && "text-green-600",
              isNegative && "text-red-600"
            )}
          >
            {afterValue}
          </p>
        </div>
      </div>

      {changeLabel && (
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground text-center">{changeLabel}</p>
        </div>
      )}
    </div>
  );
}

