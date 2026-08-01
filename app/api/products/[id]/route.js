// import dbConnect from '@/lib/dbConnect';
// import Product from '@/Models/Product';
// import { NextResponse } from 'next/server';

// export async function DELETE(req, { params }) {
//     try {
//         await dbConnect();
//         // params.id comes from the folder name [id]
//         const { id } = params;
//         await Product.findByIdAndDelete(id);
//         return NextResponse.json({ success: true, message: "Listing deleted" });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
// }

import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        
        // Next.js 15+ requirement: params must be awaited
        const { id } = await params; 

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Listing deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}