'use client';

import { createClient } from "@/lib/supabase/client";
import MatchMakerClient from "@/app/(client)/cupid/page.main";
import { ChannelProvider } from "@/context/channel-context";
import { UsersSettingsProvider } from "@/context/user-state-context";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {createMyChannel, getAvailableChannel, updateChannel} from "@/lib/channel-api-handler";
import {useUser} from "@/context/user-context";
import {Channel} from "@/types/database";
import {withUser} from "@/components/with-user";
import LoadingMiniGame from "@/components/loading-mini-game";

function CupidPage() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Extract channel name from query parameters
    const [channelName, setChannelName] = useState<string | null>(searchParams.get('ch'));
    const [channel, setChannel] = useState<Channel>();
    const {user} = useUser();

    useEffect(() => {
        setChannelName(searchParams.get('ch'))
    }, [searchParams]);

    useEffect(() => {
        if (!channelName) {
            const fetchChannelName = async () => {
                const data = await createMyChannel();
                if (data && data.name) {
                    setChannel(data);
                    router.push(`/cupid/?ch=${data.name}`);
                } else {
                    throw new Error("Invalid response format");
                }
            };
            fetchChannelName();
        }
        return () => {
            if(channel && channel.isHost){
                updateChannel({id:channel.id ,name:channel.name,status:'IDLE'})
            }
        }
    }, [channelName,router]);

    if (!channelName || !user) {
        return <LoadingMiniGame />; // Add a loading state
    }

    return (
        <ChannelProvider channelName={channelName}>
            <UsersSettingsProvider>
                <MatchMakerClient user={user} />
            </UsersSettingsProvider>
        </ChannelProvider>
    );
}

export default function Page(){

    const AuthenticatedCupid = withUser(CupidPage);
    return <AuthenticatedCupid />;
};