import { cn } from "@/lib/utils";

interface AllianceToggleProps {
  value: "red" | "blue";
  onChange: (value: "red" | "blue") => void;
  className?: string;
}

const AllianceToggle = ({ value, onChange, className }: AllianceToggleProps) => {
  return (
    <div className={cn("flex gap-2", className)}>
      <button
        type="button"
        onClick={() => onChange("red")}
        className={cn(
          "flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all",
          value === "red"
            ? "alliance-toggle-red"
            : "bg-card-elevated text-muted-foreground hover:text-foreground hover:bg-card-elevated-2"
        )}
      >
        RED
      </button>
      <button
        type="button"
        onClick={() => onChange("blue")}
        className={cn(
          "flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all",
          value === "blue"
            ? "alliance-toggle-blue"
            : "bg-card-elevated text-muted-foreground hover:text-foreground hover:bg-card-elevated-2"
        )}
      >
        BLUE
      </button>
    </div>
  );
};

export default AllianceToggle;
