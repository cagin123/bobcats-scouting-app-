import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
}

const StarRating = ({
  label,
  value,
  onChange,
  max = 5,
  className,
}: StarRatingProps) => {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="star-rating">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "w-8 h-8 flex items-center justify-center transition-colors",
              i < value ? "star-active" : "star-inactive"
            )}
            aria-label={`Rate ${i + 1} out of ${max}`}
          >
            <Star className="w-5 h-5" fill={i < value ? "currentColor" : "none"} strokeWidth={i < value ? 0 : 1.5} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
