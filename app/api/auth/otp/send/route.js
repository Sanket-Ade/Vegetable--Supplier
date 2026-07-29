import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// This MUST be named POST (all caps)
export async function POST(request) {
    await dbConnect();
    try {
        const { phoneNumber } = await request.json();
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
        }

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = generatedOtp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        console.log(`🔑 OTP for ${phoneNumber}: ${generatedOtp}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}