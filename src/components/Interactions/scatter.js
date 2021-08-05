import React, {useEffect} from 'react';
import * as d3 from "d3";
import "./scatter.css"

export default function ScatterInteractions() {
    useEffect(() => {
        draw()
    }, [])

    const draw = async () => {
        const dataset = await d3.json("/data/my_weather_data.json")

        const xAccessor = d => d.dewPoint;
        const yAccessor = d => d.humidity;
        const colorAccessor = d => d.cloudCover;

        const width = d3.min([
            window.innerWidth * 0.9,
            window.innerHeight * 0.9,
        ])
        let dimensions = {
            width: width,
            height: width,
            margin: {
                top: 10,
                right: 10,
                bottom: 50,
                left: 50,
            },
        }
        dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
        dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    
        const wrapper = d3.select("#wrapper")
            .append("svg")
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, xAccessor))
            .range([0, dimensions.boundedWidth])
            .nice()

        const yScale = d3.scaleLinear()
            .domain(d3.extent(dataset, yAccessor))
            .range([dimensions.boundedHeight, 0])
            .nice()

        const colorScale = d3.scaleLinear()
            .domain(d3.extent(dataset, colorAccessor))
            .range(["skyblue", "darkslategrey"])

        const dots = bounds.selectAll("circle")
            .data(dataset)
            .join("circle")
                .attr("cx", d => xScale(xAccessor(d)))
                .attr("cy", d => yScale(yAccessor(d)))
                .attr("r", 4)
                .attr("fill", d => colorScale(colorAccessor(d)))
                .attr("tabIndex", "0")

        const xAxisGenerator = d3.axisBottom().scale(xScale)

        const yAxisGenerator = d3.axisLeft()
            .scale(yScale)
            .ticks(4)

        const xAxis = bounds.append("g")
            .call(xAxisGenerator)
                .style("transform", `translateY(${dimensions.boundedHeight}px)`)

        const yAxis = bounds.append("g")
            .call(yAxisGenerator)

        const xAxisLabel = xAxis.append("text")
            .attr("class", "x-axis-label")
            .attr("x", dimensions.boundedWidth / 2)
            .attr("y", dimensions.margin.bottom - 10)
            .html("dew point (&deg;F)")

        const yAxisLabel = yAxis.append("text")
            .attr("class", "y-axis-label")
            .attr("x", -dimensions.boundedHeight / 2)
            .attr("y", -dimensions.margin.left + 10)
            .text("relative humidity")

        const delaunay = d3.Delaunay.from(
            dataset,
            d => xScale(xAccessor(d)),
            d => yScale(yAccessor(d))
        )

        console.log("delaunay" ,delaunay)

        const voronoi = delaunay.voronoi()
        voronoi.xmax = dimensions.boundedWidth
        voronoi.ymax = dimensions.boundedHeight

        console.log("voronoi" ,voronoi)

        bounds.selectAll(".voronoi")
            .data(dataset)
            .join("path")
                .attr("class", "voronoi")
                .attr("d", (d, i) => voronoi.renderCell(i))
                .on("mouseenter", onMouseEnter)
                .on("mouseleave", onMouseLeave)

        const tooltip = d3.select(".tooltip")
        function onMouseEnter(event, d) {
            // const selection = d3.select(event.currentTarget)
            tooltip.style("opacity", 1) 
            
            const date = d["date"]
            const dateParser = d3.timeParse("%Y-%m-%d")
            const timeFormat = d3.timeFormat("%B %A %d, %Y")
            tooltip.select("#date")
                .text(timeFormat(dateParser(date)))
            
            tooltip.select("#humidity")
                .text(yAccessor(d))

            tooltip.select("#dew-point")
                .text(xAccessor(d))

            tooltip.style("transform", `translate()`)

            const x = xScale(xAccessor(d)) + dimensions.margin.left
            const y = yScale(yAccessor(d)) + dimensions.margin.top

            tooltip.style("transform", `translate(calc(-50% + ${x}px), calc(-100% + ${y}px))`)
        
            const dayDot = bounds.append("circle")
                .attr("class", "tooltip-dot")
                .attr("cx", xScale(xAccessor(d)))
                .attr("cy", yScale(yAccessor(d)))
                .attr("r", 7)
                .attr("fill", "maroon")
                .attr("pointer-events", "none")
        }

        function onMouseLeave() {
            tooltip.style("opacity", 0)
            d3.select(".tooltip-dot")
                .remove()
        }
    }
    return (
        <div>
            <div id="wrapper" className="wrapper">

                <div id="tootip" className="tooltip">
                        <div className="tooltip-date">
                            <span id="date"></span>
                        </div>
                        <div className="tooltip-humidity">
                            Humidity: <span id="humidity"></span>
                        </div>
                        <div className="tooltip-dew-point">
                            Dew Point: <span id="dew-point"></span>
                        </div>
                </div>

            </div>
        </div>
    )
}
