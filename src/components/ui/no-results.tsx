import {ReactNode} from 'react'

type Props = {
  dataSetLength: number
  resultsLength: number
  children?: ReactNode
}

export const NoResults = ({dataSetLength, resultsLength, children}: Props) => {
  if (dataSetLength === 0 || resultsLength === 0) {
    return children ? (
      <div>{children}</div>
    ) : (
      <p className="text-center text-muted-foreground">No results found</p>
    )
  }

  return null
}
