'use client';

import React from "react";
import {useParams} from "next/navigation";
import {ChannelProvider} from "@/context/channel-context";
import Meet from "@/app/(client)/app/room/[channelName]/page.main";
import {User} from "@supabase/supabase-js";
import {UsersSettingsProvider} from "@/context/user-state-context";
import UsersConnectionProvider from "@/context/user-connection-context";

interface MeetClientProps{
    user: User
}
const MeetClient = ({user}:MeetClientProps) => {
    const params = useParams();
    const channelName = Array.isArray(params.channelName) ? params.channelName[0] : params.channelName;


    if (!channelName) {
        return <div>Error: Channel name is required</div>;
    }

    return (
        <ChannelProvider channelName={channelName}>
            <UsersSettingsProvider>
                    <Meet user={user}/>
            </UsersSettingsProvider>
        </ChannelProvider>
    );
};

export default MeetClient;
