import React, { useEffect } from 'react';
import './BasicLineChart.scss';
import * as d3 from 'd3';
import { Types } from './types';

const BasicLineChart = (props: IBasicLineChartProps) => {
    useEffect(() => {
        draw()
    })

    const draw = () => {
        // set dimensions and margins for the chart
        const width = props.width - props.left - props.right
        const height = props.height - props.top - props.bottom

        const svg = d3
            .select(".basicLineChart")
            .append("svg")
            .attr('width', width + props.left + props.right)
            .attr('height', height + props.top + props.bottom)
            .append("g")
            .attr("transform", `translate(${props.left},${props.top})`)

        // retrieve the CSV data
        d3.dsv(',', '/data/line.csv', (d) => {
            const res = (d as unknown) as Types.Data //once retrieved, cast the obj as Types.Data
            // console.log(res)
            const date = d3.timeParse('%Y-%m-%d')(res.date); // convert string into D3 Date object
            const value = res.value;
            console.log(value)
            return {
                date,
                value
            }
        }).then((data) => {
            const y = d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(data, (d) => {
                        // console.log(data)
                        return Math.max(...data.map((dt) => ((dt as unknown) as Types.Data).value), 0)
                    }
                )] as number[])
                .range([height, 0])
            
            svg.append("g").call(d3.axisLeft(y))

            const x = d3 // add the x-axis, date
                .scaleTime()
                .domain(
                    d3.extent(data, (d) => {
                        return d.date
                    }) as [Date, Date]
                )
                .range([0, width])

            svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x)) // running the axisBottom func on the newly created and appended group

            // draw the line

            svg
                .append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", props.fill)
                .attr("stroke-width", 2)
                .attr(
                    "d",
                    // @ts-ignore
                    d3
                        .line()
                        .x((d) => {
                            return x(((d as unknown) as { date: number }).date)
                        })
                        .y((d) => {
                            return y(((d as unknown) as Types.Data).value)
                        })
                )
        })

    }
    return <div className="basicLineChart" />
}

interface IBasicLineChartProps {
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number
    fill: string
}

export default BasicLineChart;
