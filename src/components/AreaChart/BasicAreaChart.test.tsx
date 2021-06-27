import React from 'react'
import { shallow } from 'enzyme'
import AreaChart from './BasicAreaChart'

describe('<BasicLineChart />', () => {
    let component

    beforeEach(() => {
        component = shallow(<AreaChart top={10} right={50} bottom={50} left={50} width={460} height={400} fill="tomato" />)
    })

    test('It should mount', () => {
        expect(component.length).toBe(1)
    })
})