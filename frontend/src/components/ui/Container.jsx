import React from "react";

export function Container({
  children,
  className = "",
  size = "default", // 'default' | 'narrow' | 'wide'
  ...props
}) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1400px]",
  };

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${sizeClasses[size] || sizeClasses.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;

