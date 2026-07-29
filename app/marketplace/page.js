
"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Store, Phone, CheckCircle, Package, ArrowRight, X } from 'lucide-react';

const styles = `
//   @keyframes fadeInUp {
//     from { opacity: 0; transform: translateY(20px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); }
    70%  { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
    100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
  }
  @keyframes badgePop {
    from { transform: scale(0.7); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  @keyframes spinnerFade {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes dotBounce {
    0%, 100% { transform: translateY(0); opacity: 0.4; }
    50%       { transform: translateY(-6px); opacity: 1; }
  }

  .req-card {
    animation: fadeInUp 0.45s ease both;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .req-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.09);
  }
  .req-card:hover .contribute-btn {
    background-color: #059669;
  }
  .contribute-btn {
    transition: background-color 0.2s ease, transform 0.1s ease;
  }
  .contribute-btn:active { transform: scale(0.97); }
  .arrow-icon {
    transition: transform 0.2s ease;
  }
  .req-card:hover .arrow-icon {
    transform: translateX(4px);
  }

  .count-badge {
    animation: badgePop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.3s both;
  }

  .header-icon {
    animation: pulse-ring 2.8s infinite;
    border-radius: 50%;
  }

  .store-block {
    transition: background 0.2s;
  }
  .store-block:hover { background: #f0fdf4; }

  .category-badge {
    transition: background 0.2s, color 0.2s;
  }
  .category-badge:hover { background: #dbeafe; color: #1d4ed8; }

  .phone-link {
    transition: color 0.15s, letter-spacing 0.15s;
  }
  .phone-link:hover { color: #1d4ed8; letter-spacing: 0.02em; }

  .modal-overlay { animation: fadeIn 0.2s ease both; }
  .modal-box {
    animation: slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275) both;
  }

  .confirm-btn {
    transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
  }
  .confirm-btn:hover {
    background-color: #059669;
    box-shadow: 0 8px 24px rgba(16,185,129,0.3);
  }
  .confirm-btn:active { transform: scale(0.97); }

  .cancel-btn { transition: background 0.15s, transform 0.1s; }
  .cancel-btn:hover { background: #e5e7eb; }
  .cancel-btn:active { transform: scale(0.97); }

  .num-input:focus {
    border-color: #10b981 !important;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
  }

  .spinner-wrap { animation: spinnerFade 0.4s ease both; }

  .dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #10b981;
    margin: 0 3px;
    animation: dotBounce 0.9s ease infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.15s; }
  .dot:nth-child(3) { animation-delay: 0.3s; }

  .success-bar { animation: fadeIn 0.3s ease both; }
  .empty-card  { animation: fadeInUp 0.5s ease both; }
`;

const MarketplacePage = () => {
    const { user } = useAuth();
    const [requirements, setRequirements] = useState([]);
    const [selectedReq, setSelectedReq] = useState(null);
    const [contribution, setContribution] = useState("");
    const [loading, setLoading] = useState(true);
    const [successId, setSuccessId] = useState(null);

    const fetchRequirements = async () => {
        try {
            const res = await fetch('/api/requirements/all');
            const data = await res.json();
            if (data.success) setRequirements(data.requirements);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching requirements:", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequirements(); }, []);

    const handleContribute = async () => {
    if (!contribution || contribution <= 0) return alert("Enter a valid quantity");
    if (contribution > selectedReq.quantityNeeded) return alert("Contribution exceeds requirement!");

    try {
        const res = await fetch('/api/requirements/contribute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requirementId: selectedReq._id,
                farmerId: user.id, 
                farmerName: user.name, 
                phoneNumber: user.phone,
                contributedQuantity: Number(contribution)
            })
        });

        const data = await res.json();
        if (data.success) {
            setSuccessId(selectedReq._id);
            setTimeout(() => setSuccessId(null), 2200);
            setSelectedReq(null);
            setContribution("");
            fetchRequirements(); 
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert("Error updating requirement");
    }
};
    const closeModal = () => { setSelectedReq(null); setContribution(""); };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 mt-[65px] flex flex-col items-center justify-center gap-4 p-4">
            <style>{styles}</style>
            <div className="spinner-wrap flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-emerald-500" />
                <div className="flex items-center gap-1">
                    <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
                <p className="text-gray-400 text-sm tracking-wide">Fetching market demand...</p>
            </div>
        </div>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-blue-50/20 pt-[1px] mt-[65px] p-3 sm:p-4 md:p-6 lg:p-8 bg-[url('/store-registeration.png')] bg-no-repeat bg-center bg-cover">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-10 gap-4"
                        style={{ animation: 'fadeInUp 0.4s ease both' }}
                    >
                        <div className="w-full sm:w-auto sm:text-white">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <div className="p-2 bg-emerald-100 rounded-xl header-icon mb-[30px] mt-[30px] sm:mb-[50px]  flex-shrink-0">
                                    <Store className="text-emerald-600" size={22} />
                                </div>
                                <h1 className="text-xl mb-[40px] sm:text-2xl mt-[32px] mb-[30px] sm:mb-[50px] md:text-3xl font-bold text-gray-800 break-words">
                                    Market Demand Feed
                                </h1>
                            </div>
                        </div>
                        <div className="count-badge flex-shrink-0 ml-[2px] mt-[10px] sm:mt-[-50px] bg-white opacity-70 border border-emerald-200 text-emerald-700 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-sm shadow-emerald-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {requirements.length} Open Requirements
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-[-20px] sm:mt-[-30px] md:gap-6">
                        {requirements.map((req, i) => (
                            <div
                                key={req._id}
                                className="req-card bg-white opacity-80 rounded-2xl overflow-hidden"
                                style={{ animationDelay: `${i * 0.07}s` }}
                            >
                                {/* Success flash */}
                                {successId === req._id && (
                                    <div className="success-bar bg-emerald-500 text-white text-xs font-bold text-center py-1.5 flex items-center justify-center gap-1.5">
                                        <CheckCircle size={13} /> Contribution recorded!
                                    </div>
                                )}

                                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                                        <span className="category-badge bg-blue-50 text-blue-600 px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider cursor-default">
                                            {req.category}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-emerald-600">
                                                ₹{req.targetPrice}
                                                <span className="text-xs text-gray-400 font-normal">/kg</span>
                                            </p>
                                        </div>
                                    </div>

                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 break-words">{req.itemName}</h3>
                                    <div className="flex items-center gap-2 text-gray-800 text-xs sm:text-sm mb-3 sm:mb-4 md:mb-5">
                                        <Package size={14} className="flex-shrink-0" />
                                        <span>Needed: <b className="text-gray-800">{req.quantityNeeded} kg</b></span>
                                    </div>

                                    <div className="store-block bg-gray-50 rounded-xl p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-5 border border-gray-100">
                                        <p className="text-[10px] sm:text-xs text-gray-800 uppercase font-bold mb-1.5 sm:mb-2 tracking-widest">Store Details</p>
                                        <p className="font-bold text-gray-700 text-sm sm:text-base break-words">{req.storeId?.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-800 break-words">{req.storeId?.city}</p>
                                        <a
                                            href={`tel:${req.storeId?.phoneNumber}`}
                                            className="phone-link mt-1.5 sm:mt-2 md:mt-3 flex items-center gap-2 text-blue-500 text-xs sm:text-sm font-medium"
                                        >
                                            <Phone size={13} className="flex-shrink-0" />
                                            <span className="break-all">{req.storeId?.phoneNumber}</span>
                                        </a>
                                    </div>

                                    <button
                                        onClick={() => setSelectedReq(req)}
                                        className="contribute-btn w-full py-2 sm:py-2.5 md:py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        Contribute Supply
                                        <ArrowRight size={15} className="arrow-icon flex-shrink-0" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {requirements.length === 0 && !loading && (
                        <div className="text-center py-8 sm:py-12 md:py-16">
                            <div className="empty-card bg-white rounded-2xl p-5 sm:p-6 md:p-10 shadow-sm border border-gray-100 max-w-md mx-auto">
                                <Package size={40} className="text-gray-200 mx-auto mb-3" />
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-500 mb-2">No Requirements Available</h3>
                                <p className="text-xs sm:text-sm text-gray-400">Check back later for new opportunities!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contribution Modal */}
            {selectedReq && (
                <div className="modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4">
                    <div className="modal-box bg-white rounded-3xl w-full max-w-[95%] sm:max-w-md shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">

                        {/* Gradient header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-5 md:px-8 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-5">
                            <div className="flex justify-between items-start gap-3">
                                <div className="min-w-0">
                                    <p className="text-emerald-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                                        Contribute Supply
                                    </p>
                                    <h2 className="text-white text-base sm:text-lg md:text-xl font-bold break-words">{selectedReq.itemName}</h2>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0 mt-0.5"
                                >
                                    <X size={14} className="text-white sm:text-[15px]" />
                                </button>
                            </div>
                        </div>

                        <div className="px-4 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6">
                            {/* Store info row */}
                            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2.5 sm:p-3 md:p-4 mb-4 sm:mb-5 md:mb-6 border border-gray-100">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Store size={15} className="text-emerald-600 sm:text-[16px]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-gray-800 text-sm break-words">{selectedReq.storeId?.name}</p>
                                    <p className="text-gray-400 text-xs break-words">{selectedReq.storeId?.city}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-emerald-600 font-extrabold text-sm sm:text-base md:text-lg">₹{selectedReq.targetPrice}</p>
                                    <p className="text-gray-400 text-[10px] sm:text-xs">per kg</p>
                                </div>
                            </div>

                            {/* Quantity Input */}
                            <div className="mb-4 sm:mb-5 md:mb-6">
                                <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">
                                    How much can you provide?{" "}
                                    <span className="text-gray-400 font-normal">(kg)</span>
                                </label>
                                <input
                                    type="number"
                                    value={contribution}
                                    onChange={(e) => setContribution(e.target.value)}
                                    className="num-input w-full p-2.5 sm:p-3 md:p-4 border-2 border-gray-100 rounded-2xl outline-none text-base sm:text-lg md:text-xl font-bold text-gray-800 transition-all"
                                    placeholder={`Max ${selectedReq.quantityNeeded} kg`}
                                />
                                <p className="text-[11px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 ml-1">
                                    Store requires <b className="text-gray-600">{selectedReq.quantityNeeded} kg</b> total
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={closeModal}
                                    className="cancel-btn w-full py-2 sm:py-2.5 md:py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleContribute}
                                    className="confirm-btn w-full py-2 sm:py-2.5 md:py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={16} /> Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MarketplacePage;
