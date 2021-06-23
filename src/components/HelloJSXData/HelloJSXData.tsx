const HelloJSXData = (props: IHelloJSXDataProps) => {
    return (
        <div className="HelloJSXData">
            {props.data.map((d, index) => (
                <p key={`key-${ d}`}>
                    jsx {d}
                </p>
            ))}
        </div>
    )
}

interface IHelloJSXDataProps {
    data: string[]
}

export default HelloJSXData;