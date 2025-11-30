"use client";

import * as React from "react";
import {
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

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface InflationTimelineChartProps {
  data: DataPoint[];
  title?: string;
  tooltip?: string;
  valueLabel?: string;
  currency?: string;
  className?: string;
}

/**
 * Gráfico de línea temporal para mostrar la evolución del valor ajustado por inflación
 * Ayuda a visualizar cómo el dinero pierde/gana valor en el tiempo
 */
export function InflationTimelineChart({
  data,
  title = "Evolución del Valor",
  tooltip = "Muestra cómo cambia el valor de tu dinero mes a mes, ajustado por inflación",
  valueLabel = "Valor",
  currency = "$",
  className,
}: InflationTimelineChartProps) {
  const formatValue = (value: number) => {
    return `${currency}${value.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const formatDate = (date: string) => {
    const [year, month] = date.split("-");
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
  };

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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis
              tickFormatter={formatValue}
              className="text-xs"
              stroke="currentColor"
            />
            <Tooltip
              formatter={(value: number) => [formatValue(value), valueLabel]}
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={valueLabel}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

