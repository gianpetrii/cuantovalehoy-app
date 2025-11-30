"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface InflationGaugeProps {
  percentage: number;
  title?: string;
  tooltip?: string;
  className?: string;
}

/**
 * Medidor visual de inflación con colores semánticos
 * Verde: baja (<10%), Amarillo: media (10-50%), Rojo: alta (>50%)
 */
export function InflationGauge({
  percentage,
  title = "Inflación Acumulada",
  tooltip = "Porcentaje de inflación total entre las fechas seleccionadas",
  className,
}: InflationGaugeProps) {
  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 10) return "text-green-600 dark:text-green-400";
    if (percentage < 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBgColor = () => {
    if (percentage < 10) return "bg-green-500/10";
    if (percentage < 50) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const getLabel = () => {
    if (percentage < 10) return "Baja";
    if (percentage < 50) return "Media";
    return "Alta";
  };

  // Calculate gauge fill (max 180 degrees for semicircle)
  const rotation = Math.min((percentage / 100) * 180, 180);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            <CardTitle>{title}</CardTitle>
          </div>
          <InfoTooltip content={tooltip} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Gauge visualization */}
          <div className="relative w-48 h-24">
            {/* Background semicircle */}
            <div className="absolute inset-0 flex items-end justify-center">
              <div className="w-full h-full rounded-t-full border-8 border-muted" />
            </div>
            
            {/* Filled semicircle */}
            <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
              <div
                className={cn(
                  "w-full h-full rounded-t-full border-8 transition-all duration-500",
                  percentage < 10 && "border-green-500",
                  percentage >= 10 && percentage < 50 && "border-yellow-500",
                  percentage >= 50 && "border-red-500"
                )}
                style={{
                  clipPath: `polygon(0 100%, 0 ${100 - (rotation / 180) * 100}%, 100% ${100 - (rotation / 180) * 100}%, 100% 100%)`,
                }}
              />
            </div>

            {/* Center value */}
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <div className="text-center">
                <p className={cn("text-3xl font-bold", getColor())}>
                  {percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Label */}
          <div
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium",
              getBgColor(),
              getColor()
            )}
          >
            Inflación {getLabel()}
          </div>

          {/* Description */}
          <p className="text-sm text-center text-muted-foreground max-w-xs">
            {percentage < 10 && "La inflación es relativamente baja en este período"}
            {percentage >= 10 && percentage < 50 && "Inflación moderada que afecta el poder adquisitivo"}
            {percentage >= 50 && "Inflación alta que erosiona significativamente el valor del dinero"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

