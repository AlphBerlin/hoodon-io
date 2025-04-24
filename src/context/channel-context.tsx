import React, {createContext, useContext, useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {getChannel, updateChannel} from "@/lib/channel-api-handler";
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabase/client";
import {USER_EVENTS} from "@/config/events";
import {RealtimeChannel} from "@supabase/realtime-js";
import PeerManager from "@/lib/peer-manager";
import {Channel} from "@/types/database";
import {useUser} from "@/context/user-context";
import {Toaster} from "@/components/ui/sonner";
import {toast} from "sonner";
import JoinRequestNotification from "@/components/join-request-notification";
import {ChannelContextType, JoinRequest} from "@/types/types";


const ChannelContext = createContext<ChannelContextType | undefined>(undefined);


export const ChannelProvider: React.FC<{
    channelName: string;
    children: React.ReactNode;
}> = ({ channelName, children }) => {
    const [channelData, setChannelData] = useState<Channel>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
    const [hasAcceptedUser, setHasAcceptedUser] = useState(false);
    const router = useRouter();
    const {user} = useUser();
    const [lobby, setLobby] = useState<boolean>(false);
    const CALL_TIMEOUT = 30000 //30 seconds

    // Handle cleanup of requests
    useEffect(() => {
        return () => {
            joinRequests.forEach(request => clearTimeout(request.timeoutId));
        };
    }, [joinRequests]);

    const handleJoinRequest = async (requestId: string, approved: boolean) => {
        if (hasAcceptedUser && approved) {
            toast("Cannot Accept", {
                description: "Another user has already been accepted",
            });
            return;
        }

        const request = joinRequests.find(r => r.id === requestId);
        if (!request) return;

        setJoinRequests(prev => prev.filter(r => r.id !== requestId));

        if (approved) {
            setHasAcceptedUser(true);
            await supabase.channel(channelName!).send({
                type: 'broadcast',
                event: USER_EVENTS.APPROVED,
                payload: { requestPeer: PeerManager.getInstance().getPeerId() }
            });
        } else {
            await supabase.channel(channelName!).send({
                type: 'broadcast',
                event: USER_EVENTS.DENIED,
                payload: { userId: request.user.id }
            });
        }
    };

    useEffect(() => {
        const fetchChannelData = async () => {
            setLoading(true);
            try {
                const data = await getChannel({channelName: channelName});
                setChannelData(data);
                toast("Connected", {
                    description: `Successfully connected to channel ${channelName}`,
                });
            } catch (err: any) {
                toast("Connection Failed", {
                    description: `Unable to connect to channel: ${err.message}`,
                });
                router.push(`/cupid`);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchChannelData();
    }, [channelName]);

    function subscribe(): void {
        const channel = supabase.channel(channelName!)
            .on('broadcast', {event: USER_EVENTS.LEAVE}, async (payload) => {
                //console.log('Received USER_LEAVE:', payload);
                setHasAcceptedUser(false);
                toast("User Left", {
                    description: "A user has left the channel",
                });
                updateChannel({name: channelName!, status: "AVAILABLE"});
                await supabase.channel(channelName!).send({
                    type: 'broadcast',
                    event: USER_EVENTS.REMOVE_CONNECTION,
                    payload: {}
                });
            })
            .on('broadcast', {event: USER_EVENTS.REQUEST_JOIN}, async ({payload}) => {
                //console.log('Connection request received:', payload);

                // Create new request with auto-reject timeout
                const requestId = Math.random().toString(36).substr(2, 9);
                const timeoutId = setTimeout(() => {
                    handleJoinRequest(requestId, false);
                }, CALL_TIMEOUT);

                const newRequest: JoinRequest = {
                    id: requestId,
                    user: payload.user,
                    timestamp: Date.now(),
                    timeoutId
                };
                //console.log('newRequest:', newRequest);

                setJoinRequests(prev => [...prev, newRequest]);
            })
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    /*toast("Channel Active", {
                        description: "Channel is now available for connections",
                    });*/
                    updateChannel({name: channelName!, status: 'AVAILABLE'});
                } else {
                    /*toast("Channel Inactive", {
                        description: "Channel connection is currently idle",
                    });*/
                    updateChannel({name: channelName!, status: 'IDLE'});
                }
            });
    }

    function subscribeTo(toChannelName: string): RealtimeChannel {
        let timeoutId: NodeJS.Timeout;
        const channel = supabase.channel(toChannelName);

        toast("Connecting...", {
            description: "Attempting to establish connection...",
        });

        timeoutId = setTimeout(() => {
            //console.log('Connection timeout - unsubscribing');
            toast("Connection Timeout",
                {
                    description: "The connection attempt took too long and was cancelled",
                });
            channel.unsubscribe();
            supabase.channel(channelName!).send({
                type: 'broadcast',
                event: USER_EVENTS.LEAVE,
                payload: {user:user}
            })
            router.push('/cupid')
        }, CALL_TIMEOUT);

        return channel
            .on('broadcast', {event: USER_EVENTS.APPROVED}, async ({payload}) => {
                clearTimeout(timeoutId);
                toast("Connection Approved",
                    {
                        description: "Your connection request was accepted",
                    });
                //console.log('#2 Connecting....', payload, toChannelName);
                await supabase.channel(channelName!).send({
                    type: 'broadcast',
                    event: USER_EVENTS.JOINED,
                    payload: {id: payload.requestPeer, user:user}
                });
            }).on('broadcast', {event: USER_EVENTS.DENIED}, ({payload}) => {
                clearTimeout(timeoutId);
                toast("Connection Denied",
                    {
                        description: "Your connection request was rejected",
                    });
                //console.log('#2 Access denied. Disconnecting...', payload, toChannelName);
                channel.unsubscribe();
                router.push(`/cupid`);
            }).on('broadcast', {event: USER_EVENTS.REMOVE_CONNECTION}, ({payload}) => {
                toast("Connection Removed",
                    {
                        description: "The connection has been terminated",
                    });
                channel.unsubscribe();
                router.push(`/cupid`);
            }).on('broadcast', {event: USER_EVENTS.FAILED_CONNECTION}, ({payload}) => {
                clearTimeout(timeoutId);
                toast("Connection Failed",
                    {
                        description: "Failed to establish connection. Please try again.",
                    });
                //console.log('#2 Access denied. Disconnecting...', payload, toChannelName);
                channel.unsubscribe();
                supabase.channel(channelName!).send({
                    type: 'broadcast',
                    event: USER_EVENTS.LEAVE,
                    payload: {user: 'user'}
                })
                router.push('/cupid')
            })
            .subscribe();
    }

    async function requestJoin(channelName: string): Promise<void> {
        try {
            const channel = subscribeTo(channelName)
            await channel.send({
                type: 'broadcast',
                event: USER_EVENTS.REQUEST_JOIN,
                payload: {user:user},
            });
        } catch (error) {
            console.error('Failed to request join:', error);
            toast("Join Request Failed",
                {
                    description: "Unable to send join request. Please try again.",
                });
        }
    }

    return (
        <ChannelContext.Provider value={{
            channelName,
            channelData,
            loading,
            error,
            requestJoin,
            subscribe,
            lobby,
            joinRequests,
            handleJoinRequest
        }}>
            <Toaster/>
            <AnimatePresence>
                {joinRequests.map(request => (
                    <JoinRequestNotification
                        key={request.id}
                        request={request}
                        onAction={(approved) => handleJoinRequest(request.id, approved)}
                        duration={CALL_TIMEOUT}
                        onExpire={() => handleJoinRequest(request.id, false)}
                    />
                ))}
            </AnimatePresence>
            {children}
        </ChannelContext.Provider>
    );
};

export const useChannel = (): ChannelContextType => {
    const context = useContext(ChannelContext);
    if (!context) {
        throw new Error("useChannel must be used within a ChannelProvider");
    }
    return context;
};