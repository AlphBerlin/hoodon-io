import { updateSession } from '@/lib/supabase/middleware'
import {NextRequest, NextResponse} from "next/server";
import {publicRoutes} from "@/config/routes";

export async function middleware(request:NextRequest) {
    //console.log("inside middleware");
    const { pathname } = request.nextUrl;


    const isPublicRoute = publicRoutes.some((route) => {
        const regex = new RegExp(`^${route.replace('[id]', '[^/]+')}$`);
        return regex.test(pathname);
    });
    //console.log('isPublicRoute',isPublicRoute, pathname);
    if (isPublicRoute) {
        return NextResponse.next();
    }
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}