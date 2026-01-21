"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { useCalmSound } from "@/hooks/useCalmSound";
import CalmRipple from "./CalmRipple";

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

  // Sound Hooks
  const { playClick, playHover } = useCalmSound();
  const MotionLink = motion.create(Link);

  const commonProps = {
    className: `btn btn-${variant} ${className}`,
    onClick: (e: any) => {
      playClick();
      if (onClick) onClick();
    },
    onMouseEnter: () => playHover(),
    animate: variant === "primary" ? breatheAnimation : {},
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95, y: 0 },
    style: {
      willChange: "transform",
      backfaceVisibility: "hidden" as const,
      position: "relative" as const,
      overflow: "hidden" as const,
    },
  };

  if (href) {
    return (
      <MotionLink href={href} {...commonProps}>
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
        <CalmRipple />
      </MotionLink>
    );
  }

  return (
    <motion.button {...commonProps}>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      <CalmRipple />
    </motion.button>
  );
}
