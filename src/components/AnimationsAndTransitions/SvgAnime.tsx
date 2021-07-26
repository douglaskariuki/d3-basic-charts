import React from 'react';

export default function Animations() {
    return (
        <div>
            <svg width="120" height="120">
                <rect x="10" y="10" width="100" height="100" fill="cornflowerblue">
                    <animate 
                        attributeName="x"
                        values="0;20;0"
                        dur="2s"
                        repeatCount="indefinite"
                    />

                    <animate 
                        attributeName="fill"
                        values="cornflowerBlue;maroon;cornflowerBlue"
                        dur="6s"
                        repeatCount="indefinite"
                    />
                </rect>
            </svg>
        </div>
    )
}
