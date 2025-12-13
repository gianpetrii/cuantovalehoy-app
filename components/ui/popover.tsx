"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined
);

interface PopoverProps {
  children: React.ReactNode;
}

export function Popover({ children }: PopoverProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ children, asChild, className }, ref) => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("PopoverTrigger must be used within Popover");
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context.setOpen(!context.open);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    return React.cloneElement(children, {
      ...childProps,
      ref,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        handleClick(e);
        childProps.onClick?.(e);
      },
    } as any);
  }

  return (
    <button ref={ref} onClick={handleClick} className={className}>
      {children}
    </button>
  );
});

PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export function PopoverContent({
  children,
  align = "center",
  className,
}: PopoverContentProps) {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("PopoverContent must be used within Popover");
  }

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  if (!context.open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => context.setOpen(false)}
      />
      {/* Content */}
      <div
        className={cn(
          "absolute top-full mt-2 z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          alignClasses[align],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
}

