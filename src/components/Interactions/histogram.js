import React, {useEffect} from 'react'
import * as d3 from "d3";
import "./style.css";

export default function Histogram() {
    useEffect(() => {
        draw()
    }, [])

    async function draw() {
        const dataset = await d3.json("/data/my_weather_data.json")

        const width = 600
        let dimensions = {
            width,
            height: width * 0.6,
            margin: {
                top: 30,
                right: 10,
                bottom: 50,
                left: 50,
            }
        }
        dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
        dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    
        const wrapper = d3.select(".wrapper")
            .append("svg")
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

        // init static elements
        bounds.append("g")
            .attr("class", "bins")

        bounds.append("line")
            .attr("class", "mean")

        bounds.append("g")
            .attr("class", "x-axis")
            .style("transform", `translateY(${dimensions.boundedHeight}px)`)
            .append("text")
            .attr("class", "x-axis-label")

        const metricAccessor = d => d.humidity
        const yAccessor = d => d.length

        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, metricAccessor))
            .range([0, dimensions.boundedWidth])
            .nice()

        const binsGenerator = d3.bin()
            .domain(xScale.domain())
            .value(metricAccessor)
            .thresholds(12)

        const bins = binsGenerator(dataset)

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, yAccessor)])
            .range([dimensions.boundedHeight, 0])
            .nice()

        const barPadding = 1

        let binGroups = bounds.select(".bins")
            .selectAll(".bin")
            .data(bins)

        binGroups.exit().remove()

        const newBinGroups = binGroups.enter().append("g")
            .attr("class", "bin")

        newBinGroups.append("rect")
        newBinGroups.append("text")

        // update binGroups to include new points
        binGroups = newBinGroups.merge(binGroups)

        const barRects = binGroups.select("rect")
            .attr("x", d => xScale(d.x0) + barPadding)
            .attr("y", d => yScale(yAccessor(d)))
            .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
            .attr("width", d => d3.max([
                0,
                xScale(d.x1) - xScale(d.x0) - barPadding
            ]))

        const mean = d3.mean(dataset, metricAccessor)

        const meanLine = bounds.selectAll(".mean")
            .attr("x1", xScale(mean))
            .attr("x2", xScale(mean))
            .attr("y1", -20)
            .attr("y2", dimensions.boundedHeight)

        const xAxisGenerator = d3.axisBottom()
            .scale(xScale)

        const xAxis = bounds.select(".x-axis")
            .call(xAxisGenerator)

        const xAxisLabel = xAxis.select(".x-axis-label")
            .attr("x", dimensions.boundedWidth / 2)
            .attr("y", dimensions.margin.bottom - 10)
            .text("Humidity")

        binGroups.select("rect")
            .on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave)

        const tooltip = d3.select("#tooltip")
        function onMouseEnter(event, d) {
            tooltip.select("#range")
                .text([
                    d.x0,
                    d.x1
                ].join(" - "))
            tooltip.select("#count")
                .text(d.length)

            const x = xScale(d.x0) + barPadding / 2 
                + (xScale(d.x1) - xScale(d.x0)) / 2
                + dimensions.margin.left
            const y = yScale(yAccessor(d)) 
                + dimensions.margin.top

            tooltip.style("opacity", 1)
            tooltip.style("transform", `translate(
                calc(-50% + ${x}px), 
                calc(-100% + ${y}px))`)
            
        }

        function onMouseLeave(event, d) {
            tooltip.style("opacity", 0)
        }
        
    }
    return (
        <div id="wrapper" className="wrapper">
            <div id="tooltip" className="tooltip">
                <div className="tooltip-range">
                    Humidity: <span id="range"></span>
                </div>
                <div className="tooltip-value">
                    <span id="count"></span> days
                </div>
            </div>
        </div>
    )
}
