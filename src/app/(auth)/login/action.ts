'use server'

import { createClient } from '@/lib/supabase/server'
interface LoginData {
    email: string
    password: string
}

export async function login(formData: LoginData) {
    const supabase = await createClient()

    const data = {
        email: formData.email as string,
        password: formData.password as string,
    }

    try{
        const { data: authData, error } = await supabase.auth.signInWithPassword(data)
        if (error) {
            return { user: null, error: error.message } // Pass a clear error message
        }
        return { user: authData.user, error: null }
    }catch (error:any) {
        console.error(error)
        return { user: null, error: error.message }
    }

    // Return both the user (if available) and the error
    // Provide user details if login is successful
}
