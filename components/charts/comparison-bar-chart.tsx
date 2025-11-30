"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { BarChart3 } from "lucide-react";

interface ComparisonData {
  name: string;
  value: number;
  color?: string;
}

interface ComparisonBarChartProps {
  data: ComparisonData[];
  title?: string;
  tooltip?: string;
  currency?: string;
  className?: string;
}

/**
 * Gráfico de barras para comparar valores
 * Ideal para mostrar antes vs después, o múltiples escenarios
 */
export function ComparisonBarChart({
  data,
  title = "Comparación de Valores",
  tooltip = "Compara diferentes valores lado a lado",
  currency = "$",
  className,
}: ComparisonBarChartProps) {
  const formatValue = (value: number) => {
    return `${currency}${value.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const defaultColors = [
    "hsl(var(--primary))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>{title}</CardTitle>
          </div>
          <InfoTooltip content={tooltip} />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis
              tickFormatter={formatValue}
              className="text-xs"
              stroke="currentColor"
            />
            <Tooltip
              formatter={(value: number) => formatValue(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

