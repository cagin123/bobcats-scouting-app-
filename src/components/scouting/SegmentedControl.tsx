import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("space-y-2", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex gap-1.5 p-1.5 bg-card rounded-xl">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 py-2.5 px-3 text-sm font-medium rounded-lg transition-all",
              value === option.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-card-elevated"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SegmentedControl;
