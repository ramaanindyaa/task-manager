"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  once?: boolean;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  y = 18,
  amount = 0.22,
  once = true,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, ease: [0.2, 0.75, 0.2, 1], delay }}
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}
