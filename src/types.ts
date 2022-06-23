export interface ErrorOptions {
  includeDescendantErrors?: boolean
}

export interface InputPropNameMap {
  errors: string | false
  hasBeenValidated: string | false
  isReadOnly: string | false
  name: string | false
  onChange: string | false
  onChanging: string | false
  onSubmit: string | false
  value: string | false
  [prop: string]: string | false
}

export interface GetInputPropsOptions {
  isForm?: boolean
  nullValue?: any
  onChangeGetValue?: (...args: any[]) => any
  onChangingGetValue?: (...args: any[]) => any
  onApplyChangeToForm?: (formData: FormData, fieldValue: any, fieldPath: string) => FormData,
  propNames?: Partial<InputPropNameMap>
}

export interface ValidationError {
  message: string
  name: string
}

export type ValidationTrigger = 'changing' | 'changed' | 'submit'
export type FormData = Record<string, any>

export interface FormSubmissionResult {
  errors?: ValidationError[]
  ok?: boolean
}

// eslint-disable-next-line
export type OnSubmitResult = FormSubmissionResult | void | Promise<FormSubmissionResult> | Promise<void>

export interface UseReactoFormProps {
  hasBeenValidated?: boolean
  isReadOnly?: boolean | ((formData: FormData) => boolean)
  logErrorsOnSubmit?: boolean
  onChange?: (formData: FormData, isValid: boolean) => void
  onChanging?: (formData: FormData, isValid: boolean) => void
  onSubmit?: (formData: FormData, isValid: boolean) => OnSubmitResult
  revalidateOn?: ValidationTrigger
  shouldSubmitWhenInvalid?: boolean
  validateOn?: ValidationTrigger
  validator?: (formData: FormData) => Promise<ValidationError[]> | ValidationError[]
  value?: FormData
}

export interface UseReactoFormState {
  formData: FormData
  getErrors: (fieldPaths: string[], options?: ErrorOptions) => ValidationError[]
  getFirstError: (fieldPaths: string[], options?: ErrorOptions) => ValidationError | null
  getFirstErrorMessage: (fieldPaths: string[], options?: ErrorOptions) => string | null
  getInputProps: (fieldPath: string, options?: GetInputPropsOptions) => Record<string, any>
  hasBeenValidated: boolean
  hasErrors: (fieldPaths: string[], options?: ErrorOptions) => boolean
  isDirty: boolean
  resetValue: () => void
  submitForm: () => void
}
