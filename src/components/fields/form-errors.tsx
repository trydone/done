import {useMemo} from 'react'
import {FieldErrors} from 'react-hook-form'

import {Alert, AlertDescription, AlertTitle} from '../ui/alert'

type Props = {
  className?: string
  errors: FieldErrors<any>
}

const renderError = (key: string, error: any, prefix = '') => {
  // Handle nested array of errors
  if (Array.isArray(error)) {
    return error.map((e, index) => (
      <div key={`${prefix}${key}-${index}`}>
        {Object.entries(e).map(([nestedKey, nestedError]) =>
          renderError(nestedKey, nestedError, `${prefix}${key}[${index}].`),
        )}
      </div>
    ))
  }

  // Handle single error
  return (
    <li key={`${prefix}${key}`}>
      {prefix}
      {key}: {String(error?.message)}
    </li>
  )
}

export const FormErrors = ({className, errors}: Props) => {
  const errorEntries = useMemo(() => Object.entries(errors), [errors])

  if (errorEntries.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Errors</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {errorEntries.map(([key, error]) => renderError(key, error))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
