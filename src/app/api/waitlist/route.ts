import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'


export async function POST(request: Request) {
    try {
        //console.log(request.url + "invoked")

        const supabase = await createClient()
        const waitlist = await request.json();

        //console.log(waitlist)
        // Insert data into the 'users' table
        const { data, error } = await supabase
            .from('waitlist')
            .insert([waitlist])
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
