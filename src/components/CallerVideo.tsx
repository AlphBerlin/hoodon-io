interface CallerVideoProps {
    stream: MediaStream
}

export default function CallerVideo({stream}: CallerVideoProps) {
    return (
        <div className="w-full h-full relative">
            <video
                ref={(node) => {
                    if (node) node.srcObject = stream;
                }}
                autoPlay
                className="w-full h-full object-center absolute inset-0"
            />
        </div>
    )
}

