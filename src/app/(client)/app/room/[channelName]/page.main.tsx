'use client';

import PeerManager from "@/lib/peer-manager";
import Prejoin from "./PreJoin";
import {useChannel} from "@/context/channel-context";
import {useEffect, useState} from "react";
import Peer from "peerjs";
import {User} from "@supabase/supabase-js";
import {useUserSettings} from "@/context/user-state-context";
import {StreamProvider} from "@/context/stream-context";
import UsersConnectionProvider from "@/context/user-connection-context";
import VideoCall from "@/components/VideoCall";

const Meet = ({user}: { user: User }) => {
    const peerManager = PeerManager.getInstance();
    const {subscribe, requestJoin} = useChannel();
    const {channelName, channelData} = useChannel()
    const [isReady, setReady] = useState(false);
    const [peer, setPeer] = useState<Peer>();
    const {updater} = useUserSettings();
    // const {toggleSidebar} = useSidebar()
    const {setIsMuted, setIsHidden} = updater
    const [stream, setStream] = useState<MediaStream>();


    const onReady = () => {
        peerManager.initialize(channelName!);
        setPeer(peerManager.getPeer())
        if (channelData.isHost) {
            subscribe();
        } else {
            requestJoin(channelName!);
        }
        setReady(true);
    };

    useEffect(() => {
        return peerManager.terminate();
    }, []);

    if (!channelName) {
        return <div>Error: Channel name is required</div>;
    }
    return (
        <>
            <StreamProvider stream={stream!}>
                {!isReady ? (
                    <Prejoin onSubmit={onReady} />
                ) : (
                    <UsersConnectionProvider user={{name: user.user_metadata.name, picture: user.user_metadata.picture}}
                                             myId={'myId'} peer={PeerManager.getInstance().getPeer()}>
                        <VideoCall oneStreamReady={(stream: MediaStream) => {
                            //console.log("Stream ready")
                            setStream(stream)
                        }}/>
                    </UsersConnectionProvider>
                )}
            </StreamProvider>

        </>
    );
};

export default Meet;
