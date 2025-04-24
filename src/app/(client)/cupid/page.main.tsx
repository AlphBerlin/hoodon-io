'use client';

import PeerManager from "@/lib/peer-manager";
import {useChannel} from "@/context/channel-context";
import {useEffect, useState} from "react";
import Peer from "peerjs";
import {StreamProvider} from "@/context/stream-context";
import UsersConnectionProvider from "@/context/user-connection-context";
import CupidConnect from "@/app/(client)/cupid/components/cupid-connect";

const MatchMakerClient = ({user}: { user: any }) => {
    const peerManager = PeerManager.getInstance();
    const {channelName, channelData, loading, subscribe, requestJoin} = useChannel();
    const [isReady, setReady] = useState(false);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [initError, setInitError] = useState<Error | null>(null);
    const [stream, setStream] = useState<MediaStream>();

    const initializePeer = async () => {
        try {
            await peerManager.initialize(channelName!);
            const peerInstance = peerManager.getPeer();
            setPeer(peerInstance);

            if (channelData.isHost) {
                subscribe();
            } else {
                requestJoin(channelName!);
            }

            setReady(true);
        } catch (error) {
            console.error('Failed to initialize peer:', error);
            setInitError(error as Error);
        }
    };

    useEffect(() => {
        if (!loading && channelData && channelName) {
            initializePeer();
        }

        return () => {
            peerManager.terminate();
        };
    }, [loading, channelData, channelName]);

    if (!channelName) {
        return <div>Error: Channel name is required</div>;
    }

    if (initError) {
        return <div>Error initializing peer connection: {initError.message}</div>;
    }

    return (
        <StreamProvider stream={stream!}>
            <UsersConnectionProvider
                user={{
                    name: user.name,
                    picture: user.avatar
                }}
                myId={peerManager.getPeerId() || 'pending'}
                peer={peer}
            >
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-300">
                    <main className="flex-grow p-4 relative flex items-center justify-center">
                        <CupidConnect
                            oneStreamReady={(stream: MediaStream) => {
                                //console.log("Stream ready")
                                setStream(stream)
                            }}
                        />
                    </main>
                </div>
            </UsersConnectionProvider>
        </StreamProvider>
    );
};

export default MatchMakerClient;
