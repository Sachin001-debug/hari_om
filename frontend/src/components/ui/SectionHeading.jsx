import React from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left", // 'left' | 'center'
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-8 sm:mb-12 ${
        isCenter ? "text-center mx-auto max-w-2xl" : "max-w-3xl"
      } ${className}`}
    >
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-accent-light text-accent-hover ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {eyebrow}
        </div>
      )}

      {title && (
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary tracking-tight leading-tight">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;

