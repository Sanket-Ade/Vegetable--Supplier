// import dbConnect from '@/lib/dbConnect';
// import Requirement from '@/Models/Requirement';
// import User from '@/Models/User'; // Required for .populate()
// import { NextResponse } from 'next/server';

// export async function GET() {
//     try {
//         await dbConnect();
        
//         // Fetch open requirements and get Store details (name, phone, city)
//         const requirements = await Requirement.find({ status: 'open' })
//             .populate('storeId', 'name phoneNumber city')
//             .sort({ createdAt: -1 });

//         return NextResponse.json({ success: true, requirements });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
// }

import dbConnect from '@/lib/dbConnect';
import Requirement from '@/models/Requirement';
import User from '@/models/User'; // Required for .populate()
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();

        // Get storeId from URL query parameters
        const { searchParams } = new URL(req.url);
        const storeId = searchParams.get('storeId');

        let query = {};

        if (storeId) {
            // Logic for Store Dashboard: Show all requirements for this specific store
            query = { storeId: storeId };
        } else {
            // Logic for Farmer Feed: Show only open requirements across all stores
            query = { status: 'open' };
        }
        
        const requirements = await Requirement.find(query)
            .populate('storeId', 'name phoneNumber city')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, requirements });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}