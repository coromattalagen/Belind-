interface SparkleProps {
  className?: string;
  size?: number;
  delay?: number;
  duration?: number;
  color?: string;
}

/** Quick 4-point twinkle, same star as the B mark. Decorative only. */
export function Sparkle({ className = '', size = 14, delay = 0, duration = 2.6, color = '#C5A46D' }: SparkleProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="currentColor"
      className={`sparkle pointer-events-none ${className}`}
      style={{ color, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
    >
      <path d="M60 0L72 48L120 60L72 72L60 120L48 72L0 60L48 48L60 0Z" />
    </svg>
  );
}
