"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { TrendingUp } from "lucide-react";

interface CompoundInterestDataPoint {
  period: number;
  capital: number;
  interest: number;
  total: number;
  pessimistic?: number;
  optimistic?: number;
  label?: string;
}

interface CompoundInterestChartProps {
  data: CompoundInterestDataPoint[];
  title?: string;
  tooltip?: string;
  currency?: string;
  periodLabel?: string;
  showVariance?: boolean;
  className?: string;
}

/**
 * Gráfico de área apilada para interés compuesto
 * Muestra visualmente cómo el capital y los intereses crecen exponencialmente
 */
export function CompoundInterestChart({
  data,
  title = "Proyección de Inversión",
  tooltip = "Muestra cómo crece tu inversión: capital aportado vs intereses ganados",
  currency = "$",
  periodLabel = "Año",
  showVariance = false,
  className,
}: CompoundInterestChartProps) {
  const formatValue = (value: number) => {
    return `${currency}${value.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const hasVarianceData = data.some(d => d.pessimistic !== undefined || d.optimistic !== undefined);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>{title}</CardTitle>
          </div>
          <InfoTooltip content={tooltip} />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {hasVarianceData ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="period"
                label={{
                  value: periodLabel,
                  position: "insideBottom",
                  offset: -5,
                }}
                className="text-xs"
                stroke="currentColor"
              />
              <YAxis
                tickFormatter={formatValue}
                className="text-xs"
                stroke="currentColor"
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    pessimistic: "Escenario Pesimista",
                    total: "Escenario Normal",
                    optimistic: "Escenario Optimista",
                  };
                  return [formatValue(value), labels[name] || name];
                }}
                labelFormatter={(label) => `${periodLabel} ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    pessimistic: "Escenario Pesimista",
                    total: "Escenario Normal",
                    optimistic: "Escenario Optimista",
                  };
                  return labels[value] || value;
                }}
              />
              <Line
                type="monotone"
                dataKey="pessimistic"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
                name="pessimistic"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={false}
                name="total"
              />
              <Line
                type="monotone"
                dataKey="optimistic"
                stroke="hsl(var(--green-chart))"
                strokeWidth={2}
                dot={false}
                name="optimistic"
                strokeDasharray="5 5"
              />
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="period"
                label={{
                  value: periodLabel,
                  position: "insideBottom",
                  offset: -5,
                }}
                className="text-xs"
                stroke="currentColor"
              />
              <YAxis
                tickFormatter={formatValue}
                className="text-xs"
                stroke="currentColor"
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatValue(value),
                  name === "capital" ? "Capital" : "Intereses",
                ]}
                labelFormatter={(label) => `${periodLabel} ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend
                formatter={(value) =>
                  value === "capital" ? "Capital Aportado" : "Intereses Ganados"
                }
              />
              <Area
                type="monotone"
                dataKey="capital"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="url(#colorCapital)"
                name="capital"
              />
              <Area
                type="monotone"
                dataKey="interest"
                stackId="1"
                stroke="hsl(var(--chart-2))"
                fill="url(#colorInterest)"
                name="interest"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>

        {/* Summary below chart */}
        {hasVarianceData ? (
          <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Pesimista</p>
              <p className="text-lg font-bold text-destructive">
                {formatValue(data[data.length - 1]?.pessimistic || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Normal</p>
              <p className="text-lg font-bold text-primary">
                {formatValue(data[data.length - 1]?.total || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Optimista</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatValue(data[data.length - 1]?.optimistic || 0)}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Capital Total</p>
              <p className="text-lg font-bold text-primary">
                {formatValue(data[data.length - 1]?.capital || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Intereses</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatValue(data[data.length - 1]?.interest || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Final</p>
              <p className="text-lg font-bold">
                {formatValue(data[data.length - 1]?.total || 0)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

