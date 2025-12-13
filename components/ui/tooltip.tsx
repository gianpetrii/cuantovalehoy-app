"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={`inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
      >
        {children || <HelpCircle className="h-4 w-4" />}
      </button>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 text-sm bg-popover text-popover-foreground border rounded-md shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 animate-in fade-in-0 zoom-in-95">
          <div className="space-y-1">
            {content}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-8 border-transparent border-t-popover" />
          </div>
        </div>
      )}
    </div>
  );
}

// Additional exports for compatibility with info-tooltip component
interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>;
}

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined);

interface TooltipRootProps {
  children: React.ReactNode;
}

export function TooltipRoot({ children }: TooltipRootProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ children, asChild, className }, ref) => {
    const context = React.useContext(TooltipContext);
    
    const handleMouseEnter = () => context?.setOpen(true);
    const handleMouseLeave = () => context?.setOpen(false);

    if (asChild && React.isValidElement(children)) {
      const childProps = children.props as any;
      return React.cloneElement(children, {
        ...childProps,
        ref,
        onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
          handleMouseEnter();
          childProps.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
          handleMouseLeave();
          childProps.onMouseLeave?.(e);
        },
      } as any);
    }

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </button>
    );
  }
);

TooltipTrigger.displayName = "TooltipTrigger";

interface TooltipContentProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function TooltipContent({ children, side = "top", className }: TooltipContentProps) {
  const context = React.useContext(TooltipContext);

  if (!context?.open) return null;

  const sideClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={cn(
        "absolute z-50 w-64 p-3 text-sm bg-popover text-popover-foreground border rounded-md shadow-lg animate-in fade-in-0 zoom-in-95",
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
}

// Note: TooltipRoot is available for advanced usage
// The main Tooltip export is the simple version above

