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

        // dataset.forEach(d => {
        //     bounds
        
        //         .append("circle")
        //         .attr("cx", xScale(xAccessor(d)))
        //         .attr("cy", yScale(yAccessor(d)))
        //         .attr("r", 5)
        
        function drawDots(dataset, color) {
            let dots = bounds.selectAll("circle")

            dots
                .enter().append("circle")
                .attr("cx", d => xScale(xAccessor(d)))
                .attr("cy", d => yScale(yAccessor(d)))
                .attr("r", 5)
                .attr("fill", color)
        }

        drawDots(dataset.slice(0, 200), "darkgrey")

        // setTimeout(() => {
        //     drawDots(dataset, "cornflowerblue")
        // }, 2000)


        // const dots = bounds.selectAll("circle")
        //     .data(dataset)
        //     .enter()
        //     .append("circle")
        //     .attr("cx", d => xScale(xAccessor(d)))
        //     .attr("cy", d => yScale(yAccessor(d)))
        //     .attr("r", 5)
        //     .attr("fill", "cornflowerblue")

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