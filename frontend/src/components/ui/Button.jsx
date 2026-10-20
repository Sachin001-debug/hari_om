import React from "react";
import Link from "next/link";

/**
 * Reusable Button component respecting the theme palette.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  onClick,
  type = "button",
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md focus-visible:ring-primary",
    accent:
      "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-md focus-visible:ring-accent",
    outline:
      "border border-border bg-surface text-text hover:bg-bg hover:border-muted/40 shadow-sm focus-visible:ring-primary",
    ghost:
      "text-text hover:bg-bg/80 focus-visible:ring-primary",
    secondary:
      "bg-primary-light/10 text-primary hover:bg-primary-light/20 focus-visible:ring-primary",
    accentLight:
      "bg-accent-light text-accent-hover hover:bg-accent-light/80 focus-visible:ring-accent",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 rounded-xl font-semibold",
  };

  const classes = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
    sizeStyles[size] || sizeStyles.md
  } ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;

