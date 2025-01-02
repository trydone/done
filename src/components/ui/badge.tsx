import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center text-nowrap rounded-[6px] border px-1.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        yellow:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        red: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        green:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        indigo:
          'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        blue: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        purple:
          'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        pink: 'border-transparent bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        orange:
          'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        accentBlack:
          'border-transparent bg-black text-white dark:bg-white dark:text-black',
        accentGreen:
          'border-transparent bg-green-800 text-white dark:bg-green-100 dark:text-black',
        accentRed:
          'border-transparent bg-red-800 text-white dark:bg-red-100 dark:text-black',
        accentBlue:
          'border-transparent bg-blue-800 text-white dark:bg-blue-100 dark:text-black',
        accentYellow:
          'border-transparent bg-yellow-800 text-white dark:bg-yellow-100 dark:text-black',
        accentIndigo:
          'border-transparent bg-indigo-800 text-white dark:bg-indigo-100 dark:text-black',
        accentPurple:
          'border-transparent bg-purple-800 text-white dark:bg-purple-100 dark:text-black',
        accentPink:
          'border-transparent bg-pink-800 text-white dark:bg-pink-100 dark:text-black',
        pro: 'border-transparent bg-yellow-500 text-white dark:border-transparent dark:bg-yellow-500 dark:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
