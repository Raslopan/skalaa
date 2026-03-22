import Link from "next/link";

interface LogoProps {
  /** Controls text and icon color variant */
  variant?: "light" | "dark";
  /** Additional CSS classes */
  className?: string;
}

export function Logo({ variant = "light", className = "" }: LogoProps) {
  const iconFill = variant === "light" ? "white" : "currentColor";
  const iconBgOpacity = variant === "light" ? 0.12 : 0.08;
  const textColor =
    variant === "light" ? "text-primary-foreground" : "text-foreground";

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 group ${className}`}
      aria-label="StayHub - home"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition-opacity group-hover:opacity-90"
      >
        {/* Outer rounded square */}
        <rect
          width="32"
          height="32"
          rx="8"
          fill={variant === "light" ? `rgba(255,255,255,${iconBgOpacity})` : "var(--primary)"}
          fillOpacity={variant === "light" ? 1 : 0.1}
        />
        {/* Base platform */}
        <rect
          x="6"
          y="22"
          width="20"
          height="2.5"
          rx="1.25"
          fill={iconFill}
          fillOpacity={variant === "light" ? 0.9 : 0.85}
        />
        {/* Left module */}
        <rect
          x="6"
          y="14"
          width="8"
          height="7"
          rx="1.5"
          fill={iconFill}
          fillOpacity={variant === "light" ? 0.55 : 0.5}
        />
        {/* Right module */}
        <rect
          x="18"
          y="14"
          width="8"
          height="7"
          rx="1.5"
          fill={iconFill}
          fillOpacity={variant === "light" ? 0.55 : 0.5}
        />
        {/* Center top module */}
        <rect
          x="11"
          y="7"
          width="10"
          height="8"
          rx="1.5"
          fill={iconFill}
          fillOpacity={variant === "light" ? 0.9 : 0.85}
        />
        {/* Window details */}
        <circle
          cx="16"
          cy="10.5"
          r="1.2"
          fill={variant === "light" ? "rgba(255,255,255,0.35)" : "var(--background)"}
          fillOpacity={variant === "light" ? 1 : 0.5}
        />
        <rect
          x="13.5"
          y="13"
          width="5"
          height="1"
          rx="0.5"
          fill={variant === "light" ? "rgba(255,255,255,0.3)" : "var(--background)"}
          fillOpacity={variant === "light" ? 1 : 0.4}
        />
      </svg>
      <span
        className={`text-[1.2rem] font-semibold tracking-tight leading-none ${textColor}`}
      >
        Stay<span className="font-light opacity-80">Hub</span>
      </span>
    </Link>
  );
}
