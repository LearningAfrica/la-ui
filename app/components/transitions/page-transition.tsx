import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const pageVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
  },
  slideRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  scaleCenter: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

type ComponentTransitionProps = {
  children: React.ReactNode;
  variant?: keyof typeof pageVariants;
  duration?: number;
  className?: string;
  mode?: "wait" | "sync" | "popLayout";
};

export default function ComponentTransition({
  children,
  variant = "fade",
  duration = 0.3,
  className,
  mode = "sync",
}: ComponentTransitionProps) {
  return (
    <AnimatePresence mode={mode}>
      <motion.div
        variants={pageVariants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration, ease: "easeInOut" }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
