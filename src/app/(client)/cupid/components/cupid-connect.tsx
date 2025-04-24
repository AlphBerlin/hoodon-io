'use client'

import React, {useEffect, useState} from 'react'
import UserVideo from '@/components/UserVideo'
import CallerVideo from '@/components/CallerVideo'
import {useUserSettings} from "@/context/user-state-context";
import Video from "@/components/Video";
import {useStream} from "@/context/stream-context";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {PhoneOffIcon, UserIcon} from "lucide-react";
import {supabase} from "@/lib/supabase/client";
import {USER_EVENTS} from "@/config/events";
import {useChannel} from "@/context/channel-context";
import SharingTabs from "@/components/sharing-tabs";
import {HoodsPopover} from "@/components/hoods-popover";

const CupidConnect = ({oneStreamReady}: { oneStreamReady: (stream: MediaStream) => void }) => {
    const {state} = useUserSettings()
    const [isCallerExpanded, setIsCallerExpanded] = useState(false)
    const [isUserExpanded, setIsUserExpanded] = useState(false)
    const {channelName} = useChannel()
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
    const {toggleHoodOn} = useStream();
    const router = useRouter()

    useEffect(() => {
        setIsCallerExpanded(Object.values(streams).length > 0)
    }, [streams]);

    return (
        <div className="relative w-full h-full">
            <div
                className={`flex flex-col sm:flex-row gap-4 w-full justify-center ${isCallerExpanded || isUserExpanded ? 'items-center justify-center' : ''}`}>
                <div className={`${isUserExpanded ? 'w-full h-full' : 'w-full sm:w-1/2'} aspect-video relative`}>
                    <Video
                        label="Your Video"
                        isMinimized={isCallerExpanded && !isUserExpanded}
                        isExpanded={isUserExpanded}
                        onToggleExpand={toggleUserExpand}
                    >
                        <UserVideo onStreamReady={oneStreamReady}/>
                        {/*<FloatingToolbar onAction={handleAction}/>*/}
                        {/*<Button
                            className="absolute bottom-2 left-2 bg-primary/60 dark:bg-primary/60 p-1 rounded-full opacity-100 transition-opacity duration-300 hover:bg-secondary/50"
                            onClick={() => {
                                toggleHoodOn()
                            }}
                        >
                            <UserIcon/>
                        </Button>*/}
                        <div className="absolute bottom-2 left-2 bg-primary/60 dark:bg-primary/60 p-1 rounded-full opacity-100 transition-opacity duration-300 hover:bg-secondary/50">
                            <HoodsPopover />
                        </div>

                    </Video>
                </div>

                {streams && Object.values(streams).length > 0 ? Object.values(streams).map((stream, index) => (
                    <div key={index}
                         className={`${isCallerExpanded ? 'w-full h-full' : 'w-full sm:w-1/2'} aspect-video relative`}>
                        <Video
                            label="Caller's Video"
                            isMinimized={isUserExpanded}
                            isExpanded={isCallerExpanded}
                            onToggleExpand={toggleCallerExpand}
                        >
                            <CallerVideo
                                stream={stream}
                            />
                            <Button
                                variant={'destructive'}
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-1 rounded-full opacity-100 transition-opacity duration-300 hover:bg-secondary/50"
                                onClick={() => {
                                    supabase.channel(channelName!).send({
                                        type: 'broadcast',
                                        event: USER_EVENTS.LEAVE,
                                        payload: {user: 'user'}
                                    })
                                    router.push('/cupid')
                                }}
                            >
                                <PhoneOffIcon/>
                            </Button>
                        </Video>
                    </div>

                )) : (
                    (!isUserExpanded) && (<div
                        className={`${isCallerExpanded ? 'w-full h-fit' : 'w-full sm:w-1/2'} aspect-video relative`}>
                        <main className="flex flex-col items-center justify-center ">
                            <div className="w-full max-w-md">
                                <SharingTabs/>
                            </div>
                        </main>
                        {/*<MatchMaker/>*/}
                    </div>)
                )}

            </div>
        </div>
    )
}
export default CupidConnect;

