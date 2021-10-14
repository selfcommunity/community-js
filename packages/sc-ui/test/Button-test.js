import { mount } from 'enzyme'
import React from 'react'
import Button from '../src/Button'

describe('Combobox', function () {
  it('should respect button layout and disabled props', function () {
    mount(
      <Button label={'Click'}/>,
    )
      .find('input')
      .contains('disabled')
  })
})
