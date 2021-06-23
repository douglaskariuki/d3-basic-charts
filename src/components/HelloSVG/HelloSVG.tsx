import React, { useState, useEffect, RefObject } from 'react'
import './HelloSVG.scss'
import * as d3 from 'd3' 

// const HelloSVG = () => {
//   const [myState, setMyState] = useState<Boolean>(true)
//   const ref: RefObject<HTMLDivElement> = React.createRef()

//   useEffect(() => {
//     draw()
//   })

//   const draw = () => {
//     d3.select(ref.current).append('p').text('Hello World')
//     d3.select('svg')
//       .append('g')
//       .attr('transform', 'translate(250, 0)')
//       .append('rect').attr('width', 500)
//       .attr('height', 500)
//       .attr('fill', 'tomato')
//   }

//   return (
//     <div className="HelloSVG" ref={ref}>
//       <svg width="500" height="500">
//         <g transform="translate(0, 0)">
//           <rect width="500" height="500" fill="green" />
//         </g>
//       </svg>
//     </div>
//   )
// }

const HelloSVG = () => {
  const useTag = '<use xlink:href="#heart" />'
  return (
    <div className="HelloSVG">
      <svg width="500" height="500">
        <g transform="translate(0, 0)">
        <rect className="myRect" width="300" height="300" /*
        fill="tomato" */ />
        </g>
        <g
        fill="grey"
        transform="rotate(-10 50 100)
        translate(-36 45.5)
        skewX(40)
        scale(1 0.5)"
        >
        <path id="heart" d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1
        90,30 Q 90,60 50,90 Q 10,60 10,30 z" />
        </g>
        {/* eslint-disable-next-line react/no-danger */}
        <svg dangerouslySetInnerHTML={{__html: useTag }} fill="none"
        stroke="white" />
      </svg>
    </div>
  )
}

/*
interface IHelloSVGProps {
  // TODO
}
*/

export default HelloSVG
