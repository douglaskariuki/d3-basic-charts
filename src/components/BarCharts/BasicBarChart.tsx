import React, { useEffect } from 'react'
import * as d3 from 'd3'
import { Types } from './types'

const BarChart = (props: IBasicBarChartProps) => {
    useEffect(() => {
        draw()
    })

    const draw = () => {
        // set dimensions & margins
        const width = props.width - props.left - props.right
        const height = props.height - props.top - props.bottom

        // draw the x,y ranges
        const x = d3.scaleBand().range([0, width]).padding(0.1)
        const y = d3.scaleLinear().range([height, 0])

        const svg = d3
            .select('.barChart')
            .append('svg')
            .attr('width', width + props.left + props.right)
            .attr('height', height + props.top + props.bottom)
            .append('g')
            .attr('transform', `translate(${props.left},${props.top})`)

            d3.dsv(',', '/Data/bar.csv', (d) => {
            return (d as unknown) as Types.Data
        }).then((data) => {
            // Scale the range of the Data in the domains
            x.domain(
                data.map((d) => {
                return d.framework
            }))
            y.domain([
                0,
                d3.max(data, (d) => {
                return Math.max(...data.map((dt) => (dt as Types.Data).value), 0)
            }), ] as number[])

        svg
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('fill', props.fill)
            .attr('class', 'bar')
            .attr('x', (d) => {
            return x(d.framework) || 0
        })
        // bandWidth return the width of each rectangle that makes the chart
            .attr('width', x.bandwidth())
            .attr('y', (d) => {
            return y(d.value)
        })
        // for height, height of the bounds of the chart less the value to create the bin height value
            .attr('height', (d) => {
            return height - y(d.value)
        })

        // add the x Axis
        svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

        // add the y Axis
        svg.append('g').call(d3.axisLeft(y))
        })

    }

    return <div className='barChart'></div>
}

interface IBasicBarChartProps {
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number
    fill: string
}

export default BarChart;

