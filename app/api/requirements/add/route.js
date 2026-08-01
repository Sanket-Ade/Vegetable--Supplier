import dbConnect from '@/lib/dbConnect';
import Requirement from '@/models/Requirement';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        
        // Log to your VS Code terminal to see what the frontend is sending
        console.log("Requirement Payload:", body);

        // Map the fields clearly to your Requirement Model
        const newRequirement = new Requirement({
            storeId: body.storeId,
            itemName: body.itemName,
            category: body.category || 'Vegetables', // Default if missing
            quantityNeeded: Number(body.quantityNeeded), // Ensure it's a number
            targetPrice: Number(body.targetPrice),
            status: 'open'
        });

        const savedReq = await newRequirement.save();
        
        return NextResponse.json({ 
            success: true, 
            message: "Requirement live!", 
            requirement: savedReq 
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}