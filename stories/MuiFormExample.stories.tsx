import { Meta, Story } from '@storybook/react'
import React from 'react'

import MuiFormExample from './MuiFormExample'

const meta: Meta = {
  title: 'Examples/Material UI',
  component: MuiFormExample
}
export default meta

const Template: Story = (args) => <MuiFormExample {...args} />

export const Insert = Template.bind({})
Insert.args = {}

export const Update = Template.bind({})
Update.args = {
  onSubmit (formData: FormData) {
    alert(`Submitted: ${JSON.stringify(formData)}`)
  },
  value: {
    firstName: 'Buzz',
    lastName: 'Lightyear',
    isMarried: true
  }
}
