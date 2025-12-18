"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface DatePickerProps {
  label: string;
  value: string; // Format: "YYYY-MM-DD"
  onChange: (value: string) => void;
  minDate?: string; // Format: "YYYY-MM-DD"
  maxDate?: string; // Format: "YYYY-MM-DD"
  tooltip?: string | React.ReactNode;
  error?: string;
  className?: string;
  autoOpen?: boolean;
  onOpen?: () => void;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAYS_SHORT = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

export function DatePicker({
  label,
  value,
  onChange,
  minDate = "2020-01-01",
  maxDate = "2024-11-30",
  tooltip,
  error,
  className,
}: DatePickerProps) {
  // Estado para el mes/año que se está viendo
  const today = new Date();
  const initialDate = value ? new Date(value + "T00:00:00") : today;
  
  const [viewYear, setViewYear] = React.useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initialDate.getMonth());
  const [isOpen, setIsOpen] = React.useState(false);

  // Actualizar la vista cuando cambia el valor
  React.useEffect(() => {
    if (value) {
      const date = new Date(value + "T00:00:00");
      setViewYear(date.getFullYear());
      setViewMonth(date.getMonth());
    }
  }, [value]);

  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return { year, month: month - 1, day }; // month 0-11
  };

  const minDateParsed = parseDate(minDate);
  const maxDateParsed = parseDate(maxDate);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const month = String(viewMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const newValue = `${viewYear}-${month}-${dayStr}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const isDateDisabled = (year: number, month: number, day: number) => {
    // Comparar con fecha mínima
    if (year < minDateParsed.year) return true;
    if (year === minDateParsed.year && month < minDateParsed.month) return true;
    if (year === minDateParsed.year && month === minDateParsed.month && day < minDateParsed.day) return true;
    
    // Comparar con fecha máxima
    if (year > maxDateParsed.year) return true;
    if (year === maxDateParsed.year && month > maxDateParsed.month) return true;
    if (year === maxDateParsed.year && month === maxDateParsed.month && day > maxDateParsed.day) return true;
    
    return false;
  };

  const isMonthDisabled = (year: number, month: number) => {
    if (year < minDateParsed.year || year > maxDateParsed.year) return true;
    if (year === minDateParsed.year && month < minDateParsed.month) return true;
    if (year === maxDateParsed.year && month > maxDateParsed.month) return true;
    return false;
  };

  const canGoPrev = !isMonthDisabled(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  );

  const canGoNext = !isMonthDisabled(
    viewMonth === 11 ? viewYear + 1 : viewYear,
    viewMonth === 11 ? 0 : viewMonth + 1
  );

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const formatDisplayValue = () => {
    if (!value) return "Selecciona una fecha";
    const [year, month, day] = value.split("-");
    return `${day} de ${MONTHS[parseInt(month) - 1]} de ${year}`;
  };

  const selectedDate = value ? parseDate(value) : null;
  
  const isToday = (day: number) => {
    return day === today.getDate() && 
           viewMonth === today.getMonth() && 
           viewYear === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.day === day &&
           selectedDate.month === viewMonth &&
           selectedDate.year === viewYear;
  };

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
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-start text-left font-normal inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
            !value && "text-muted-foreground",
            error && "border-destructive"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDisplayValue()}
        </button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Calendar Content */}
            <div className="absolute left-0 top-full mt-2 z-50 rounded-md border bg-popover p-3 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 w-auto"
              onClick={(e) => e.stopPropagation()}
            >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold text-sm">
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              disabled={!canGoNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_SHORT.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground p-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const disabled = isDateDisabled(viewYear, viewMonth, day);
              const selected = isSelected(day);
              const todayDay = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (!disabled) {
                      handleDayClick(day);
                    }
                  }}
                  disabled={disabled}
                  className={cn(
                    "h-9 w-9 p-0 font-normal rounded-md text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "bg-primary text-primary-foreground hover:bg-primary/90",
                    todayDay && !selected && "border border-primary",
                    disabled && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {day}
                </button>
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
