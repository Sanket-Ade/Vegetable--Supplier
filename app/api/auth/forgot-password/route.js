import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();
        const user = await User.findOne({ email, role: 'shopkeeper' });

        if (!user) return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });

        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.resetOTPExpires = Date.now() + 600000; // Valid for 10 mins
        await user.save();

        // 2. Setup Nodemailer
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
        // });
        // Inside your forgot-password route.js
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: 'sanketadex@gmail.com', // Hardcode your email here
                pass: 'fzvlbqeodfstwojo' // Hardcode the 16-char code here (NO SPACES)
            }
        });
        // 3. Send Email
        await transporter.sendMail({
            from: `"Vege Support" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Your Password Reset OTP",
            html: `<div style="font-family: sans-serif; text-align: center;">
                    <h2>Password Reset</h2>
                    <p>Your OTP for resetting your password is:</p>
                    <h1 style="color: #1b4332; letter-spacing: 5px;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                  </div>`
        });

        return NextResponse.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}