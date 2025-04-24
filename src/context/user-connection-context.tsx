import React, { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChannel } from '@/context/channel-context';
import { useUserSettings } from '@/context/user-state-context';
import { supabase } from '@/lib/supabase/client';
import { USER_EVENTS } from '@/config/events';
import { append } from '@/lib/utils';
import { useStream } from "@/context/stream-context";

interface UsersConnectionContextProps {
    peer: any;
    myId: string;
    users: Record<string, any>;
    leaveRoom: (id: string) => void;
}

export const UsersConnectionContext = createContext<UsersConnectionContextProps | undefined>(undefined);

interface UsersConnectionProviderProps {
    peer: any;
    myId: string;
    user: { name: string; picture: string };
    children: React.ReactNode;
}

export default function UsersConnectionProvider({
                                                    peer,
                                                    myId,
                                                    children,
                                                    user,
                                                }: UsersConnectionProviderProps) {
    const router = useRouter();
    const { channelName, channelData } = useChannel();
    const { updater } = useUserSettings();
    const {
        setIsMuted,
        setIsHidden,
        setAvatars,
        setStreams,
        setNames,
        setSharedScreenTrack,
    } = updater;
    const { stream, muted, visible } = useStream();
    const [users, setUsers] = useState<Record<string, any>>({});

    // Utility function to cleanup a user connection
    const cleanUpUser = (id: string) => {
        users[id]?.close();
        setUsers((prev) => {
            const { [id]: _, ...rest } = prev;
            return rest;
        });
        setStreams((prev) => {
            const { [id]: _, ...rest } = prev;
            return rest;
        });
    };

    const leaveRoom = (id: string) => {
        cleanUpUser(id);
    };

    // Helper to process a remote stream
    const handleRemoteStream = (id: string, remoteStream: MediaStream) => {
        setStreams((prev) => append({ [id]: remoteStream })(prev));
        const videoTracks = remoteStream.getVideoTracks();
        // If there is more than one video track, assume the second is for screen share.
        if (videoTracks.length > 1) {
            setSharedScreenTrack(videoTracks[1]);
        }
    };

    useEffect(() => {
        if (!peer) return;

        const handleUserJoined = ({ payload }: any) => {
            // Only process if you’re not the host
            if (channelData.isHost) {
                return;
            }
            const { id, user: { name, picture, muted: initMuted, visible: initVisible } } = payload;
            const call = peer.call(id, stream, {
                metadata: {
                    user: { name: user.name, picture: user.picture },
                    muted,
                    visible,
                },
            });

            // Use the 'stream' event (PeerJS default)
            call.on('stream', (remoteStream: MediaStream) => {
                handleRemoteStream(id, remoteStream);
            });

            // Fallback for mobile browsers: use ontrack event if available
            if (call.peerConnection && 'ontrack' in call.peerConnection) {
                call.peerConnection.ontrack = (event: RTCTrackEvent) => {
                    if (event.streams && event.streams[0]) {
                        handleRemoteStream(id, event.streams[0]);
                    }
                };
            }

            call.on('close', () => cleanUpUser(id));

            setUsers((prev) => append({ [id]: call })(prev));
            setIsMuted((prev) => append({ [id]: initMuted })(prev));
            setIsHidden((prev) => append({ [id]: !initVisible })(prev));
            setAvatars((prev) => append({ [id]: picture })(prev));
            setNames((prev) => append({ [id]: name })(prev));
        };

        const joinedListener = supabase
            .channel(channelName!)
            .on('broadcast', { event: USER_EVENTS.JOINED }, handleUserJoined);

        return () => {
            joinedListener.unsubscribe();
        };
    }, [peer, stream, muted, visible, user, channelName, channelData]);

    // When stream changes, update the video track in all active connections.
    useEffect(() => {
        if (!stream || !peer || Object.keys(users).length === 0) return;

        Object.keys(users).forEach((id) => {
            const call = users[id];
            if (call && call.peerConnection) {
                const senders = call.peerConnection.getSenders();
                const videoSender = senders.find((sender: any) => sender.track?.kind === 'video');
                const newVideoTrack = stream.getVideoTracks()[0];

                if (videoSender && newVideoTrack) {
                    videoSender.replaceTrack(newVideoTrack);
                }
            }
        });
    }, [stream, peer, users]);

    useEffect(() => {
        if (!peer) return;

        const handleIncomingCall = (call: any) => {
            const { peer: callerId, metadata } = call;
            const { user: callerUser, muted, visible } = metadata;

            // Answer the call with our stream.
            call.answer(stream);

            // Use 'stream' event
            call.on('stream', (remoteStream: MediaStream) => {
                handleRemoteStream(callerId, remoteStream);
            });

            // Fallback: use 'ontrack' event if available
            if (call.peerConnection && 'ontrack' in call.peerConnection) {
                call.peerConnection.ontrack = (event: RTCTrackEvent) => {
                    if (event.streams && event.streams[0]) {
                        handleRemoteStream(callerId, event.streams[0]);
                    }
                };
            }

            call.on('close', () => cleanUpUser(callerId));

            setUsers((prev) => append({ [callerId]: call })(prev));
            setIsMuted((prev) => append({ [callerId]: muted })(prev));
            setIsHidden((prev) => append({ [callerId]: !visible })(prev));
            setAvatars((prev) => append({ [callerId]: callerUser.picture })(prev));
            setNames((prev) => append({ [callerId]: callerUser.name })(prev));
        };

        peer.on('call', handleIncomingCall);

        return () => {
            peer.off('call', handleIncomingCall);
        };
    }, [peer, stream]);

    useEffect(() => {
        const handleUserLeft = ({ payload }: any) => {
            const { peerId } = payload;
            if (myId === peerId) {
                router.push('/');
            } else {
                cleanUpUser(peerId);
            }
        };

        const leftListener = supabase
            .channel(channelName!)
            .on('broadcast', { event: USER_EVENTS.LEFT }, handleUserLeft);

        return () => {
            leftListener.unsubscribe();
        }
    }, [channelName, myId, router]);

    useEffect(() => {
        // @ts-ignore
        const sharedScreenListener = supabase.channel(channelName!).on('broadcast', {event: USER_EVENTS.SHARED_SCREEN}, (username: string) => {
            if (peer) {
                peer.disconnect();
                peer.reconnect();
                alert(`${username} is sharing their screen`);
            }
        });

        return () => {
            sharedScreenListener?.unsubscribe();
        };
    }, [peer, channelName]);

    useEffect(() => {
        const stopShareListener = supabase
            .channel(channelName!)
            .on('broadcast', { event: USER_EVENTS.STOPPED_SHARE_SCREEN }, () => {
                setSharedScreenTrack(null);
                alert('Stopped sharing screen');
            });

        return () => {
            stopShareListener?.unsubscribe();
        };
    }, [channelName]);

    return (
        <UsersConnectionContext.Provider value={{ peer, myId, users, leaveRoom }}>
            {children}
        </UsersConnectionContext.Provider>
    );
}
