import dbConnect from '@/lib/dbConnect';
import User from '@/Models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const { phoneNumber } = await req.json();
        
        // Match the schema field 'phoneNumber'
        const user = await User.findOne({ 
            $or: [
                { phoneNumber: phoneNumber },
                { phoneNumber: `+91${phoneNumber}` }
            ]
        });

        if (user) {
            return new Response(JSON.stringify({ 
                exists: true, 
                user: { 
                    name: user.name, 
                    phone: user.phoneNumber, // Return as 'phone' for frontend consistency
                    id: user._id.toString() 
                } 
            }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ exists: false }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error("Check User Error:", error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}