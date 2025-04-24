import {createClient} from "@/lib/supabase/client";

export async function loginWithGoogle() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
                nonce: '<NONCE>',
                // scope: 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.addresses.read',
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        },
    })

}