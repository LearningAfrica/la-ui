import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const tabVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  slideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

type TabTransitionProps = {
  children: React.ReactNode;
  variant?: keyof typeof tabVariants;
  duration?: number;
  className?: string;
  mode?: "wait" | "sync" | "popLayout";
};

export default function TabTransition({
  children,
  variant = "fade",
  duration = 0.2,
  className,
  mode = "wait",
}: TabTransitionProps) {
  return (
    <AnimatePresence mode={mode}>
      <motion.div
        variants={tabVariants[variant]}
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
