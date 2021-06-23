import * as React from 'react';
import './CircleWithEvents.scss';
import * as d3 from 'd3';

export default class CircleWithD3Events extends React.PureComponent<ICircleWithD3EventsProps> {
    componentDidMount() {
        this.draw()
    }

    onMouseOverHandler(event: React.MouseEvent<SVGCircleElement, MouseEvent>) {
        // alert('onMouseOverHandler')
    }

    onMouseOutHandler() {
        // alert('onMouseOutHandler')
    }

    draw = () => {
        d3.select('svg')
        .append('g')
        .append('circle')
        .attr('transform', 'translate(150, 150)')
        .attr('r', 100)
        .attr('class', 'circle')
        
        .on('click', () => {
            alert('onClick')
        })
        
        .on('mouseover', (event) => {
            this.onMouseOverHandler(event)
        })

        .on('mouseout', (event) => {
            this.onMouseOutHandler()
        })
    }


    render() {
        return (
            <>
                <svg id="svg" width="500" height="500" />
            </>
        )
    }
}

interface ICircleWithD3EventsProps {
    // TODO
}