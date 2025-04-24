import {createBrowserClient} from '@supabase/ssr'
import {createClient as creatSClient} from '@supabase/supabase-js'
import {UserStorageService} from "@/lib/class/user-storage-service";

export const supabase = createClient();

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
}
export const storageService = new UserStorageService({
    supabaseUrl:  process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    bucketName: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!
})