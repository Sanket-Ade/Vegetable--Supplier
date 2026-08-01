import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, otp, newPassword } = await req.json();

        const user = await User.findOne({ 
            email, 
            resetOTP: otp, 
            resetOTPExpires: { $gt: Date.now() } 
        });

        if (!user) return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });

        // Hash new password and clear OTP fields
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: "Password reset successful" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}