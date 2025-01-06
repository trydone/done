import {ControllerFieldState, useFormState} from 'react-hook-form'

/*
    setError doesn't "touch" fields. So when we set errors manually after form submission
    we need to check the submit count: https://github.com/react-hook-form/react-hook-form/issues/1418
*/
export const useErrorState = (
  fieldState: ControllerFieldState,
  control: any,
) => {
  const {submitCount} = useFormState({control})
  const isTouchedOrSubmitted = fieldState.isTouched || submitCount > 0
  return !!(isTouchedOrSubmitted && fieldState.error)
}
