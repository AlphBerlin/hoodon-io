import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {createClient} from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    // const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/'
    const supabase = await createClient()

    const {
        data: {user},
    } = await supabase.auth.getUser()
    if (!user) {
        console.error('Auth callback error:', user)
        return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
    }

    return NextResponse.redirect(`${origin}${next}`)
}
