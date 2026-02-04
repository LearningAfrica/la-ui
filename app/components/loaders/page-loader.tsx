import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva("", {
  variants: {
    variant: {
      spinner:
        "border-4 border-primary/30 border-t-primary rounded-full animate-spin",
      dots: "flex items-center justify-center gap-2",
      pulse: "flex items-center justify-center gap-2",
      bars: "flex items-center justify-center gap-1",
      card: "space-y-3",
      skeleton: "animate-pulse",
    },
    size: {
      xs: "",
      sm: "",
      default: "",
      lg: "",
      xl: "",
    },
  },
  defaultVariants: {
    variant: "spinner",
    size: "default",
  },
});

const sizeMap = {
  spinner: {
    xs: "size-4",
    sm: "size-6",
    default: "size-8",
    lg: "size-12",
    xl: "size-16",
  },
  dots: {
    xs: "size-1.5",
    sm: "size-2",
    default: "size-3",
    lg: "size-4",
    xl: "size-5",
  },
  pulse: {
    xs: "size-2",
    sm: "size-3",
    default: "size-4",
    lg: "size-5",
    xl: "size-6",
  },
  bars: {
    xs: "w-0.5 h-4",
    sm: "w-1 h-6",
    default: "w-1.5 h-8",
    lg: "w-2 h-12",
    xl: "w-2.5 h-16",
  },
};

type LoaderProps = {
  className?: string;
  text?: string;
  children?: React.ReactNode;
  fullPage?: boolean;
} & VariantProps<typeof loaderVariants>;

function SpinnerLoader({ size = "default", className }: LoaderProps) {
  return (
    <div
      className={cn(
        loaderVariants({ variant: "spinner" }),
        sizeMap.spinner[size as keyof typeof sizeMap.spinner],
        className
      )}
    />
  );
}

function DotsLoader({ size = "default", className }: LoaderProps) {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-8, 0, -8],
    },
  };

  return (
    <div className={cn(loaderVariants({ variant: "dots" }), className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            delay: i * 0.1,
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "bg-primary rounded-full",
            sizeMap.dots[size as keyof typeof sizeMap.dots]
          )}
        />
      ))}
    </div>
  );
}

function PulseLoader({ size = "default", className }: LoaderProps) {
  const pulseVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [0.8, 1, 0.8],
      opacity: [0.5, 1, 0.5],
    },
  };

  return (
    <div className={cn(loaderVariants({ variant: "pulse" }), className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          transition={{
            delay: i * 0.2,
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "bg-primary rounded-full",
            sizeMap.pulse[size as keyof typeof sizeMap.pulse]
          )}
        />
      ))}
    </div>
  );
}

function BarsLoader({ size = "default", className }: LoaderProps) {
  const barVariants = {
    initial: { scaleY: 0.3 },
    animate: {
      scaleY: [0.3, 1, 0.3],
    },
  };

  return (
    <div className={cn(loaderVariants({ variant: "bars" }), className)}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          variants={barVariants}
          initial="initial"
          animate="animate"
          transition={{
            delay: i * 0.1,
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "bg-primary origin-bottom rounded-sm",
            sizeMap.bars[size as keyof typeof sizeMap.bars]
          )}
        />
      ))}
    </div>
  );
}

function CardLoader({ className }: LoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        loaderVariants({ variant: "card" }),
        "bg-background rounded-lg border p-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="bg-muted size-12 animate-pulse rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
          <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="bg-muted h-3 animate-pulse rounded" />
        <div className="bg-muted h-3 w-5/6 animate-pulse rounded" />
        <div className="bg-muted h-3 w-4/6 animate-pulse rounded" />
      </div>
    </motion.div>
  );
}

function SkeletonLoader({ className }: LoaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="bg-muted h-4 animate-pulse rounded" />
      <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
      <div className="bg-muted h-4 w-4/6 animate-pulse rounded" />
    </div>
  );
}

export default function Loader({
  variant = "spinner",
  size = "default",
  className,
  text,
  children,
  fullPage = false,
}: LoaderProps) {
  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return <SpinnerLoader size={size} className={className} />;
      case "dots":
        return <DotsLoader size={size} className={className} />;
      case "pulse":
        return <PulseLoader size={size} className={className} />;
      case "bars":
        return <BarsLoader size={size} className={className} />;
      case "card":
        return <CardLoader className={className} />;
      case "skeleton":
        return <SkeletonLoader className={className} />;
      default:
        return <SpinnerLoader size={size} className={className} />;
    }
  };

  const content = children || text;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullPage &&
          "bg-background/80 fixed inset-0 z-50 min-h-screen w-full backdrop-blur-sm"
      )}
    >
      {renderLoader()}
      {content && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center text-sm"
        >
          {content}
        </motion.div>
      )}
    </div>
  );
}

export {
  SpinnerLoader,
  DotsLoader,
  PulseLoader,
  BarsLoader,
  CardLoader,
  SkeletonLoader,
};
