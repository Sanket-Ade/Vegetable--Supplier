// import dbConnect from '@/lib/dbConnect';
// import Product from '@/Models/Product';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//     try {
//         await dbConnect();
//         const { searchParams } = new URL(req.url);
//         const farmerId = searchParams.get('farmerId');

//         // Safety check for valid ID
//         if (!farmerId || farmerId === 'undefined' || farmerId === 'null') {
//             return NextResponse.json({ success: false, error: "Farmer ID is required" }, { status: 400 });
//         }

//         // Fetch crops only for this farmer, sorted by newest first
//         const crops = await Product.find({ farmerId }).sort({ createdAt: -1 });

//         return NextResponse.json({ success: true, crops });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
// }

import dbConnect from '@/lib/dbConnect';
import Product from '@/Models/Product';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(req.url);
        const farmerId = searchParams.get('farmerId');

        // Safety check: Next.js sometimes passes string 'undefined' during hydration
        if (!farmerId || farmerId === 'undefined' || farmerId === 'null') {
            return NextResponse.json({ 
                success: false, 
                error: "A valid Farmer ID is required to fetch crops." 
            }, { status: 400 });
        }

        // Fetch products where the farmerId matches the logged-in user
        // We also ensure we return an empty array [] if nothing is found instead of null
        const crops = await Product.find({ farmerId })
            .sort({ createdAt: -1 })
            .lean(); // .lean() makes the query faster by returning plain JS objects

        return NextResponse.json({ 
            success: true, 
            count: crops.length,
            crops: crops || [] 
        });

    } catch (error) {
        console.error("Error fetching farmer crops:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Server Error: " + error.message 
        }, { status: 500 });
    }
}