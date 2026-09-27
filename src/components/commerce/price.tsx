import { cn, formatPrice } from "@/lib/utils";

export function Price({
  amount,
  compareAt,
  size = "md",
  className,
}: {
  amount: number;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const onSale = typeof compareAt === "number" && compareAt > amount;

  const sizes = {
    sm: "text-[0.8125rem]",
    md: "text-sm",
    lg: "text-base md:text-lg",
  } as const;

  return (
    <span className={cn("price inline-flex items-baseline gap-2", sizes[size], className)}>
      <span className={cn(onSale ? "text-flare" : "text-ink")}>
        {formatPrice(amount)}
      </span>
      {onSale ? (
        <s className="font-normal text-muted/70 decoration-muted/50">
          {formatPrice(compareAt)}
        </s>
      ) : null}
    </span>
  );
}
