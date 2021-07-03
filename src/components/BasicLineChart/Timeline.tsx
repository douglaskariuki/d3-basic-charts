import { Drawer } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";


function LineChart(props: IBasicLineChartProps) {
    useEffect(() => {
        draw()
    }, [])

    async function draw() {
        const dataset = await d3.json("/data/my_weather_data.json")
        console.log(dataset)

        const yAccessor = d => d.temperatureMax
        const dateParser = d3.timeParse("%Y-%m-%d")
        const xAccessor = d => dateParser(d.date)

        const width = props.width - props.left - props.right
        const height = props.height - props.top - props.bottom

        const wrapper = d3.select(".lineChart")
            .append("svg")
                .attr("width", width + props.left + props.right)
                .attr("height", height + props.top + props.bottom)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${props.left}px, ${props.top}px)`)

        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(dataset, yAccessor))
            .range([height, 0])

        const freezingTemperaturePlacement = yScale(32)
        const freezingTemperatures = bounds
            .append("rect")
            .attr("x", 0)
            .attr("width", width)
            .attr("y", freezingTemperaturePlacement)
            .attr("height", height - freezingTemperaturePlacement)
            .attr("fill", "#e0f3f3")

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(dataset, xAccessor))
            .range([0, width])

        const lineGenerator = d3.line()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(yAccessor(d)))

        const line = bounds.append("path")
            .attr("d", lineGenerator(dataset))
            .attr("fill", "none")
            .attr("stroke", props.fill)
            .attr("stroke-width", 2)

        const yAxisGenerator = d3.axisLeft()
            .scale(yScale)

        const yAxis = bounds.append("g")
            .call(yAxisGenerator)

        const xAxisGenerator = d3.axisBottom()
            .scale(xScale)

        const xAxis = bounds.append("g")
            .call(xAxisGenerator)
                .style("transform", `translateY(${height}px)`)

    }

    return <div className="lineChart"></div>
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

export default LineChart;