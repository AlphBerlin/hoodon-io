// app/api/hood/upload/route.ts
import { NextResponse } from 'next/server';
import {prisma} from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const hood = await prisma.hoods.create({
            data: body
        });
        return Response.json({});
    } catch (error: any) {
        console.error('Hood upload error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
