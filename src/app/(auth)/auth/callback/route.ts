import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
    //console.log('callbacked')
    const requestUrl = new URL(request.url)

    try {
        const code = requestUrl.searchParams.get('code')
        const next = requestUrl.searchParams.get('next') ?? '/cupid'
        const supabase = await createClient()

        // For OAuth and email sign-in flows
        if (code) {
            const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

            if (sessionError) {
                console.error('Session error:', sessionError)
                return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
            }
        }

        // Verify the user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            console.error('User error:', userError)
            return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
        }

        return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
    }
}