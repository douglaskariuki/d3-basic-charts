import React, { useEffect } from 'react';
import * as d3 from "d3";
import "./histo.scss";

export default function GeneralizedHistogramWithD3Transitions() {
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

        const wrapper = d3.select(".wrapper")
            .append("svg")
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

        bounds.append("g")
            .attr("class", "bins")

        bounds.append("line")
            .attr("class", "mean")

        bounds.append("g")
            .attr("class", "x-axis")
            .style("transform", `translateY(${dimensions.boundedHeight}px)`)
            .append("text")
            .attr("class", "x-axis-label")
            .attr("x", dimensions.boundedWidth / 2)
            .attr("y", dimensions.margin.bottom - 10)

        const drawHistogram = (metric) => {
            const metricAccessor = d => d[metric]
            const yAccessor = d => d.length

            const xScale = d3.scaleLinear()
                .domain(d3.extent(dataset, metricAccessor))
                .range([0, dimensions.boundedWidth])
                .nice()

            const binsGenerator = d3.histogram()
                .domain(xScale.domain())
                .value(metricAccessor)
                .thresholds(12)

            console.log("binsGenerator", binsGenerator)

            const bins = binsGenerator(dataset)
            console.log("bins", bins)

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(bins, yAccessor)])
                .range([dimensions.boundedHeight, 0])
                .nice()

            // draw data

            const exitTransition = d3.transition()
                .duration(600).ease(d3.easeBackIn)

            const updateTransition = exitTransition.transition() // delay update transition until exit is finished
                .duration(600).ease(d3.easeBackIn)

            const barPadding = 1

            let binGroups = bounds.select(".bins")
                .selectAll(".bin")
                .data(bins)

            const oldBinGroups = bounds.exit()
            oldBinGroups.selectAll("rect")
                .style("fill", "orangered")
                .transition(exitTransition)
                .attr("y", dimensions.boundedHeight)
                .attr("height", 0)

            oldBinGroups.selectAll("text")
                .transition(exitTransition)
                .attr("y", dimensions.boundedHeight)

            oldBinGroups
                .transition(exitTransition)
                .remove()

            const newBinGroups = binGroups.enter().append("g")
                .attr("class", "bin")

            newBinGroups.append("rect")
                .attr("height", 0)
                .attr("x", d => xScale(d.x0) + barPadding)
                .attr("y", dimensions.boundedHeight)
                .attr("width", d => d3.max([
                    0,
                    xScale(d.x1) - xScale(d.x0) - barPadding
                ]))
                .attr("fill", "yellowgreen")

            newBinGroups.append("text")
                .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
                .attr("y", dimensions.boundedHeight)

            binGroups = newBinGroups.merge(binGroups)

            const barRects = binGroups.select("rect")
                .transition(updateTransition)
                    .attr("x", d => xScale(d.x0) + barPadding)
                    .attr("y", d => yScale(yAccessor(d)))
                    .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
                    .attr("width", d => d3.max([
                        0,
                        xScale(d.x1) - xScale(d.x0) - barPadding
                    ]))
                .transition()
                    .style("fill", "cornflowerblue")

            console.log("barRects", barRects)

            const barText = binGroups.select("text")
                .transition(updateTransition)
                    .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
                    .attr("y", d => yScale(yAccessor(d)) - 5)
                    .text(d => yAccessor(d) || "")

            const mean = d3.mean(dataset, metricAccessor)

            const meanLine = bounds.selectAll(".mean")
                    .transition(updateTransition)
                        .attr("x1", xScale(mean))
                        .attr("x2", xScale(mean))
                        .attr("y1", -20)
                        .attr("y2", dimensions.boundedHeight)

            const meanLabel = bounds.append("text")
                .transition(updateTransition)
                    .attr("x", xScale(mean))
                    .attr("y", -20)
                    .text("mean")
                    .attr("fill", "white")
                    .style("font-size", "12px")
                    .style("text-anchor", "middle")

            // draw peripherals
            const xAxisGenerator = d3.axisBottom()
                .scale(xScale)

            const xAxis = bounds.select(".x-axis")
                .transition(updateTransition)
                .call(xAxisGenerator)

            const xAxisLabel = xAxis.select(".x-axis-label")
                .text(metric)

            
        }

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

        let selectedMetricIndex = 0

        drawHistogram(metrics[selectedMetricIndex])

        const button = d3.select("body")
            .append("button")
            .text("Change metric")

        button.node()?.addEventListener("click", buttonClicked)

        function buttonClicked() {
            selectedMetricIndex = (selectedMetricIndex + 1) % metrics.length
            drawHistogram(metrics[selectedMetricIndex])
        }
    }
    
    return (
        <div className="wrapper">
            
        </div>
    )
}
