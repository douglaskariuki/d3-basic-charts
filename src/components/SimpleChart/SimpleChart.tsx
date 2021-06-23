import React, { RefObject } from 'react';
import './SimpleChart.scss';
import * as d3 from 'd3';

class SimpleChart extends React.PureComponent<ISimpleChartProps, ISimpleChartState> {
    ref: RefObject<HTMLDivElement>
    data: number[]

    constructor(props: ISimpleChartProps) {
        super(props)
        this.state = {
        // TODO
        }
        this.ref = React.createRef()
        this.data = [100, 200, 300, 400, 500]
    }

    componentDidMount() {
        this.drawChart()
    }

    drawChart() {
        const size = 500;
        const rectWidth = 80;
        const svg = d3.select(this.ref.current)
        .append('svg')
        .attr('width', size)
        .attr('height', size)
        .selectAll('rect')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => 2 + i * (rectWidth + 5))
        .attr('y', (d) => size - d)
        .attr('width', rectWidth)
        .attr('height', (d) => d)
        .attr('fill', 'tomato')
    }

    render() {
        return <div className="SimpleChart" ref={this.ref} />
    }
}


interface ISimpleChartProps {
    // TODO
}
    interface ISimpleChartState {
    // TODO
}

export default SimpleChart;