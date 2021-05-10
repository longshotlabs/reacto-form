import { ChangeEvent } from 'react'

import { GetInputPropsOptions } from './types'

const inputOptions: GetInputPropsOptions = {
  nullValue: false,
  onChangeGetValue: (event: ChangeEvent<HTMLInputElement>) => event.target.checked ?? false,
  propNames: {
    errors: false,
    hasBeenValidated: false,
    isReadOnly: 'disabled',
    onChanging: false,
    onSubmit: false,
    value: 'checked'
  }
}

export default inputOptions
