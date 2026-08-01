import dbConnect from '@/lib/dbConnect';
import Requirement from '@/models/Requirement';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: "ID missing" }, { status: 400 });

        await Requirement.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}