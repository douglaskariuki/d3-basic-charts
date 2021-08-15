import React, {useEffect} from "react";
import * as d3 from "d3";
import "./earth.css"

function WorldPopulation() {
    useEffect(() => {
        draw()
    }, [])

    const draw = async () => {
        const countryShapes = await d3.json("/data/world-geojson.json");
        const dataset = await d3.csv("data/data_bank_data.csv");

        console.log(dataset)

        const countryNameAccessor = d => d.properties["NAME"]
        const countryIdAccessor = d => d.properties["ADM0_A3_IS"]

        const metric = "Population growth (annual %)"
        let metricDataByCountry = {} // ie Country Code : Population Growth, KEN : 2.52311056260112

        dataset.forEach((d) => { // New object with country name(keys), and population growth amount(values) 
            if(d["Series Name"] != metric) return;
            metricDataByCountry[d["Country Code"]] = +d["2017 [YR2017]"] || 0 // convert the value to a number by prepending +
        })


        // Chart Dimensions

        let dimensions = {
            width: window.innerWidth * 0.9,
            margin: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
            },
        }

        dimensions.boundedWidth = dimensions.width
            - dimensions.margin.left
            - dimensions.margin.right

        const sphere = ({type: "Sphere"})

        const projection = d3.geoEqualEarth() // [latitude, longitude] -> [x, y] similar to scales
            .fitWidth(dimensions.boundedWidth, sphere) // projection's width, (1) width, (2) GeoJSON object

        const pathGenerator = d3.geoPath(projection) // similar to d3.line(), creates geographical shapes
        console.log(pathGenerator(sphere)) // outputs a <path> d string

        console.log(pathGenerator.bounds(sphere)) // .bounds() returns an array of [x, y] coordinates
        const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere) // spans from 0 to 1142.8 px horizontally and 0 to 556.2 px vertically

        dimensions.boundedHeight = y1
        dimensions.height = dimensions.boundedHeight
            + dimensions.margin.top
            + dimensions.margin.bottom

        // Draw canvas
        const wrapper = d3.select(".wrapper")
            .append("svg")
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

        // Create scales
        // scale to help turn metric values (population growth amounts) into color values
        const metricValues = Object.values(metricDataByCountry)

        const metricValueExtent = d3.extent(metricValues)
        console.log(metricValueExtent)

        const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]])
        const colorScale = d3.scaleLinear()
            .domain([-maxChange, 0, maxChange])
            .range(["indigo", "white", "darkgreen"])

        // Draw Data
        const earth = bounds.append("path")
            .attr("class", "earth")
            .attr("d", pathGenerator(sphere))

        // display a graticule on map, a grid of longitudinal and latitudinal lines
        const graticuleJson = d3.geoGraticule10() // generates lines every 10 degrees

        const graticule = bounds.append("path")
            .attr("class", "graticule")
            .attr("d", pathGenerator(graticuleJson))

        const countries = bounds.selectAll(".country")
            .data(countryShapes.features)
            .enter().append("path")
                .attr("class", "country")
                .attr("d", pathGenerator)
                .attr("fill", d => {
                    const metricValue = metricDataByCountry[countryIdAccessor(d)] || 0
                    if (typeof metricValue == "undefined") return "#e2e6e9"
                    return colorScale(metricValue)
                })

        
        // Draw Peripherals
        // Drawing a legend
        const legendGroup = wrapper.append("g")
            .attr("transform", `translate(${
                120
            }, ${
                dimensions.width < 800
                ? dimensions.boundedHeight - 30
                : dimensions.boundedHeight * 0.5
            })`)

        const legendTitle = legendGroup.append("text")
            .attr("y", -26)
            .attr("class", "legend-title")
            .text("Population growth")

        const legendByline = legendGroup.append("text")
            .attr("y", -9)
            .attr("class", "legend-byline")
            .text("Percent change in 2017")

        const defs = wrapper.append("defs")

        const legendGradientId = "legend-gradient"

        const gradient = defs.append("linearGradient")
            .attr("id", legendGradientId)
            .selectAll("stop")
            .data(colorScale.range())
            .enter().append("stop")
            .attr("stop-color", d => d)
            .attr("offset", (d, i) => `${
                i * 100 / 2 // 2 is one less than our array's length
            }%`)

        const legendWidth = 120
        const legendHeight = 16
        const legendGradient = legendGroup.append("rect")
            .attr("x", -legendWidth / 2)
            .attr("height", legendHeight)
            .attr("width", legendWidth)
            .style("fill", `url(#${legendGradientId})`)

    }

    return (
        <div className="wrapper">
            Map
        </div>
    )
}

export default WorldPopulation;