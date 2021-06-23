import React, { useEffect } from 'react';
import * as d3 from 'd3';

const PulsatingCircleD3 = () => {
    useEffect(() => {
        drawPulsatingCircle()
    })

    const drawPulsatingCircle = () => {
        (function repeat() {
            d3.selectAll('.circle') // select the circle SVG element
            .transition() // set a transition
            .duration(300) // // During the first 300 ms,
            .attr('stroke-width', 0)  // set the attributes of the stroke to 0 
            .attr('stroke-opacity', 0)
            .transition()
            .duration(300) // set the duration and change the stroke opacity from 0 to 0.5
            .attr('stroke-width', 0)
            .attr('stroke-opacity', 0.5) 
            .transition()
            .duration(1000) // set another stroke to change and use the D3 ease to create sinus ease
            .attr('stroke-width', 25)
            .attr('stroke-opacity', 0)
            .ease(d3.easeSin)
            .on('end', repeat) // function calls itself to loop using a recursive function
        })()
    }

    return (
        <>
            <svg>
            <circle 
                className="circle" 
                cx="50" 
                cy="50" 
                stroke="orange"
                fill="orange" 
                r="8" 
            />
            </svg>
        </>
    )
}

export default PulsatingCircleD3;