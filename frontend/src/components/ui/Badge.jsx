import React from "react";

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
}) {
  const baseStyles =
    "inline-flex items-center font-medium transition-colors select-none";

  const variantStyles = {
    primary: "bg-primary text-white",
    primarySubtle: "bg-primary/10 text-primary border border-primary/20",
    accent: "bg-accent text-white",
    accentSubtle: "bg-accent-light text-accent-hover border border-accent/20",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    successFilled: "bg-emerald-600 text-white",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    neutral: "bg-bg text-muted border border-border",
    white: "bg-white/95 text-primary shadow-sm backdrop-blur-sm",
  };

  const sizeStyles = {
    xs: "text-[11px] px-2 py-0.5 rounded-md gap-1",
    sm: "text-xs px-2.5 py-1 rounded-full gap-1.5",
    md: "text-sm px-3 py-1.5 rounded-full gap-2",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.neutral} ${
        sizeStyles[size] || sizeStyles.sm
      } ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;

