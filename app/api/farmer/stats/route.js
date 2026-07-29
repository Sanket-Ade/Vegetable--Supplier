import dbConnect from '@/lib/dbConnect';
import Product from '@/Models/Product';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const farmerId = searchParams.get('farmerId');

        // SAFETY CHECK: Prevent querying with invalid or string-form 'undefined'
        if (!farmerId || farmerId === 'undefined' || farmerId === 'null') {
            return NextResponse.json({ 
                success: false, 
                error: "Valid Farmer ID is required" 
            }, { status: 400 });
        }

        const activeCount = await Product.countDocuments({ 
            farmerId, 
            status: 'available' 
        });

        const totalCount = await Product.countDocuments({ farmerId });

        return NextResponse.json({ 
            success: true, 
            activeCrops: activeCount,
            totalHistory: totalCount
        });
    } catch (error) {
        // ALWAYS return JSON, never an empty response
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}