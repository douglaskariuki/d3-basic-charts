import React, { useEffect } from 'react';
import * as d3 from "d3";

export default function Histogram(props: IBasicScatterChartProps) {
    useEffect(() => {
      draw()  
    }, [])

    const width = 600

    let dimensions = {
        width,
        height: width * 0.6,
        margin: {
            top: 60,
            right: 10,
            bottom: 50,
            left: 50
        },
    }

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right

    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    async function draw() {
        const dataset = await d3.json("/data/my_weather_data.json")

        const metricAccessor = d => d.humidity
        const yAccesssor = d => d.length

        const wrapper = d3.select(".wrapper")
            .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, metricAccessor))
            .range([0, dimensions.boundedWidth])
            .nice()

        const binsGenerator = d3.histogram()
            .domain(xScale.domain())
            .value(metricAccessor)
            .thresholds(12) // No. of bins = No. of thresholds +1
            
        const bins = binsGenerator(dataset)

        console.log("bins", bins)

        const yAcccessor = d => yAccesssor(d) !== 0

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, yAccesssor)])
            .range([dimensions.boundedHeight, 0])
            .nice()

        console.log("yScale", yScale)

        const binsGroup = bounds.append("g")

        const binGroups = binsGroup.selectAll("g")
            .data(bins)
            .enter()
            .append("g")


        const barPadding = 1

        const barRects = binGroups.append("rect")
            .attr("x", d => xScale(d.x0) + barPadding / 2) // bar will start at the lower bound of the bin, xScale will convert it to humidity levels to pixel space
            .attr("y", d => yScale(yAccesssor(d)))
            .attr("width", d => d3.max([
                0, xScale(d.x1) - xScale(d.x0) - barPadding
            ]))
            .attr("height", d => dimensions.boundedHeight
                - yScale(yAccesssor(d))
            )
            .attr("fill", "cornflowerblue")

        // const barText = binsGroup.filter(yAccesssor)
        //     .append("text")
        //         .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        //         .attr("y", d => yScale(yAccesssor(d)) - 5)
        //         .text(yAccesssor)
        //         .style("text-anchor", "middle")
        //         .attr("fill", "darkgrey")
        //         .style("font-size", "12px")
        //         .style("font-family", "sans-serif")

        const mean = d3.mean(dataset, metricAccessor)

        const meanLine = bounds.append("line")
            .attr("x1", xScale(mean))
            .attr("x2", xScale(mean))
            .attr("y1", -15)
            .attr("y2", dimensions.boundedHeight)
            .attr("stroke", "white")
            .attr("stroke-dasharray", "10px 5px")

        const meanLabel = bounds.append("text")
            .attr("x", xScale(mean))
            .attr("y", -20)
            .text("mean")
            .attr("fill", "white")
            .style("font-size", "12px")
            .style("text-anchor", "middle")

        const xAxisGenerator = d3.axisBottom()
            .scale(xScale)

        const xAxis = bounds.append("g")
            .call(xAxisGenerator)
                .style("transform", `translateY(${dimensions.boundedHeight}px)`)

        const xAxisLabel = xAxis.append("text")
            .attr("x", dimensions.boundedWidth / 2)
            .attr("y", dimensions.margin.bottom - 10)
            .attr("fill", "white")
            .style("font-size", "1.4em")
            .text("Humidity")
    }
    
    return (
        <div className="wrapper">
            
        </div>
    )
}

interface IBasicScatterChartProps {
    top: number
    right: number
    bottom: number
    left: number
}