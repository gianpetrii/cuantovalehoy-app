"use client";

import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  tooltip?: string | React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

/**
 * Tarjeta para mostrar métricas financieras de forma visual
 * Incluye indicadores de tendencia y colores semánticos
 */
export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  tooltip,
  variant = "default",
  className,
}: MetricCardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-green-500/50 bg-green-500/5",
    warning: "border-yellow-500/50 bg-yellow-500/5",
    danger: "border-red-500/50 bg-red-500/5",
  };

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const trendColor =
    trend === "up"
      ? "text-green-600 dark:text-green-400"
      : trend === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground";

  return (
    <Card className={cn("transition-all hover:shadow-md", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              {tooltip && <InfoTooltip content={tooltip} />}
            </div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {trend && trendValue && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1",
                "text-xs font-medium",
                trendColor
              )}
            >
              <TrendIcon className="h-3 w-3" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

