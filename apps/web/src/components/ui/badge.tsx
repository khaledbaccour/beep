import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#141418]/20 bg-transparent text-[#141418]',
        brand: 'border-[#FFB088]/40 bg-[#FFB088]/10 text-[#141418]',
        success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
        warning: 'border-amber-300 bg-amber-50 text-amber-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
