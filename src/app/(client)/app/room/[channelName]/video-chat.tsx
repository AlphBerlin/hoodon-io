'use client'

import {useState} from 'react'
import UserVideo from '@/components/UserVideo'
import CallerVideo from '@/components/CallerVideo'
import {useUserSettings} from "@/context/user-state-context";
import Video from "@/components/Video";

export default function VideoCallPage({oneStreamReady}:{oneStreamReady:(stream: MediaStream) => void}) {
    const {state} = useUserSettings()
    const [isCallerExpanded, setIsCallerExpanded] = useState(false)
    const [isUserExpanded, setIsUserExpanded] = useState(false)
    const {streams} = state

    const toggleCallerExpand = () => {
        setIsCallerExpanded(!isCallerExpanded)
        if (!isCallerExpanded) {
            setIsUserExpanded(false)
        }
    }

    const toggleUserExpand = () => {
        setIsUserExpanded(!isUserExpanded)
        if (!isUserExpanded) {
            setIsCallerExpanded(false)
        }
    }
    return (
        <div className="relative w-full h-full">
            <div
                className={`flex flex-col sm:flex-row gap-4 w-full h-full justify-center ${isCallerExpanded || isUserExpanded ? 'items-center justify-center' : ''}`}>
                {Object.values(streams).map((stream, index) => (
                    <div key={index} className={`${isCallerExpanded ? 'w-full h-full' : 'w-full sm:w-1/2'} aspect-video relative`}>
                        <Video
                            label="Caller's Video"
                            isMinimized={isUserExpanded}
                            isExpanded={isCallerExpanded}
                            onToggleExpand={toggleCallerExpand}
                        >
                            <CallerVideo
                                stream={stream}
                            />
                        </Video>
                    </div>

                ))}
                <div className={`${isUserExpanded ? 'w-full h-full' : 'w-full sm:w-1/2'} aspect-video relative`}>
                    <Video
                        label="Your Video"
                        isMinimized={isCallerExpanded && !isUserExpanded}
                        isExpanded={isUserExpanded}
                        onToggleExpand={toggleUserExpand}
                    >
                        <UserVideo onStreamReady={oneStreamReady}/>
                    </Video>
                </div>
            </div>
        </div>
    )
}

