import { cookies } from "next/headers";
import AuthButtonClient from "./auth-button-client";
import {createClient} from "@/lib/supabase/server";

export default async function AuthButtonServer() {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return <AuthButtonClient session={session} />;
}