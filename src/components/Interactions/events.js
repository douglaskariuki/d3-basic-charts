import React, {useEffect} from 'react';
import * as d3 from "d3";

export default function Eventss() {
    useEffect(() => {
        draw()
    }, [])

    async function draw() {
        const rectColors = [
            "yellowgreen",
            "cornflowerblue",
            "seagreen",
            "slateblue",
        ]

        const rects = d3.select(".svg")
            .selectAll(".rect")
            .data(rectColors) // bind selection to rectColors array
            .enter().append("rect")
                .attr("height", 100)
                .attr("width", 100) // 100 * 100
                .attr("x", (d, i) => i * 110) // shift each item 100 px to the right miltiplied by its index
                .attr("fill", "lightgrey")

        rects
            .on("mouseenter", function(event, index, nodes) {
                console.log({event, index, nodes})
                console.log(event.currentTarget)
                console.log(this)
                const selection = d3.select(event.currentTarget)
                selection.attr("fill", index)
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "lightgrey")
            })

            // destroy events after 5 seconds
            setTimeout(() => {
                rects
                    .dispatch("mouseout") // trigger a mouseout to ensure boxes finish in their neutral state
                    .on("mouseenter", null)
                    .on("mouseout", null)
            }, 5000)
    }
    
    return (
        <div className="wrapper">
            <svg height="200" width="500" className="svg"></svg>
        </div>
    )
}
