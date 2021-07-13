import React,{ useEffect } from "react"
import * as d3 from "d3"

const ScatterChart = (props: IBasicScatterChartProps) => {
    useEffect(() => {
        draw()
    }, [])

    async function draw() {
        let dataset = await d3.json("/data/my_weather_data.json")
        console.table(dataset)

        const xAccessor = d => d.dewPoint
        const yAccessor = d => d.humidity
        const colorAccessor = d => d.cloudCover

        const width = d3.min([
            window.innerWidth * 0.9,
            window.innerHeight * 0.9,
        ])

        const dimensions =  {
            width,
            height: width
        }

        const wrapper = d3.select(".scatter")
            .append("svg")
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${props.left}px, ${props.top}px)`)

        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, xAccessor))
            .range([0, dimensions.width - props.left - props.right])
            .nice()

        const yScale = d3.scaleLinear()
            .domain(d3.extent(dataset, yAccessor))
            .range([dimensions.height - props.top - props.bottom, 0])
            .nice()

        const colorScale = d3.scaleLinear()
            .domain(d3.extent(dataset, colorAccessor))
            .range(["skyblue", "darkslategrey"]) 

        // dataset.forEach(d => {
        //     bounds
        
        //         .append("circle")
        //         .attr("cx", xScale(xAccessor(d)))
        //         .attr("cy", yScale(yAccessor(d)))
        //         .attr("r", 5)

        const xAxisGenerator = d3.axisBottom()
            .scale(xScale)

        const yAxisGenerator = d3.axisLeft()
            .scale(yScale)
            .ticks(4)

        const yAxis = bounds.append("g")
            .call(yAxisGenerator)
            

        const xAxis = bounds.append("g")
            .call(xAxisGenerator)
                .style("transform", `translateY(${dimensions.height - props.top - props.bottom}px)`)
    
        const yAxisLabel = yAxis.append("text")
            .attr("x", -dimensions.height  / 2)
            .attr("y", -props.left + 10)
            .attr("fill", "white")
            .style("font-size", "1.4em")
            .text("Relative Humidity")
            .style("transform", "rotate(-90deg)")
            .style("text-anchor", "middle")


        const xAxisLabel = xAxis.append("text")
            .attr("x", dimensions.width / 2)
            .attr("y", props.bottom - 10)
            .attr("fill", "white")
            .style("font-size", "1.4em")
            .html("Dew point (&deg;F)")

        function drawDots(dataset) {
            let dots = bounds.selectAll("circle").data(dataset)

            dots
                // .enter().append("circle")
                // .merge(dots)
                .join("circle")
                .attr("cx", d => xScale(xAccessor(d)))
                .attr("cy", d => yScale(yAccessor(d)))
                .attr("r", 5)
                .attr("fill", d => colorScale(colorAccessor(d)))
        }

        setTimeout(() => {
            drawDots(dataset)
        }, 2000)

    }



    return <div className="scatter"></div>
}

interface IBasicScatterChartProps {
    top: number
    right: number
    bottom: number
    left: number
}

export default ScatterChart