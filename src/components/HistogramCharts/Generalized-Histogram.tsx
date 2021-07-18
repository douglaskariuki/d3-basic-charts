import React, { useEffect } from 'react';
import * as d3 from "d3";

export default function GeneralizedHistogram() {
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

        const metrics = [
            "windSpeed",
            "moonPhase",
            "dewPoint",
            "humidity",
            "uvIndex",
            "windBearing",
            "temperatureMin",
            "temperatureMax",
        ]

        const drawHistogram = (metric) => {
            const wrapper = d3.select(".wrapper")
                .append("svg")
                    .attr("width", dimensions.width)
                    .attr("height", dimensions.height)

            const metricAccessor = d => d[metric]
            const yAccessor = d => d.length

            const bounds = wrapper.append("g")
                .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

            const xScale = d3.scaleLinear()
                .domain(d3.extent(dataset, metricAccessor))
                .range([0, dimensions.boundedWidth])
                .nice()

            const binsGenerator = d3.histogram()
                .domain(xScale.domain())
                .value(metricAccessor)
                .thresholds(12)

            const bins = binsGenerator(dataset)

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(bins, yAccessor)]) // .max() will find the maximum number of days in a bin
                .range([dimensions.boundedHeight, 0])
                .nice()

            const binsGroup = bounds.append("g")

            const binGroups = binsGroup.selectAll("g")
                .data(bins)
                .enter()
                .append("g")

            const barPadding = 1

            const barRects = binGroups.append("rect")
                .attr("x", d => xScale(d.x0) ) // bar will start at the lower bound of the bin, xScale will convert it to humidity levels to pixel space
                .attr("y", d => yScale(yAccessor(d)))
                .attr("width", d => d3.max([ // .max() prevents passing <rect> a negative width, d3.max(0, width)
                    0, xScale(d.x1) - xScale(d.x0) - barPadding
                ]))
                .attr("height", d => dimensions.boundedHeight
                    - yScale(yAccessor(d))
                )
                .attr("fill", "cornflowerblue")

            const barText = binGroups.filter(yAccessor)
                .append("text")
                    .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2) // center of the bar, add half of the bar's width to left side of the bar
                    .attr("y", d => yScale(yAccessor(d)) - 5) // shift up by 5px for the gap
                    .text(yAccessor)
                    .style("text-anchor", "middle")
                    .attr("fill", "white")
                    .style("font-size", "12px")
                    .style("font-family", "sans-serif")

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
                .text(metric)
                .style("text-transform", "capitalize")
            
            
        }

        metrics.forEach(drawHistogram)
    }
    return (
        <div className="wrapper">

        </div>
    )
}
