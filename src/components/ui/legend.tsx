import { sentenceCase } from 'change-case'
import React from 'react'

import {
  colorPalette,
  getColorClassNames,
} from '@/components/chart/chart-utils'
import { Color } from '@/components/chart/input-type'
import { cn } from '@/lib/utils/cn'

export interface LegendItemProps {
  name: string
  color: Color
}

const LegendItem = ({ name, color }: LegendItemProps) => (
  <li className="mr-4 inline-flex items-center truncate text-gray-700">
    <svg
      className={cn(
        'mr-2 size-4 flex-none',
        getColorClassNames(color, colorPalette.text).textColor,
      )}
      fill="currentColor"
      viewBox="0 0 8 8"
    >
      <circle cx={4} cy={4} r={4} />
    </svg>
    <p className="truncate whitespace-nowrap text-muted-foreground/80">
      {sentenceCase(name)}
    </p>
  </li>
)

export interface LegendProps extends React.OlHTMLAttributes<HTMLOListElement> {
  categories: string[]
  colors?: Color[]
}

export const Legend = React.forwardRef<HTMLOListElement, LegendProps>(
  (props, ref) => {
    const { categories, colors = [], className, ...other } = props
    return (
      <ol
        ref={ref}
        className={`flex flex-wrap overflow-hidden truncate ${className}`}
        {...other}
      >
        {categories.map((category, idx) => (
          <LegendItem key={`item-${idx}`} name={category} color={colors[idx]} />
        ))}
      </ol>
    )
  },
)
