"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface MonthYearPickerProps {
  label: string;
  value: string; // Format: "YYYY-MM"
  onChange: (value: string) => void;
  minDate?: string; // Format: "YYYY-MM"
  maxDate?: string; // Format: "YYYY-MM"
  tooltip?: string | React.ReactNode;
  error?: string;
  className?: string;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function MonthYearPicker({
  label,
  value,
  onChange,
  minDate = "2020-01",
  maxDate,
  tooltip,
  error,
  className,
}: MonthYearPickerProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const defaultMaxDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const effectiveMaxDate = maxDate || defaultMaxDate;
  
  // Parse min/max dates
  const [minYear, minMonth] = minDate.split('-').map(Number);
  const [maxYear, maxMonth] = effectiveMaxDate.split('-').map(Number);
  
  // Current selection
  const [year, month] = value ? value.split('-').map(Number) : [currentYear, currentMonth + 1];
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(year);

  // Check if a month is disabled
  const isMonthDisabled = (checkYear: number, checkMonth: number) => {
    const checkDate = checkYear * 12 + checkMonth;
    const minDateNum = minYear * 12 + minMonth;
    const maxDateNum = maxYear * 12 + maxMonth;
    return checkDate < minDateNum || checkDate > maxDateNum;
  };

  // Handle month selection
  const handleMonthSelect = (selectedMonth: number) => {
    const monthStr = String(selectedMonth).padStart(2, '0');
    const newValue = `${viewYear}-${monthStr}`;
    onChange(newValue);
    setIsOpen(false);
  };

  // Navigation
  const handlePrevYear = () => {
    if (viewYear > minYear) {
      setViewYear(viewYear - 1);
    }
  };

  const handleNextYear = () => {
    if (viewYear < maxYear) {
      setViewYear(viewYear + 1);
    }
  };

  const canGoPrev = viewYear > minYear;
  const canGoNext = viewYear < maxYear;

  // Format display value
  const displayValue = value 
    ? `${MONTHS[month - 1]} ${year}`
    : "Seleccionar mes";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span>{label}</span>
        </Label>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-destructive"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Picker */}
            <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-4 shadow-md">
              {/* Year navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handlePrevYear}
                  disabled={!canGoPrev}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-semibold">
                  {viewYear}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleNextYear}
                  disabled={!canGoNext}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Months grid */}
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((monthName, idx) => {
                  const monthNum = idx + 1;
                  const disabled = isMonthDisabled(viewYear, monthNum);
                  const isSelected = year === viewYear && month === monthNum;

                  return (
                    <Button
                      key={idx}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleMonthSelect(monthNum)}
                      disabled={disabled}
                      className={cn(
                        "h-9 text-xs",
                        disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {monthName.substring(0, 3)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
