import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    //console.log(request.url + "invoked")
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    let { data: users, error } = await supabase
        .from('users')
        .select("*")
        .eq('user_id', user!.id)
    if(users?.length == 0){
        return new Response('No User Profile Found', { status: 400 });
    }
    if(users!.length>1){
        return new Response(JSON.stringify({ error: 'Invalid Request' }), { status: 400 });
    }
    return new Response(JSON.stringify( users![0]), { status: 200 });

}

export async function POST(request: Request) {
    try {
        //console.log(request.url + "invoked")

        const supabase = await createClient()
        const userI = await request.json(); // Ensure body is parsed as JSON

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
            return new Response(JSON.stringify({ error: authError.message }), { status: 401 });
        }
        userI.user_id = user!.id

        // Insert data into the 'users' table
        const { data, error } = await supabase
            .from('users')
            .insert([userI])
            .select();

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
        return new Response(JSON.stringify(data), { status: 201 });
    } catch (err) {
        console.error('Error in POST API:', err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
