import React from 'react'
import { shallow } from 'enzyme'
import HelloSVG from './HelloSVG'

describe('<HelloSVG />', () => {
  let component

  beforeEach(() => {
    component = shallow(<HelloSVG />)
  });

  test('It should mount', () => {
    expect(component.length).toBe(1)
  })
})
