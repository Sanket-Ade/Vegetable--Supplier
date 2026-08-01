import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const { storeName, email, password, phoneNumber, address } = await req.json();

        // 1. Check if user already exists (by email or phone)
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phoneNumber }] 
        });

        if (existingUser) {
            return NextResponse.json({ 
                success: false, 
                error: "A shop or farmer with this email/phone already exists." 
            }, { status: 400 });
        }

        // 2. Hash the password for shopkeeper security
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create the Shopkeeper using your EXISTING schema
        const newStore = new User({
            name: storeName, // We use 'name' to store the Shop Name
            email: email,
            phoneNumber: phoneNumber,
            password: hashedPassword,
            address: address,
            role: 'shopkeeper' // This matches your enum
        });

        await newStore.save();

        return NextResponse.json({ 
            success: true, 
            message: "Shop registered successfully!" 
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}