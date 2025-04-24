import {NextResponse} from 'next/server'
// The client you created from the Server-Side Auth instructions
import {createClient} from '@/lib/supabase/server'
import {getRandomName} from "@/lib/utils";

export async function PUT(request: Request) {
    const channel = await request.json()
    try{
        const supabase = await createClient()
        const {
            data: {user},
        } = await supabase.auth.getUser()
        let {data: channels, error} = await supabase.from('channels').update({'status':channel.status}).eq('created_by', user!.id).eq('name',channel.name).select('*');
        if(error){
            return new Response(JSON.stringify(error.message), { status: 500 });
        }
        if (channels && channels.length>0) {
            channel.isHost = channels[0].created_by === user!.id;
            return NextResponse.json(channels[0]);
        } else {
            return new Response(JSON.stringify('No Channel Found'), { status: 400 });
        }
    }catch(err:any) {
        console.error(err)
        return new Response(JSON.stringify(err.message), { status: 400 });
    }
}
export async function DELETE(request: Request) {
    const channel = await request.json()
    try{
        const supabase = await createClient()
        const {
            data: {user},
        } = await supabase.auth.getUser()
        if(channel.name){
            let {error} = await supabase.from('channels').delete().eq('created_by', user!.id).eq('name',channel.name);
            if(error){
                return new Response(JSON.stringify(error.message), { status: 500 });
            }
        }else {
            let {error} = await supabase.from('channels').delete().eq('created_by', user!.id)
            if(error){
                return new Response(JSON.stringify(error.message), { status: 500 });
            }
        }

        return NextResponse.json(`${channel.name} deleted`);
    }catch(err) {
        return new Response(JSON.stringify(err), { status: 400 });
    }
}
export async function POST(request: Request) {
    try{
        const supabase = await createClient()
        const {
            data: {user},
        } = await supabase.auth.getUser()
        let {data: exchannels, error} = await supabase.from('channels').select('*').eq('created_by', user!.id);
        //console.log(exchannels);
        if(exchannels && exchannels.length>0 && !error) {
            let {data: myChannel, error} = await supabase.from('channels').update({'status': 'CREATED'}).eq('created_by', user!.id).select('*').single();
            if(myChannel){
                myChannel.isHost = myChannel.created_by === user!.id;
                return NextResponse.json(myChannel);
            }
            exchannels[0].isHost = exchannels[0].created_by === user!.id;
            return NextResponse.json(exchannels[0]);
        }else {
            const channelInput = {name: getRandomName(), created_by: user!.id,status: 'CREATED'};
            let {data: channels, error} = await supabase.from('channels').insert([channelInput]).select();
            if(error) return  new Response(JSON.stringify(error.message), { status: 500 });
            if (channels && channels.length>0) {
                channels[0].isHost = channels[0].created_by === user!.id;
                return NextResponse.json(channels[0]);
            } else {
                return new Response(JSON.stringify('No Channel Found'), { status: 400 });
            }
        }
    }catch(err:any) {
        console.error(err)
        return new Response(JSON.stringify(err.message), { status: 400 });
    }
}
export async function GET(request: Request) {
    try {
        // Extract the query parameters from the request URL
        const url = new URL(request.url);
        const channelName = url.searchParams.get("name");

        if (!channelName) {
            return new Response(JSON.stringify({ error: "Channel name is required" }), { status: 400 });
        }

        // Create Supabase client
        const supabase = await createClient()

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
            return new Response(JSON.stringify({ error: "Authentication failed" }), { status: 401 });
        }

        // Fetch channel data
        const { data: channels, error: channelError } = await supabase
            .from("channels")
            .select("*")
            .eq("name", channelName);

        if (channelError) {
            return new Response(JSON.stringify({ error: channelError.message }), { status: 500 });
        }

        if (!channels || channels.length === 0) {
            return new Response(JSON.stringify({ error: "No Channel Found" }), { status: 404 });
        }

        const randomChannel = channels[0];
        randomChannel.isHost = randomChannel.created_by === user!.id;

        return NextResponse.json(randomChannel);
    } catch (err) {
        console.error("Error fetching channel:", err);
        return new Response(JSON.stringify({ error: "An unexpected error occurred" }), { status: 500 });
    }
}