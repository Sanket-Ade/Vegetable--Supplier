import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Create the product in MongoDB
        const newProduct = await Product.create({
            farmerId: body.farmerId,
            name: body.name,
            category: body.category,
            quantity: body.quantity,
            pricePerUnit: body.pricePerUnit,
            marketPriceAtListing: body.marketPriceAtListing, // Saving the avg for history
            status: 'available'
        });

        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    } catch (error) {
        console.error("Add Product Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}