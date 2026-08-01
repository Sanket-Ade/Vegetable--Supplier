      import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const cropName = searchParams.get('cropName');

        // Aggregate data to find the average price for this specific crop
        const stats = await Product.aggregate([
            { $match: { name: cropName, status: 'available' } },
            { 
                $group: { 
                    _id: "$name", 
                    avgPrice: { $avg: "$pricePerUnit" },
                    totalListings: { $count: {} }
                } 
            }
        ]);

        if (stats.length > 0) {
            return NextResponse.json({ 
                success: true, 
                avgPrice: Math.round(stats[0].avgPrice),
                count: stats[0].totalListings 
            });
        }

        // Fallback if no listings exist yet
        return NextResponse.json({ success: true, avgPrice: 0, count: 0 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}