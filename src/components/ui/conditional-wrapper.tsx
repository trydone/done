import { ReactElement, ReactNode } from 'react'

type Props = {
  condition: boolean
  wrapper: (children: ReactNode) => ReactElement
  children: ReactElement
}
export const ConditionalWrapper = ({ condition, wrapper, children }: Props) =>
  condition ? wrapper(children) : children
