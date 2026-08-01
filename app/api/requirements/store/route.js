import dbConnect from '@/lib/dbConnect';
import Requirement from '@/models/Requirement';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const storeId = searchParams.get('storeId');

        if (!storeId) {
            return NextResponse.json({ success: false, error: "Store ID required" }, { status: 400 });
        }

        const requirements = await Requirement.find({ storeId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, requirements });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}