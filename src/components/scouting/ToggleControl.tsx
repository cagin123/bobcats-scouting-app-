import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

const ToggleControl = ({
  label,
  value,
  onChange,
  className,
}: ToggleControlProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "quick-toggle w-full",
        className
      )}
      data-active={value}
    >
      <span className="text-sm font-medium">{label}</span>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
          value
            ? "bg-status-success/20 text-status-success"
            : "bg-secondary text-muted-foreground"
        )}
      >
        {value ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </div>
    </button>
  );
};

export default ToggleControl;
