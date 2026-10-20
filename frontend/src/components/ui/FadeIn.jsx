"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reusable animation wrapper component using IntersectionObserver.
 * Fades in and slides content into view as the user scrolls.
 * Respects `prefers-reduced-motion`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.delay=0] - Delay in milliseconds
 * @param {'up'|'down'|'left'|'right'|'none'} [props.direction='up'] - Slide direction
 * @param {boolean} [props.once=true] - Trigger once or every time entering viewport
 * @param {number} [props.duration=500] - Duration in milliseconds (400-600ms recommended)
 * @param {string} [props.className='']
 */
export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  once = true,
  duration = 500,
  className = "",
  ...rest
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Check user's motion preferences
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) {
        setIsVisible(true);
        return;
      }
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [once]);

  // Compute translation offsets based on direction
  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "up":
        return "translate3d(0, 24px, 0)";
      case "down":
        return "translate3d(0, -24px, 0)";
      case "left":
        return "translate3d(24px, 0, 0)";
      case "right":
        return "translate3d(-24px, 0, 0)";
      case "none":
      default:
        return "none";
    }
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={elementRef} style={style} className={className} {...rest}>
      {children}
    </div>
  );
}

export default FadeIn;

