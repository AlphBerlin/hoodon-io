"use client";

import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {Session} from "@supabase/auth-js";

export default function AuthButtonClient({
                                             session,
                                         }: {
    session: Session | null;
}) {
    const supabase = createClient();
    const router = useRouter();

    return session ? (
        <a href="/dashboard"
           className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition">application</a>

    ) : (
        <>
            <a href="/login"
               className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition">Login</a>
            <a href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Sign
                Up</a>
        </>
    );
}