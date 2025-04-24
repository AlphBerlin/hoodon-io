import {NextResponse} from 'next/server'
// The client you created from the Server-Side Auth instructions
import {createClient} from '@/lib/supabase/server'
import {getRandomName} from "@/lib/utils";

export async function GET(request: Request) {
    //console.log('getting available channel');
    try{
        const supabase = await createClient()
        const {
            data: {user},
        } = await supabase.auth.getUser()
        let {data: channels, error} = await supabase.from('channels').select('*').eq('status', 'AVAILABLE').neq('created_by', user!.id);
        let randomChannel: any;
        if (channels && channels.length>0) {
            randomChannel = channels[Math.floor(Math.random() * channels.length)];
        } else {
            return new Response(JSON.stringify('No Channels Available'), { status: 201 });
        }
        randomChannel.isHost = randomChannel.created_by === user!.id;
        return NextResponse.json(randomChannel);

    }catch(err) {
        return new Response(JSON.stringify(err), { status: 400 });
    }
}