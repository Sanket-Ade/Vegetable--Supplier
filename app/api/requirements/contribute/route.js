// import dbConnect from '@/lib/dbConnect';
// import Requirement from '@/Models/Requirement';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//     try {
//         await dbConnect();
//         const { requirementId, contributedQuantity } = await req.json();

//         const requirement = await Requirement.findById(requirementId);
//         if (!requirement) {
//             return NextResponse.json({ success: false, error: "Requirement not found" }, { status: 404 });
//         }

//         // Subtract the contribution
//         const newQuantity = requirement.quantityNeeded - contributedQuantity;
        
//         requirement.quantityNeeded = Math.max(0, newQuantity);
        
//         // If everything is met, close the requirement
//         if (requirement.quantityNeeded === 0) {
//             requirement.status = 'fulfilled';
//         }

//         await requirement.save();

//         return NextResponse.json({ 
//             success: true, 
//             message: "Contribution recorded!", 
//             remaining: requirement.quantityNeeded 
//         });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
// }

//
// import dbConnect from '@/lib/dbConnect';
// import Requirement from '@/Models/Requirement';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//     try {
//         await dbConnect();
//         // Added farmerName and phoneNumber to the destructuring
//         const { requirementId, contributedQuantity, farmerId, farmerName, phoneNumber } = await req.json();

//         const requirement = await Requirement.findById(requirementId);
//         if (!requirement) {
//             return NextResponse.json({ success: false, error: "Requirement not found" }, { status: 404 });
//         }

//         // 1. Store the specific contribution details
//         requirement.contributions.push({
//             farmerId,
//             farmerName,
//             phoneNumber,
//             quantity: contributedQuantity,
//             date: new Date()
//         });

//         // 2. Subtract the quantity
//         const newQuantity = requirement.quantityNeeded - contributedQuantity;
//         requirement.quantityNeeded = Math.max(0, newQuantity);
        
//         // 3. Status logic: If ANY contribution is made, it shows as fulfilled/sourced
//         // You can keep it as 'fulfilled' or use a logic that 0 means fulfilled
//         if (requirement.quantityNeeded === 0) {
//             requirement.status = 'fulfilled';
//         }

//         await requirement.save();

//         return NextResponse.json({ 
//             success: true, 
//             message: "Contribution recorded!", 
//             remaining: requirement.quantityNeeded 
//         });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
// }

// import dbConnect from '@/lib/dbConnect';
// import Requirement from '@/Models/Requirement';
// import { NextResponse } from 'next/server';


//   export async function POST(req) {
//     try {
//         await dbConnect();
//         const { requirementId, contributedQuantity, farmerId, farmerName, phoneNumber } = await req.json();

//         const requirement = await Requirement.findById(requirementId);
//         if (!requirement) {
//             return NextResponse.json({ success: false, error: "Requirement not found" }, { status: 404 });
//         }

//         // Safety check for the array
//         if (!requirement.contributions) {
//             requirement.contributions = [];
//         }

//         // 1. Add Farmer Details
//         requirement.contributions.push({
//             farmerId,
//             farmerName,
//             phoneNumber,
//             quantity: contributedQuantity,
//             date: new Date()
//         });

//         // 2. Update Quantity
//         requirement.quantityNeeded = Math.max(0, requirement.quantityNeeded - contributedQuantity);
        
//         if (requirement.quantityNeeded === 0) {
//             requirement.status = 'fulfilled';
//         }

//         // CRITICAL CHANGE: Use { validateBeforeSave: false } 
//         // This allows you to update old records that might be missing the "category" field
//         await requirement.save({ validateBeforeSave: false });

//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error("Contribution Error:", error);
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
// }

import dbConnect from '@/lib/dbConnect';
import Requirement from '@/models/Requirement';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const { requirementId, contributedQuantity, farmerId, farmerName, phoneNumber } = await req.json();

        const requirement = await Requirement.findById(requirementId);
        if (!requirement) {
            return NextResponse.json({ success: false, error: "Requirement not found" }, { status: 404 });
        }

        // Safety check for the array
        if (!requirement.contributions) {
            requirement.contributions = [];
        }

        // 1. Add Farmer Details to the ledger
        requirement.contributions.push({
            farmerId,
            farmerName,
            phoneNumber,
            quantity: Number(contributedQuantity),
            date: new Date()
        });

        // 2. Update tracking fields
        // Increment the total amount fulfilled so far
        requirement.quantityFulfilled = (requirement.quantityFulfilled || 0) + Number(contributedQuantity);
        
        // Decrease the remaining quantity needed (but don't go below 0)
        requirement.quantityNeeded = Math.max(0, requirement.quantityNeeded - Number(contributedQuantity));
        
        // 3. Status Update Logic
        // If remaining needed is 0, mark as fulfilled
        if (requirement.quantityNeeded === 0) {
            requirement.status = 'fulfilled';
        }

        // Save the changes
        // Using { validateBeforeSave: false } to maintain compatibility with older records
        await requirement.save({ validateBeforeSave: false });

        return NextResponse.json({ 
            success: true, 
            currentStatus: requirement.status,
            remaining: requirement.quantityNeeded 
        });
    } catch (error) {
        console.error("Contribution Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}