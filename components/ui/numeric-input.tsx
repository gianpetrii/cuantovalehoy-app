"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface NumericInputProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  tooltip?: string | React.ReactNode;
  error?: string;
  containerClassName?: string;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Formatea un número con separadores de miles (punto para miles, coma para decimales)
 * Estilo argentino: 1.234.567,89
 */
function formatNumber(value: string, decimals: number = 2): string {
  // Remove all non-numeric characters except comma and minus
  const cleanValue = value.replace(/[^\d,-]/g, "");
  
  if (!cleanValue || cleanValue === "-") return cleanValue;

  // Split by comma (decimal separator in Argentine format)
  const parts = cleanValue.split(",");
  let integerPart = parts[0].replace(/\D/g, "");
  const isNegative = cleanValue.startsWith("-");
  
  // Add thousand separators (dots)
  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Handle decimal part
  let result = (isNegative ? "-" : "") + integerPart;
  
  if (parts.length > 1) {
    // Limit decimal places
    const decimalPart = parts[1].slice(0, decimals);
    result += "," + decimalPart;
  }

  return result;
}

/**
 * Convierte un valor formateado a número
 */
function parseFormattedNumber(formattedValue: string): string {
  if (!formattedValue) return "";
  
  // Remove thousand separators (dots) and replace comma with dot for parsing
  const cleanValue = formattedValue
    .replace(/\./g, "") // Remove thousand separators
    .replace(",", "."); // Replace decimal comma with dot
  
  return cleanValue;
}

/**
 * Input numérico con formateo de miles y decimales
 * Muestra: 1.234.567,89 (formato argentino)
 * Almacena: 1234567.89 (formato para cálculos)
 */
export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      label,
      icon: Icon,
      value,
      onChange,
      tooltip,
      error,
      containerClassName,
      className,
      placeholder,
      min,
      max,
      step,
      decimals = 2,
      prefix,
      suffix,
      disabled,
      id,
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    
    // Convert stored value (1234567.89) to display format (1.234.567,89)
    const displayValue = React.useMemo(() => {
      if (!value) return "";
      
      // Convert from storage format to display format
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return "";
      
      // Format with Argentine locale
      const formatted = numValue.toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
      
      return formatted;
    }, [value, decimals]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow empty input
      if (!inputValue) {
        onChange("");
        return;
      }

      // Format the display value
      const formattedValue = formatNumber(inputValue, decimals);
      
      // Convert to storage format (plain number)
      const storageValue = parseFormattedNumber(formattedValue);
      
      // Validate if it's a valid number
      const numValue = parseFloat(storageValue);
      if (storageValue && !isNaN(numValue)) {
        // Check min/max bounds
        if (min !== undefined && numValue < min) return;
        if (max !== undefined && numValue > max) return;
        
        onChange(storageValue);
      } else if (storageValue === "" || storageValue === "-") {
        onChange(storageValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, decimal comma
      if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "Enter" ||
        e.key === "," ||
        e.key === "-" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Home" ||
        e.key === "End" ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
      ) {
        return;
      }
      
      // Block non-numeric keys
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    };

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <div className="flex items-center gap-2">
          <Label htmlFor={inputId} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{label}</span>
          </Label>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              prefix && "pl-8",
              suffix && "pr-12",
              error && "border-destructive",
              className
            )}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

NumericInput.displayName = "NumericInput";

