// import dbConnect from '@/lib/dbConnect';
// import User from '@/Models/User';
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
//     try {
//         await dbConnect();

//         const { phoneNumber, password } = await req.json();
//         const cleanPhone = phoneNumber.trim();

//         // 1. Find user using 'phoneNumber' to match your Schema
//         const user = await User.findOne({ 
//             $or: [
//                 { phoneNumber: cleanPhone },
//                 { phoneNumber: `+91${cleanPhone}` }
//             ]
//         });

//         if (!user) {
//             return new Response(JSON.stringify({ 
//                 success: false, 
//                 error: "User not found! Please register first." 
//             }), { 
//                 status: 404,
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         }

//         // 2. Compare the entered password with the hashed password in DB
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return new Response(JSON.stringify({ 
//                 success: false, 
//                 error: "Invalid password. Please try again." 
//             }), { 
//                 status: 401,
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         }

//         // 3. Success! Return the user object for the AuthContext
//         return new Response(JSON.stringify({ 
//             success: true, 
//             user: { 
//                 name: user.name, 
//                 phone: user.phoneNumber, 
//                 id: user._id.toString(),
//                 role: user.role 
//             } 
//         }), { 
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }
//         });

//     } catch (error) {
//         console.error("Login Error:", error);
//         return new Response(JSON.stringify({ 
//             success: false, 
//             error: "Server error. Please try again later." 
//         }), { 
//             status: 500,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     }
// }
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await dbConnect();

        const { phoneNumber, password } = await req.json();
        const cleanPhone = phoneNumber.trim();

        // 1. Find the user by phoneNumber (matching your DB field)
        const user = await User.findOne({ 
            $or: [
                { phoneNumber: cleanPhone },
                { phoneNumber: `+91${cleanPhone}` }
            ]
        });

        if (!user) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: "User not found." 
            }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        // 2. IMPORTANT: Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: "Invalid password." 
            }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // 3. Send back success
        return new Response(JSON.stringify({ 
            success: true, 
            user: { 
                name: user.name, 
                phone: user.phoneNumber, 
                id: user._id.toString(),
                role: user.role 
            } 
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Login Error:", error);
        return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
    }
}