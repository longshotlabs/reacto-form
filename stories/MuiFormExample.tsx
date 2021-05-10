import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField
} from '@material-ui/core'
import React, { ReactElement } from 'react'
import SimpleSchema from 'simpl-schema'

import { muiCheckboxOptions, muiOptions, useReactoForm } from '../src/index'
import { UseReactoFormProps } from '../src/types'

const formSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 4
  },
  lastName: {
    type: String,
    min: 2
  },
  isMarried: {
    type: Boolean,
    optional: true
  }
})
const validator = formSchema.getFormValidator()

export type MuiFormExampleProps = Pick<
UseReactoFormProps,
| 'hasBeenValidated'
| 'logErrorsOnSubmit'
| 'onChange'
| 'onChanging'
| 'onSubmit'
| 'revalidateOn'
| 'shouldSubmitWhenInvalid'
| 'validateOn'
| 'value'
>

export default function MuiFormExample (
  props: MuiFormExampleProps
): ReactElement {
  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    resetValue,
    submitForm
  } = useReactoForm({
    ...props,
    validator
  })

  return (
    <form noValidate>
      <TextField
        label="First name"
        error={hasErrors(['firstName'])}
        fullWidth
        helperText={getFirstErrorMessage(['firstName'])}
        {...getInputProps('firstName', muiOptions)}
      />
      <TextField
        label="Last name"
        error={hasErrors(['lastName'])}
        fullWidth
        helperText={getFirstErrorMessage(['lastName'])}
        {...getInputProps('lastName', muiOptions)}
      />
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label="Are you married?"
          {...getInputProps('isMarried', muiCheckboxOptions)}
        />
      </FormGroup>
      <Button onClick={resetValue} color="default" variant="outlined">
        Reset
      </Button>
      <Button onClick={submitForm} color="primary" variant="outlined">
        Submit
      </Button>
    </form>
  )
}
