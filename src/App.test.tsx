// src/App.test.tsx
import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import HelloD3 from "./components/HelloD3/HelloD3";

describe('<App />', () => {
  let component

  beforeEach(() => {
    component = shallow(<App />)
  })
  test('It should mount', () => {
    expect(component.length).toBe(1)
  })
})

test('should render HelloD3', () => {
  const wrapper = shallow(<App />);
  const hellod3 = wrapper.find(HelloD3);
  expect(hellod3.exists()).toBe(true);
})
