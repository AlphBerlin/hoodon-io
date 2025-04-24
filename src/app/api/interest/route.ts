import { NextResponse } from 'next/server';
import {createClient} from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: interests, error } = await supabase
            .from('interests')
            .select('*');

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch interests' },
                { status: 500 }
            );
        }

        const categorizedInterests = interests.reduce((acc, interest) => {
            const { category, name, id } = interest;

            if (!acc[category]) {
                acc[category] = [];
            }

            acc[category].push({ name, id });

            return acc;
        }, {} as Record<string, Array<{ name: string, id: number }>>);

        return NextResponse.json(categorizedInterests);
    } catch (error) {
        console.error('Error in interests API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}