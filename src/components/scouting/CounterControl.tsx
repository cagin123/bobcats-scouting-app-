import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CounterControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const CounterControl = ({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  className,
}: CounterControlProps) => {
  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <span className="text-sm font-medium text-foreground flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="counter-btn disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="w-10 text-center font-mono text-lg font-bold tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="counter-btn disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CounterControl;
