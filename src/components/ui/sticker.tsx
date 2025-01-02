import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const stickerVariants = cva(
  'inline-flex items-center rounded-[12px] px-[35px] py-2.5 text-[24px] font-bold leading-none tracking-tight text-white shadow-[0px_10px_20px_0px_rgba(0,0,0,0.15)] ring-4 ring-[rgba(255,255,255,0.5)]',
  {
    variants: {
      variant: {
        default: 'rotate-[-3.21deg] bg-primary',
        purple: 'rotate-[-3.21deg] bg-[#8B52F8]',
        blue: 'rotate-[-1.5deg] bg-[#60A5FA]',
        yellow: '-rotate-2 bg-[#FACC0B]',
        green: 'rotate-[2.352deg] bg-[#4ADE80]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface StickerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stickerVariants> {}

function Sticker({ className, variant, ...props }: StickerProps) {
  return (
    <div className={cn(stickerVariants({ variant }), className)} {...props} />
  )
}

export { Sticker, stickerVariants }
