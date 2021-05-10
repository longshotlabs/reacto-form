import { ChangeEvent } from 'react'

import { GetInputPropsOptions } from './types'

const inputOptions: GetInputPropsOptions = {
  nullValue: '',
  onChangeGetValue: (event: ChangeEvent<HTMLInputElement>) => event.target.value,
  onChangingGetValue: (event: ChangeEvent<HTMLInputElement>) => event.target.value,
  propNames: {
    errors: false,
    hasBeenValidated: false,
    isReadOnly: 'disabled',
    onChange: 'onBlur',
    onChanging: 'onChange',
    onSubmit: false
  }
}

export default inputOptions
