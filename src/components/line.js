import React, { useEffect } from 'react'
import * as d3 from "d3";
import "./line.css"

export default function Line() {
    useEffect(() => {
        draw()
    }, [])

    const draw = async () => {
        const dataset = await d3.json("/data/my_weather_data.json")

        const dateParser = d3.timeParse("%Y-%m-%d")
        const yAccessor = d => d.temperatureMax
        const xAccessor = d => dateParser(d.date)

        let dimensions = {
            width: window.innerWidth * 0.9,
            height: 400,
            margin: {
                top: 15,
                right: 15,
                bottom: 40,
                left: 60,
            },
        }

        dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
        dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
      
        const wrapper = d3.select(".wrapper")
            .append("svg")
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)

        let bounds = wrapper.append("g")
            .attr("transform", `translate(${
                dimensions.margin.left
            }, ${
                dimensions.margin.top
            })`)

        const yScale = d3.scaleLinear()
            .domain(d3.extent(dataset, yAccessor))
            .range([dimensions.boundedHeight, 0])

        const xScale = d3.scaleTime()
            .domain(d3.extent(dataset, xAccessor))
            .range([0, dimensions.boundedWidth])

        const freezingTemperaturePlacement = yScale(32)
        const freezingTemperatures = bounds.append("rect")
            .attr("class", "freezing")
            .attr("x", 0)
            .attr("width", d3.max([0, dimensions.boundedWidth]))
            .attr("y", freezingTemperaturePlacement)
            .attr("height", d3.max([0, dimensions.boundedHeight - freezingTemperaturePlacement]))
        
        const lineGenerator = d3.line()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(yAccessor(d)))

        const line = bounds.append("path").attr("class", "line").attr("d", lineGenerator(dataset))
    
        const yAxisGenerator = d3.axisLeft()
            .scale(yScale)

        const yAxis = bounds.append("g")
            .attr("class", "y-axis")
            .call(yAxisGenerator)

        const yAxisLabel = yAxis.append("text")
            .attr("class", "y-axis-label")
            .attr("x", -dimensions.boundedHeight / 2)
            .attr("y", -dimensions.margin.left + 22)
            .html("Minimum Temperature (&deg;F)")

        const xAxisGenerator = d3.axisBottom().scale(xScale)
        
        const xAxis = bounds.append("g")
            .attr("class", "x-axis")
            .style("transform", `translateY(${dimensions.boundedHeight}px)`)
            .call(xAxisGenerator)

        // Set up interactions
        const listeningRect = bounds.append("rect")
            .attr("class", "listening-rect")
            .attr("width", dimensions.boundedWidth)
            .attr("height", dimensions.boundedHeight)
            .on("mousemove", onMouseMove)
            .on("mouseleave", onMouseLeave)

        const tooltip = d3.select("#tooltip")

        function onMouseMove(event, d) {
            const mousePosition = d3.pointer(event)
            const hoveredDate = xScale.invert(mousePosition[0])
            console.log(hoveredDate)
            tooltip.style("opacity", 1)

            const getDistanceFromHoveredDate = d => (
                Math.abs(xAccessor(d) - hoveredDate)
            )

            const closestIndex = d3.leastIndex(
                dataset,
                (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
            )
            
            const closestDataPoint = dataset[closestIndex]
            const formatDate = d3.timeFormat("%B %A %-d %Y")
            tooltip.select("#date")
                .text(formatDate(xAccessor(closestDataPoint)))

            const formatTemperature = d => `${d3.format(".1f")(d)} degrees Farenheight`
            tooltip.select("#temperature")
                .text(formatTemperature(yAccessor(closestDataPoint)))
        
            const x = xScale(xAccessor(closestDataPoint))
                + dimensions.margin.left

            const y = yScale(yAccessor(closestDataPoint))
                + dimensions.margin.top

            tooltip.style("transform", `translate(calc(-50% + ${x}px), calc(-100% + ${y}px))`)
        }

        function onMouseLeave() {
            tooltip.style("opacity", 0)
        }
    }
    return (
        <div className="wrapper">
            <div id="tooltip" className="tooltip">
                <div className="tooltip-date">
                    <span id="date"></span>
                </div>

                <div className="tooltip-temperature">
                    Maximum Temperature: <span id="temperature"></span>
                </div>
            </div>
        </div>
    )
}
