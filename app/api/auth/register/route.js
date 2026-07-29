// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs'; // Optional: npm install bcryptjs to encrypt passwords

// export async function POST(request) {
//     await dbConnect();
//     try {
//         const body = await request.json();
//         const { name, email, phoneNumber, password, role, address } = body;

//         // 1. Check if user already exists
//         const existingUser = await User.findOne({ phoneNumber });
//         if (existingUser) {
//             return NextResponse.json({ error: "User already exists with this phone number" }, { status: 400 });
//         }

//         // 2. Hash password if provided (for Store Owners)
//         let hashedPassword = password;
//         if (password) {
//             const salt = await bcrypt.genSalt(10);
//             hashedPassword = await bcrypt.hash(password, salt);
//         }

//         // 3. Create the user in Compass
//         const newUser = await User.create({
//             name,
//             email,
//             phoneNumber,
//             password: hashedPassword,
//             role,
//             address
//         });

//         return NextResponse.json({ success: true, data: newUser }, { status: 201 });
//     } catch (error) {
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }
// }


import dbConnect from '@/lib/dbConnect';
import User from '@/Models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    await dbConnect();

    try {
        const body = await request.json();
        
        // Destructure the exact keys being sent by your frontend
        const { name, email, phoneNumber, password, address, role } = body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ phoneNumber }, { email }] 
        });
        
        if (existingUser) {
            return NextResponse.json({ error: "User already registered with this phone or email!" }, { status: 400 });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create the user
        const newUser = await User.create({
            name,            // This will be your Store Name
            email: email || undefined,
            phoneNumber,     // This must match 'phoneNumber' in your User.js model
            password: hashedPassword,
            address,
            role: role || 'shopkeeper'
        });

        return NextResponse.json({ success: true, message: "Registration successful!" }, { status: 201 });

    } catch (error) {
        console.error("Registration API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}