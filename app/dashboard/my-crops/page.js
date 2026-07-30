// "use client";
// import React, { useEffect, useState } from 'react';
// import { useAuth } from "@/context/AuthContext";
// import { Package, Trash2, Tag, LayoutGrid, Loader2 } from 'lucide-react';

// const MyCrops = () => {
//     const { user } = useAuth();
//     const [crops, setCrops] = useState([]); 
//     const [loading, setLoading] = useState(true);

//     const fetchMyCrops = async () => {
//         if (!user?.id) return;
        
//         try {
//             const res = await fetch(`/api/products/user?farmerId=${user.id}`);
//             const data = await res.json();
            
//             if (data.success && data.crops) {
//                 setCrops(data.crops);
//             } else {
//                 setCrops([]);
//             }
//         } catch (err) {
//             console.error("Error fetching crops:", err);
//             setCrops([]); 
//         } finally {
//             setLoading(false);
//         }
//     };

//     // NEW: Handle Delete Function
//     const handleDelete = async (productId) => {
//         if (!confirm("Are you sure you want to remove this listing?")) return;

//         try {
//             const res = await fetch(`/api/products/${productId}`, {
//                 method: 'DELETE',
//             });
//             const data = await res.json();

//             if (data.success) {
//                 // Update local state to remove the item immediately without refresh
//                 setCrops(crops.filter(crop => crop._id !== productId));
//                 alert("Listing removed successfully!");
//             } else {
//                 alert("Error: " + data.error);
//             }
//         } catch (err) {
//             console.error("Delete error:", err);
//             alert("Failed to delete the listing.");
//         }
//     };

//     useEffect(() => {
//         fetchMyCrops();
//     }, [user?.id]);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//                 <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-2" />
//                 <p className="text-gray-500 font-medium">Loading your crops...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-6 mt-[65px]">
//             <div className="max-w-6xl mx-auto">
//                 <header className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//                              My Listed Crops
//                         </h1>
//                         <p className="text-gray-500">Manage the items you have available for stores.</p>
//                     </div>
//                     <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm">
//                         Total: {crops?.length || 0}
//                     </div>
//                 </header>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {Array.isArray(crops) && crops.length > 0 ? crops.map((crop) => (
//                         <div key={crop._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
//                             <div className="flex justify-between items-start mb-4">
//                                 <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
//                                     {crop.category || "Vegetable"}
//                                 </span>
//                                 <p className="text-2xl font-black text-emerald-600">₹{crop.price}</p>
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-800 mb-2">{crop.name}</h3>
//                             <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
//                                 <Package size={16} /> 
//                                 <span>Quantity: <b className="text-gray-700">{crop.quantity} kg</b></span>
//                             </div>
//                             {/* UPDATED: Added onClick calling handleDelete */}
//                             <button 
//                                 onClick={() => handleDelete(crop._id)}
//                                 className="w-full py-3 bg-gray-50 text-red-500 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
//                             >
//                                 <Trash2 size={16} /> Remove Listing
//                             </button>
//                         </div>
//                     )) : (
//                         <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
//                              <Package size={48} className="mx-auto text-gray-300 mb-4" />
//                              <p className="text-gray-400 font-medium">You haven't added any crops yet.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyCrops;

export default function MyCropsPage() {
  return (
    <div>
      <h1>My Crops</h1>
    </div>
  );
}