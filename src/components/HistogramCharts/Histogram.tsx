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

        const binsGenerator = d3.bin()
            .domain(xScale.domain())
            .value(metricAccessor)
            .thresholds(12) // No. of bins = No. of thresholds +1
            
        const bins = binsGenerator(dataset)

        console.log("bins", bins)

        const yAccessor = d => d.length

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, yAccessor)])
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
            .attr("x", d => xScale(d.x0) + barPadding / 2) // bar will start at the lower bound of the bin
            .attr("y", d => yScale(yAccessor(d)))
            .attr("width", d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
            .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
            .attr("fill", "cornflowerblue")

        const barText = binsGroup.filter(yAccessor)
            .append("text")
                .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
                .attr("y", d => yScale(yAccessor(d)) - 5)
                .text(yAccessor)
                .style("text-anchor", "middle")
                .attr("fill", "darkgrey")
                .style("font-size", "12px")
                .style("font-family", "sans-serif")
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