import {createClient} from "@/lib/supabase/server";
import MeetClient from "@/app/(client)/app/room/[channelName]/page.client";

export default async function VideoCallPageServer() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return <MeetClient user={user}/>;
}