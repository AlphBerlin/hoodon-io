import React from 'react'
import {useStream} from "@/context/stream-context";
import VideoCallPage from "@/app/(client)/app/room/[channelName]/video-chat";
import FloatingToolbar from "@/components/FloatingToolbar";
import {useRouter} from "next/navigation";

export default function VideoCall({oneStreamReady}: { oneStreamReady: (stream: MediaStream) => void }) {
    const {toggleVideo, toggleAudio, toggleHoodOn} = useStream();
   const router= useRouter()

    const handleAction = (action: string) => {
        switch (action) {
            case "toggleVideo":
                toggleVideo()
                break;
            case "toggleAudio":
                toggleAudio()
                break;
            case "hoodUpdate":
                toggleHoodOn()
                break;
            case "chat":
                //console.log("Toggling Chat");
                break;
            case "endCall":
                //console.log("Ending call");
                router.push("/app");
                break;
            default:
                console.error("Unknown action:", action);
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <main className="flex-grow p-4 relative flex items-center justify-center">
                <VideoCallPage oneStreamReady={oneStreamReady}/>
            </main>
            <FloatingToolbar onAction={handleAction}/>
        </div>
    )
}


