import { NextResponse } from 'next/server';
import {createClient} from "@/lib/supabase/server";

// Get current user profile
export async function GET() {
    try {
        const supabase = await createClient();

        // Get current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch profile with related data
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`
        *,
        interests: profile_interests (
          interests (
            id,
            name,
            category
          )
        ),
        profile_images (
          id,
          image_url,
          is_primary
        )
      `)
            .eq('user_id', session.user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            return NextResponse.json(
                { error: 'Failed to fetch profile' },
                { status: 400 }
            );
        }

        // Transform the data structure
        const transformedProfile = profile ? {
            ...profile,
            interests: profile.interests?.map((i : any) => i.interests) || [],
            images: profile.profile_images || []
        } : null;

        return NextResponse.json(transformedProfile);

    } catch (error) {
        console.error('Route error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Create or update user profile
export async function POST(request: Request) {
    try {
        const supabase =  await createClient()
        const body = await request.json();

        // Get current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if profile exists
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

        let profileId: string;

        // If profile doesn't exist, create new profile
        if (!existingProfile) {
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    user_id: session.user.id,
                    display_name: body.display_name,
                    bio: body.bio,
                    gender: body.gender,
                    birth_date: body.birth_date,
                    location: body.location
                })
                .select('id')
                .single();

            if (createError) {
                console.error('Profile creation error:', createError);
                return NextResponse.json(
                    { error: 'Failed to create profile' },
                    { status: 500 }
                );
            }

            profileId = newProfile.id;
        } else {
            // Update existing profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    display_name: body.display_name,
                    bio: body.bio,
                    gender: body.gender,
                    birth_date: body.birth_date,
                    location: body.location,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingProfile.id);

            if (updateError) {
                console.error('Profile update error:', updateError);
                return NextResponse.json(
                    { error: 'Failed to update profile' },
                    { status: 500 }
                );
            }

            profileId = existingProfile.id;
        }

        // Handle interests if provided
        if (body.interests?.length > 0) {
            // Remove existing interests
            await supabase
                .from('profile_interests')
                .delete()
                .eq('profile_id', profileId);

            // Add new interests
            const { error: interestsError } = await supabase
                .from('profile_interests')
                .insert(
                    body.interests.map((interestId: string) => ({
                        profile_id: profileId,
                        interest_id: interestId
                    }))
                );

            if (interestsError) {
                console.error('Interests update error:', interestsError);
            }
        }

        // Handle images if provided
        if (body.images?.length > 0) {
            // If updating images, first delete existing ones
            if (existingProfile) {
                await supabase
                    .from('profile_images')
                    .delete()
                    .eq('profile_id', profileId);
            }

            // Add new images
            const { error: imagesError } = await supabase
                .from('profile_images')
                .insert(
                    body.images.map((image: { url: string; is_primary: boolean }) => ({
                        profile_id: profileId,
                        image_url: image.url,
                        is_primary: image.is_primary
                    }))
                );

            if (imagesError) {
                console.error('Images update error:', imagesError);
            }
        }

        // Fetch updated profile
        const { data: updatedProfile, error: fetchError } = await supabase
            .from('profiles')
            .select(`
        *,
        interests: profile_interests (
          interests (
            id,
            name,
            category
          )
        ),
        profile_images (
          id,
          image_url,
          is_primary
        )
      `)
            .eq('id', profileId)
            .single();

        if (fetchError) {
            console.error('Profile fetch error:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch updated profile' },
                { status: 500 }
            );
        }

        // Transform the response data
        const transformedProfile = {
            ...updatedProfile,
            interests: updatedProfile.interests?.map((i:any) => i.interests) || [],
            images: updatedProfile.profile_images || []
        };

        return NextResponse.json(transformedProfile);

    } catch (error) {
        console.error('Route error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}