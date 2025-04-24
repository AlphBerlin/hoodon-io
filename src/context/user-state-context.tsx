import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useChannel } from '@/context/channel-context';
import { supabase } from '@/lib/supabase/client';
import { USER_EVENTS } from '@/config/events';
import {append, KeyValue} from "@/lib/utils";


interface UsersState {
    streams: KeyValue<MediaStream>;
    isMuted: KeyValue<boolean>;
    isHidden: KeyValue<boolean>;
    avatars: KeyValue<string>;
    names: KeyValue<string>;
    sharedScreenTrack: MediaStreamTrack | null;
    isHost?: boolean;
}

interface UsersUpdater {
    setStreams: React.Dispatch<React.SetStateAction<KeyValue<MediaStream>>>;
    setIsMuted: React.Dispatch<React.SetStateAction<KeyValue<boolean>>>;
    setIsHidden: React.Dispatch<React.SetStateAction<KeyValue<boolean>>>;
    setAvatars: React.Dispatch<React.SetStateAction<KeyValue<string>>>;
    setNames: React.Dispatch<React.SetStateAction<KeyValue<string>>>;
    setSharedScreenTrack: React.Dispatch<React.SetStateAction<MediaStreamTrack | null>>;
}

const UsersStateContext = createContext<UsersState | undefined>(undefined);
const UsersUpdaterContext = createContext<UsersUpdater | undefined>(undefined);

export function UsersSettingsProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { channelName, channelData } = useChannel();
    const [streams, setStreams] = useState<KeyValue<MediaStream>>({});
    const [isMuted, setIsMuted] = useState<KeyValue<boolean>>({});
    const [isHidden, setIsHidden] = useState<KeyValue<boolean>>({});
    const [avatars, setAvatars] = useState<KeyValue<string>>({});
    const [names, setNames] = useState<KeyValue<string>>({});
    const [sharedScreenTrack, setSharedScreenTrack] = useState<MediaStreamTrack | null>(null);

    useEffect(() => {
        if (!channelName) return;

        const channel = supabase.channel(channelName);

        channel.on('broadcast', { event: USER_EVENTS.TOGGLED_VIDEO }, (payload) => {
            const peerId = payload.data;
            setIsHidden((prev) => append({ [peerId]: !prev[peerId] })(prev));
        });

        channel.on('broadcast', { event: USER_EVENTS.TOGGLED_AUDIO }, (payload) => {
            const peerId = payload.data;
            setIsMuted((prev) => append({ [peerId]: !prev[peerId] })(prev));
            //console.log('TOGGLE_AUDIO called');
        });

        return () => {
            channel.unsubscribe();
        };
    }, [channelName]);

    const stateValue = useMemo(() => ({
        streams,
        isMuted,
        isHidden,
        avatars,
        names,
        sharedScreenTrack,
        isHost: channelData?.isHost,
    }), [streams, isMuted, isHidden, avatars, names, sharedScreenTrack, channelData]);

    const updaterValue = useMemo(() => ({
        setStreams,
        setIsMuted,
        setIsHidden,
        setAvatars,
        setNames,
        setSharedScreenTrack,
    }), [setStreams, setIsMuted, setIsHidden, setAvatars, setNames, setSharedScreenTrack]);

    return (
        <UsersStateContext.Provider value={stateValue}>
            <UsersUpdaterContext.Provider value={updaterValue}>
                {children}
            </UsersUpdaterContext.Provider>
        </UsersStateContext.Provider>
    );
}

export function useUserSettings() {
    const state = useContext(UsersStateContext);
    const updater = useContext(UsersUpdaterContext);

    if (!state || !updater) {
        throw new Error('useUserSettings must be used within a UsersSettingsProvider');
    }

    return { state, updater };
}
