

"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import {
    PlusCircle,
    Package,
    Store as StoreIcon,
    TrendingUp,
    Users,
    ClipboardList,
    Bell,
    LogOut,
    ChevronRight,
    Clock,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Menu,
    X,
    Phone,
    Calendar,
    User as UserIcon,
    TrendingDown,
    Shield,
    Award,
    Leaf,
    Trash2,
    CheckCircle,
    Circle
} from 'lucide-react';

const StoreDashboard = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [myRequirements, setMyRequirements] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState("Store Manager");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState('open');
    const [selectedFulfillment, setSelectedFulfillment] = useState(null);
    const [selectedFarmerDetails, setSelectedFarmerDetails] = useState(null);

    const [formData, setFormData] = useState({
        itemName: '',
        category: 'Vegetables',
        quantityNeeded: '',
        targetPrice: '',
        deadline: ''
    });

    // Function to get vegetable icon based on name
    const getVegetableIcon = (itemName) => {
        const icons = {
            'Tomatoes': '🍅',
            'Tomato': '🍅',
            'Potatoes': '🥔',
            'Potato': '🥔',
            'Onions': '🧅',
            'Onion': '🧅',
            'Carrots': '🥕',
            'Carrot': '🥕',
            'Broccoli': '🥦',
            'Cucumber': '🥒',
            'Cucumbers': '🥒',
            'Lettuce': '🥬',
            'Spinach': '🥬',
            'Cabbage': '🥬',
            'Cauliflower': '🥦',
            'Bell Pepper': '🫑',
            'Peppers': '🫑',
            'Eggplant': '🍆',
            'Brinjal': '🍆',
            'Corn': '🌽',
            'Garlic': '🧄',
            'Ginger': '🫚',
            'Chili': '🌶️',
            'Peas': '🟢',
            'Pumpkin': '🎃',
            'Radish': '🔴',
            'Beetroot': '🔴'
        };
        return icons[itemName] || '🥬';
    };

    const fetchMyRequirements = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`/api/requirements/all?storeId=${user.id}`);
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (data.success) setMyRequirements(data.requirements);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        }
    };

    const handlePostRequirement = async (e) => {
        e.preventDefault();
        const userId = user?.id || user?._id;
        if (!userId) return alert("Error: User ID not found.");

        try {
            const res = await fetch('/api/requirements/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    storeId: userId,
                    storeName: user.name || "Store"
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Requirement Posted!");
                setIsModalOpen(false);
                setFormData({ itemName: '', category: 'Vegetables', quantityNeeded: '', targetPrice: '', deadline: '' });
                fetchMyRequirements();
            }
        } catch (err) {
            alert("Failed to post requirement.");
        }
    };

    const handleDeleteRequirement = async (requirementId, requirementName) => {
        if (!requirementId) return;

        const confirmed = window.confirm(`Are you sure you want to delete the requirement for "${requirementName}"? This action cannot be undone.`);

        if (!confirmed) return;

        setIsDeleting(true);

        try {
            const res = await fetch(`/api/requirements/delete?id=${requirementId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (data.success) {
                alert("Requirement deleted successfully!");
                await fetchMyRequirements();
            } else {
                alert(data.error || "Failed to delete requirement.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("An error occurred while deleting the requirement.");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchMyRequirements();
            setUserName(user.name || "Store Manager");
        }

        const timer = setTimeout(() => {
            setAnimatedStats({
                openRequests: myRequirements.filter(r => r.status === 'open').length,
                fulfilledDeals: myRequirements.filter(r => r.status === 'fulfilled').length,
                totalFarmers: 24
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [user?.id, myRequirements.length]);

    const handleLogout = () => { router.push('/store-login'); };

    const openRequests = myRequirements.filter(r => r.status === 'open');
    const fulfilledDeals = myRequirements.filter(r => r.status === 'fulfilled');

    const openRequestsCount = openRequests.length;
    const fulfilledCount = fulfilledDeals.length;
    const totalQuantityNeeded = openRequests.reduce((sum, req) => sum + (parseInt(req.quantityNeeded) || 0), 0);
    const fulfillmentRate = myRequirements.length > 0 ? Math.round((fulfilledCount / myRequirements.length) * 100) : 0;

    const currentItems = activeTab === 'open' ? openRequests : fulfilledDeals;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 flex flex-col md:flex-row mt-[65px] relative">
            {/* <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-20 left-4 z-50 bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
                {isMobileMenuOpen ? <X size={20} className="text-emerald-600" /> : <Menu size={20} className="text-emerald-600" />}
            </button>

            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)} />} */}

            <aside className={`fixed md:relative w-72 md:w-64 lg:w-72 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 md:p-6 transition-all duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:translate-x-0 flex flex-col shadow-2xl  h-full md:h-auto overflow-y-auto`}>
                <div className="mb-6 md:mb-10 animate-slideIn">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                            <StoreIcon size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <span className="font-bold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-emerald-300 to-white bg-clip-text text-transparent">VegeHub</span>
                            <p className="text-[10px] text-emerald-300/80 uppercase font-bold tracking-widest mt-1">Business Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    <div className="relative group">
                        <button className="flex items-center gap-3 w-full p-3 bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 text-emerald-300 rounded-xl font-medium transition-all duration-300 hover:from-emerald-500/30 hover:to-emerald-400/20">
                            <ClipboardList size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                            <span className="text-sm">Dashboard</span>
                            <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={16} />
                            </div>
                        </button>
                    </div>

                    <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-white/10">
                        <div className="px-3 py-2">
                            <p className="text-[10px] text-emerald-300/60 uppercase font-bold tracking-wider">Quick Stats</p>
                            <div className="mt-3 space-y-2">
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-emerald-300/80">Active Needs</span>
                                    <span className="font-bold text-white">{openRequestsCount}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-emerald-300/80">Fulfilled</span>
                                    <span className="font-bold text-white">{fulfilledCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 text-red-300 hover:bg-red-500/20 rounded-xl mt-auto transition-all duration-300 font-medium group hover:scale-105"
                >
                    <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm">Logout</span>
                </button>
            </aside>

            <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-y-auto w-full">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 bg-white/70 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border border-white/50 animate-slideDown">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Welcome back, {userName}!
                            </h1>
                        </div>
                        <p className="text-slate-500 text-xs md:text-sm ml-3">Managing your inventory and farmer supply chain efficiently.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                            <StoreIcon size={16} className="text-white" />
                        </div>
                    </div>
                </header>

                {/* Stats Cards with Animations - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="lg:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 group cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xs md:text-sm font-semibold opacity-90 mb-2">Need Stock?</h3>
                                <p className="text-[10px] md:text-xs opacity-75 mb-3 md:mb-4">Post new requirement</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-2 px-3 md:py-2.5 md:px-4 bg-white/20 backdrop-blur-sm rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/30 hover:scale-105"
                                >
                                    <PlusCircle size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                                    Post New Need
                                </button>
                            </div>
                            <PlusCircle size={24} className="opacity-50 group-hover:rotate-90 transition-transform duration-500" />
                        </div>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fadeInUp">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-orange-100 rounded-xl">
                                <Clock className="text-orange-500" size={16} />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-orange-500 group-hover:scale-110 transition-transform">{openRequestsCount}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Open Requests</p>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-2">Awaiting fulfillment</p>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fadeInUp animation-delay-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <CheckCircle2 className="text-blue-500" size={16} />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-blue-500 group-hover:scale-110 transition-transform">{fulfilledCount}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Fulfilled Deals</p>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-2">Successfully completed</p>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fadeInUp animation-delay-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <Package className="text-purple-500" size={16} />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-purple-500 group-hover:scale-110 transition-transform">{totalQuantityNeeded}kg</span>
                        </div>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Total Needed</p>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-2">Open requirements</p>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fadeInUp animation-delay-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-emerald-100 rounded-xl">
                                <Award className="text-emerald-500" size={16} />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-emerald-500 group-hover:scale-110 transition-transform">{fulfillmentRate}%</span>
                        </div>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Fulfillment Rate</p>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-2">Overall performance</p>
                    </div>
                </div>

                {/* Tabs - Responsive */}
                <div className="mb-4 md:mb-6 overflow-x-auto">
                    <div className="flex gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-2xl inline-flex shadow-lg min-w-max">
                        <button
                            onClick={() => setActiveTab('open')}
                            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap ${
                                activeTab === 'open'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-emerald-600'
                            }`}
                        >
                            <Clock size={16} />
                            Open Requests
                            {openRequestsCount > 0 && (
                                <span className={`ml-1 md:ml-2 text-xs px-1.5 md:px-2 py-0.5 rounded-full ${
                                    activeTab === 'open' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                    {openRequestsCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('fulfilled')}
                            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap ${
                                activeTab === 'fulfilled'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-emerald-600'
                            }`}
                        >
                            <CheckCircle size={16} />
                            Fulfilled Deals
                            {fulfilledCount > 0 && (
                                <span className={`ml-1 md:ml-2 text-xs px-1.5 md:px-2 py-0.5 rounded-full ${
                                    activeTab === 'fulfilled' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                    {fulfilledCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Area - Responsive */}
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fadeInUp animation-delay-400">
                    <div className="p-4 md:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h3 className="font-bold text-lg md:text-xl text-slate-800 flex items-center gap-2">
                                    {activeTab === 'open' ? (
                                        <>
                                            <Clock size={18} className="text-emerald-500" />
                                            Open Requirements
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={18} className="text-emerald-500" />
                                            Fulfilled Deals
                                        </>
                                    )}
                                </h3>
                                <p className="text-xs md:text-sm text-slate-500 mt-1">
                                    {activeTab === 'open'
                                        ? 'Track and manage your active supply needs'
                                        : 'View all your completed deals and farmer contributions'}
                                </p>
                            </div>
                            {activeTab === 'open' && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all hover:scale-105 shadow-md"
                                >
                                    <PlusCircle size={14} />
                                    New Requirement
                                </button>
                            )}
                        </div>
                    </div>

                    {currentItems.length > 0 ? (
                        activeTab === 'open' ? (
                            // Table view for open requests - Responsive
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs md:text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs">
                                        <tr>
                                            <th className="px-3 md:px-6 py-3 md:py-4 rounded-tl-2xl">Vegetable</th>
                                            <th className="px-3 md:px-6 py-3 md:py-4">Category</th>
                                            <th className="px-3 md:px-6 py-3 md:py-4">Quantity</th>
                                            <th className="px-3 md:px-6 py-3 md:py-4">Target Price</th>
                                            <th className="px-3 md:px-6 py-3 md:py-4">Status</th>
                                            <th className="px-3 md:px-6 py-3 md:py-4 rounded-tr-2xl">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {currentItems.map((req, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-emerald-50/40 transition-all duration-300 group cursor-pointer"
                                                style={{
                                                    animation: 'fadeInUp 0.5s ease-out forwards',
                                                    animationDelay: `${idx * 50}ms`,
                                                    opacity: 0
                                                }}
                                            >
                                                <td className="px-3 md:px-6 py-3 md:py-4">
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-base md:text-lg">
                                                            {getVegetableIcon(req.itemName)}
                                                        </div>
                                                        <span className="font-bold text-slate-700 text-xs md:text-sm">{req.itemName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4">
                                                    <span className="text-[10px] md:text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{req.category}</span>
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4">
                                                    <span className="font-semibold text-slate-700 text-xs md:text-sm">{req.quantityNeeded} kg</span>
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4">
                                                    <span className="font-bold text-emerald-600 text-base md:text-lg">₹{req.targetPrice}</span>
                                                    <span className="text-[10px] md:text-xs text-slate-400">/kg</span>
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4">
                                                    {req.contributions && req.contributions.length > 0 ? (
                                                        <button
                                                            onClick={() => setSelectedFulfillment(req)}
                                                            className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-full uppercase hover:bg-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
                                                        >
                                                            <CheckCircle2 size={8} />
                                                            {req.contributions.length} Source{req.contributions.length > 1 ? 's' : ''}
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-full uppercase animate-pulse">
                                                            <Clock size={8} /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 md:px-6 py-3 md:py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => req.contributions && req.contributions.length > 0 ? null : handleDeleteRequirement(req._id, req.itemName)}
                                                            className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${
                                                                req.contributions && req.contributions.length > 0
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                                                    : 'bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110'
                                                            }`}
                                                            disabled={isDeleting || (req.contributions && req.contributions.length > 0)}
                                                            title={req.contributions && req.contributions.length > 0 ? "Cannot delete requirement with active contributions" : "Delete requirement"}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // List view for fulfilled deals - Responsive
                            <div className="divide-y divide-slate-100">
                                {currentItems.map((req, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 md:p-6 hover:bg-slate-50/50 transition-all duration-300 group"
                                        style={{
                                            animation: 'fadeInUp 0.5s ease-out forwards',
                                            animationDelay: `${idx * 50}ms`,
                                            opacity: 0
                                        }}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 md:gap-4 flex-1 w-full sm:w-auto">
                                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                                                    {getVegetableIcon(req.itemName)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-slate-800 text-sm md:text-lg truncate">{req.itemName}</h3>
                                                        <span className="text-[10px] md:text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">{req.category}</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-500">
                                                        <span className="whitespace-nowrap">{req.quantityNeeded} kg</span>
                                                        <span className="font-bold text-emerald-600 whitespace-nowrap">₹{req.targetPrice}/kg</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (req.contributions && req.contributions.length === 1) {
                                                        setSelectedFarmerDetails({
                                                            ...req.contributions[0],
                                                            itemName: req.itemName,
                                                            targetPrice: req.targetPrice
                                                        });
                                                    } else if (req.contributions && req.contributions.length > 1) {
                                                        setSelectedFulfillment(req);
                                                    }
                                                }}
                                                className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] md:text-xs font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase hover:bg-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
                                            >
                                                <CheckCircle2 size={10} />
                                                {req.contributions ? req.contributions.length : 0} SOURCE{req.contributions && req.contributions.length !== 1 ? 'S' : ''}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-12 md:py-16">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {activeTab === 'open' ? (
                                    <Package size={24} className="text-emerald-500" />
                                ) : (
                                    <CheckCircle size={24} className="text-emerald-500" />
                                )}
                            </div>
                            <h4 className="text-base md:text-lg font-semibold text-slate-700 mb-2">
                                {activeTab === 'open' ? 'No Open Requests' : 'No Fulfilled Deals Yet'}
                            </h4>
                            <p className="text-slate-400 text-xs md:text-sm mb-4 md:mb-6 px-4">
                                {activeTab === 'open'
                                    ? 'Start by posting your first requirement to connect with farmers'
                                    : 'Your fulfilled deals will appear here once farmers fulfill your requirements'}
                            </p>
                            {activeTab === 'open' && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg"
                                >
                                    <PlusCircle size={16} />
                                    Post New Requirement
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Modals remain the same with responsive adjustments */}
            {/* Farmer Details Modal */}
            {selectedFarmerDetails && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-3 md:p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl md:rounded-[2rem] w-full max-w-[90%] md:max-w-md shadow-2xl animate-scaleUp border border-slate-100 overflow-hidden">
                        <div className="p-4 md:p-8">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                                        <Sparkles className="text-emerald-500" size={20} />
                                        Supply Details
                                    </h2>
                                    <p className="text-xs md:text-sm text-slate-500 mt-1">{selectedFarmerDetails.itemName}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedFarmerDetails(null)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-all duration-300 hover:rotate-90"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="border-t border-slate-100 -mx-4 md:-mx-8 px-4 md:px-8 pt-4 md:pt-6">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                                                <UserIcon size={16} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-base md:text-xl">{selectedFarmerDetails.farmerName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                        <Shield size={10} />
                                                        Verified Farmer
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="flex items-center gap-2 text-slate-600 text-xs md:text-sm">
                                                <Phone size={12} className="text-emerald-500" />
                                                {selectedFarmerDetails.phoneNumber}
                                            </p>
                                            <p className="flex items-center gap-2 text-slate-600 text-xs md:text-sm">
                                                <Calendar size={12} className="text-emerald-500" />
                                                {new Date(selectedFarmerDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contributed</p>
                                        <p className="text-2xl md:text-3xl font-bold text-emerald-600">{selectedFarmerDetails.quantity}kg</p>
                                        <p className="text-xs md:text-sm text-slate-500 mt-1">@ ₹{selectedFarmerDetails.targetPrice}/kg</p>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div className="text-[9px] md:text-[10px] text-slate-400 font-mono">
                                        Transaction ID: #{Math.random().toString(36).substr(2, 8).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] md:text-xs font-semibold text-green-600">Confirmed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={() => setSelectedFarmerDetails(null)}
                                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:from-slate-900 hover:to-slate-800 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FULFILLMENT DETAILS MODAL - For multiple sources */}
            {selectedFulfillment && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-3 md:p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl md:rounded-[2rem] w-full max-w-[90%] md:max-w-md p-4 md:p-8 shadow-2xl animate-scaleUp border border-slate-100">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <Sparkles className="text-emerald-500" size={20} />
                                    Supply Details
                                </h2>
                                <p className="text-xs md:text-sm text-slate-500 mt-1">{selectedFulfillment.itemName}</p>
                            </div>
                            <button
                                onClick={() => setSelectedFulfillment(null)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-all duration-300 hover:rotate-90"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[400px] md:max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedFulfillment.contributions.map((c, i) => (
                                <div
                                    key={i}
                                    className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 p-3 md:p-5 rounded-xl md:rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                    onClick={() => {
                                        setSelectedFarmerDetails({
                                            ...c,
                                            itemName: selectedFulfillment.itemName,
                                            targetPrice: selectedFulfillment.targetPrice
                                        });
                                        setSelectedFulfillment(null);
                                    }}
                                    style={{
                                        animation: 'slideIn 0.4s ease-out forwards',
                                        animationDelay: `${i * 100}ms`,
                                        opacity: 0
                                    }}
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full"></div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 relative z-10">
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <UserIcon size={12} className="text-emerald-600" />
                                                </div>
                                                <p className="font-bold text-slate-800 text-sm md:text-base">{c.farmerName}</p>
                                            </div>
                                            <div className="space-y-1 ml-8">
                                                <p className="flex items-center gap-2 text-slate-600 text-xs md:text-sm">
                                                    <Phone size={10} className="text-emerald-500" />
                                                    {c.phoneNumber}
                                                </p>
                                                <p className="flex items-center gap-2 text-slate-600 text-xs md:text-sm">
                                                    <Calendar size={10} className="text-emerald-500" />
                                                    {new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right w-full sm:w-auto">
                                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contributed</p>
                                            <p className="text-xl md:text-2xl font-bold text-emerald-600">{c.quantity}kg</p>
                                            <p className="text-[10px] md:text-xs text-slate-500 mt-1">@ ₹{selectedFulfillment.targetPrice}/kg</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] md:text-[11px]">
                                        <span className="text-slate-400">Click to view details</span>
                                        <span className="text-emerald-600 font-semibold">✓ Confirmed</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedFulfillment(null)}
                            className="w-full mt-4 md:mt-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-2.5 md:py-3.5 rounded-xl font-bold text-sm md:text-base hover:from-slate-900 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Post Requirement Modal - Responsive */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-3 md:p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl md:rounded-[2rem] w-full max-w-[90%] md:max-w-md p-4 md:p-8 shadow-2xl animate-scaleUp border border-slate-100">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <PlusCircle className="text-emerald-500" size={20} />
                                    Post New Need
                                </h2>
                                <p className="text-xs md:text-sm text-slate-500 mt-1">Connect with farmers instantly</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-all duration-300 hover:rotate-90"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handlePostRequirement} className="space-y-4 md:space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Vegetable Name</label>
                                <input
                                    placeholder="e.g., Fresh Tomatoes"
                                    required
                                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium text-sm md:text-base"
                                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                                <select
                                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium text-sm md:text-base"
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    value={formData.category}
                                >
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Grains">Grains</option>
                                    <option value="Spices">Spices</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Quantity (kg)</label>
                                    <input
                                        type="number"
                                        placeholder="50"
                                        required
                                        className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium text-sm md:text-base"
                                        onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Price (₹/kg)</label>
                                    <input
                                        type="number"
                                        placeholder="40"
                                        required
                                        className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium text-sm md:text-base"
                                        onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                                >
                                    Post to Marketplace
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add custom animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes scaleUp {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.5s ease-out forwards;
                }
                
                .animate-slideIn {
                    animation: slideIn 0.4s ease-out forwards;
                }
                
                .animate-scaleUp {
                    animation: scaleUp 0.3s ease-out forwards;
                }
                
                .animation-delay-100 {
                    animation-delay: 100ms;
                }
                
                .animation-delay-200 {
                    animation-delay: 200ms;
                }
                
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
                
                .animation-delay-400 {
                    animation-delay: 400ms;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #10b981;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #059669;
                }
            `}</style>
        </div>
    );
};

export default StoreDashboard;