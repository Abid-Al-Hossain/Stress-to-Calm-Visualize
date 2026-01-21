"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface BreathingButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function BreathingButton({
  href,
  onClick,
  children,
  className = "",
  variant = "primary",
}: BreathingButtonProps) {
  // The "Watery Smooth" Config
  // Using a very slow, highly damped spring or a loose sine wave
  const breatheAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 4,
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  };

  const MotionLink = motion.create(Link);

  const commonProps = {
    className: `btn btn-${variant} ${className}`,
    onClick: onClick,
    animate: variant === "primary" ? breatheAnimation : {},
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95, y: 0 },
    style: {
      willChange: "transform",
      backfaceVisibility: "hidden" as const, // Fix type error here too
    },
  };

  if (href) {
    return (
      <MotionLink href={href} {...commonProps}>
        {children}
      </MotionLink>
    );
  }

  return <motion.button {...commonProps}>{children}</motion.button>;
}
