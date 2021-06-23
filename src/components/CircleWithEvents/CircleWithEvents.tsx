import * as React from 'react';
import './CircleWithEvents.scss';

export default class CircleWithEvents extends React.PureComponent<ICircleWithEventsProps> {
    componentDidMount() {

    }

    onMouseOverHandler(event: React.MouseEvent<SVGCircleElement, MouseEvent>) {
        alert('onMouseOverHandler')
    }

    onMouseOutHandler() {
        alert('onMouseOutHandler')
    }

    render() {
        return (
        <>
            <svg width="500" height="500">
                <g>
                    <circle
                        className="circle"
                        transform="translate(150 150)"
                        r="100"

                        onMouseOver={(event) => {
                            event.stopPropagation()
                            this.onMouseOverHandler(event)
                        }}

                        onMouseOut={(event) => {
                            event.stopPropagation()
                            this.onMouseOutHandler()
                        }}

                        onClick={(event) => {
                            event.stopPropagation()
                            // eslint-disable-next-line no-alert
                            alert('onClick')
                        }}
                    />
                </g>
            </svg>
        </>
        )
    }
}

interface ICircleWithEventsProps {
    // TODO
}