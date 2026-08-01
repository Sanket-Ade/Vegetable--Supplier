import dbConnect from '@/lib/dbConnect';
import Schedule from '@/models/Schedule';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const schedule = await Schedule.create(body);
        return NextResponse.json({ success: true, schedule });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const farmerId = searchParams.get('farmerId');
        const schedules = await Schedule.find({ farmerId });
        return NextResponse.json({ success: true, schedules });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}