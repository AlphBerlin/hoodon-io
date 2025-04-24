import {createClient} from "@/lib/supabase/server";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        //console.log(request.url + " invoked");
        const supabase = await createClient();
        const interestIds: string[] = await request.json();

        // Get current user's profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select("id")
            .single();

        if (profileError) {
            console.error(profileError)
            return NextResponse.json(
                { error: 'User profile not found' },
                { status: 404 }
            );
        }

        // Begin transaction by removing existing interests
        const { error: deleteError } = await supabase
            .from('profile_interests')
            .delete()
            .eq('profile_id', profile.id);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Failed to remove existing interests' },
                { status: 400 }
            );
        }

        // Prepare new profile interests array
        const profileInterests = interestIds.map(interestId => ({
            profile_id: profile.id,
            interest_id: interestId
        }));

        // Insert new interests
        const { data, error: insertError } = await supabase
            .from('profile_interests')
            .insert(profileInterests)
            .select();

        if (insertError) {
            return NextResponse.json(
                { error: insertError.message },
                { status: 400 }
            );
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error('Error in POST API:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}