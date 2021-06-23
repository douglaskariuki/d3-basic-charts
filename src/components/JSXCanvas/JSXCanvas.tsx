import React, { RefObject, useEffect, useRef } from "react";

const JSXCanvas = () => {
    const canvasRef: RefObject<HTMLCanvasElement> = useRef(null)

    useEffect(() => {
        draw()
    })

    const { devicePixelRatio: ratio = 1 } = window

    const draw = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        
        if (context) {
            context.scale(ratio, ratio)
            context.fillStyle = 'tomato'
            context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        }
    }

    return (
        <>
            <canvas ref={canvasRef} />
        </>
    )
}

export default JSXCanvas;