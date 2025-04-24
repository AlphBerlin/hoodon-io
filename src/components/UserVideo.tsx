import {HoodPublisher} from "@/components/HoodPublisher";
import {Loader2} from "lucide-react";
import * as React from "react";
import {useStream} from "@/context/stream-context";

interface UserVideoProps {
    onStreamReady: (stream: MediaStream) => void;
}

export default function UserVideo({onStreamReady}: UserVideoProps) {

    const [loading, setLoading] = React.useState<boolean>(true);

    const {visible} = useStream();
    return (
        <div className="absolute inset-0 flex items-center justify-center group ">
            {visible ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/50 z-20">
                            <Loader2 className="w-8 h-8 animate-spin"/>
                        </div>
                    )}
                    <div className={`relative w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <HoodPublisher
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                            onCombinedStreamReady={(stream) => {
                                onStreamReady(stream);
                                setTimeout(() => setLoading(false), 100);
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        className="w-24 h-24 rounded-full"
                        src="/images/meet-avatar.svg"
                        alt="Default Avatar"
                    />
                </div>
            )}
        </div>
    )
}

