import dbConnect from '@/lib/dbConnect';
import User from '@/Models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, error: "Invalid Email or Password" }, { status: 401 });
        }

        // 2. Check Role (Safety check: Farmers shouldn't login through store portal)
        if (user.role !== 'shopkeeper') {
            return NextResponse.json({ success: false, error: "Unauthorized. This is a Shopkeeper portal." }, { status: 403 });
        }

        // 3. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: "Invalid Email or Password" }, { status: 401 });
        }

        // 4. Return success
        return NextResponse.json({ 
            success: true, 
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name, // This is the Shop Name as we saved it
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}