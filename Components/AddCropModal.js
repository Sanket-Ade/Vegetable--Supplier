
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign, Package, Loader2, Search, ChevronDown, Plus } from 'lucide-react';

export default function AddCropModal({ isOpen, onClose, farmerId, onCropAdded }) {
    const [formData, setFormData] = useState({
        name: 'Onion',
        quantity: '',
        pricePerUnit: '',
        category: 'Vegetables'
    });
    const [marketAvg, setMarketAvg] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newCropName, setNewCropName] = useState('');
    const [errors, setErrors] = useState({});
    const dropdownRef = useRef(null);

    const [cropsList, setCropsList] = useState([
        { value: 'Onion', label: '🧅 Onion', category: 'Vegetables' },
        { value: 'Tomato', label: '🍅 Tomato', category: 'Vegetables' },
        { value: 'Soya Bean', label: '🌱 Soya Bean', category: 'Vegetables' },
        { value: 'Cotton', label: '🌾 Cotton', category: 'Crops' },
        { value: 'Corriender', label: '🌿 Coriander', category: 'Vegetables' },
        { value: 'Cabbage', label: '🥬 Cabbage', category: 'Vegetables' },
        { value: 'Radish', label: '🥕 Radish', category: 'Vegetables' },
        { value: 'Carrot', label: '🥕 Carrot', category: 'Vegetables' },
        { value: 'Mango', label: '🥭 Mango', category: 'Fruits' },
        { value: 'Potato', label: '🥔 Potato', category: 'Vegetables' },
        { value: 'Brinjal', label: '🍆 Brinjal', category: 'Vegetables' },
        { value: 'Cauliflower', label: '🥦 Cauliflower', category: 'Vegetables' },
        { value: 'Spinach', label: '🥬 Spinach', category: 'Vegetables' },
        { value: 'Garlic', label: '🧄 Garlic', category: 'Vegetables' },
        { value: 'Ginger', label: '🫚 Ginger', category: 'Vegetables' },
        { value: 'Pumpkin', label: '🎃 Pumpkin', category: 'Vegetables' },
        { value: 'Cucumber', label: '🥒 Cucumber', category: 'Vegetables' },
        { value: 'Bell Pepper', label: '🫑 Bell Pepper', category: 'Vegetables' },
        { value: 'Chili', label: '🌶️ Chili', category: 'Vegetables' },
        { value: 'Lemon', label: '🍋 Lemon', category: 'Fruits' },
        { value: 'Banana', label: '🍌 Banana', category: 'Fruits' },
        { value: 'Apple', label: '🍎 Apple', category: 'Fruits' },
        { value: 'Grapes', label: '🍇 Grapes', category: 'Fruits' },
        { value: 'Orange', label: '🍊 Orange', category: 'Fruits' },
        { value: 'Pomegranate', label: '🍎 Pomegranate', category: 'Fruits' },
        { value: 'Watermelon', label: '🍉 Watermelon', category: 'Fruits' }
    ]);

    // Filter crops based on search term
    const filteredCrops = cropsList.filter(crop =>
        crop.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check if search term matches any existing crop
    const isExistingCrop = cropsList.some(crop =>
        crop.value.toLowerCase() === searchTerm.toLowerCase() ||
        crop.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setIsAddingNew(false);
                setNewCropName('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset search when dropdown closes
    useEffect(() => {
        if (!isDropdownOpen) {
            setSearchTerm('');
            setIsAddingNew(false);
            setNewCropName('');
        }
    }, [isDropdownOpen]);

    // Clear errors when form data changes
    useEffect(() => {
        if (errors.quantity || errors.pricePerUnit) {
            setErrors({});
        }
    }, [formData.quantity, formData.pricePerUnit]);

    // Fetch market average
    useEffect(() => {
        const fetchAverage = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/market/average?cropName=${formData.name}`);
                const data = await res.json();
                if (data.success) {
                    setMarketAvg(data.avgPrice || 0);
                }
            } catch (error) {
                console.error("Error fetching market average:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && formData.name) {
            fetchAverage();
        }
    }, [formData.name, isOpen]);

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Validate Crop Name (mandatory)
        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Crop name is required';
        }

        // Validate Quantity (mandatory, min 1kg)
        if (!formData.quantity || formData.quantity === '') {
            newErrors.quantity = 'Quantity is required';
        } else if (parseFloat(formData.quantity) < 1) {
            newErrors.quantity = 'Minimum quantity is 1 kg';
        } else if (parseFloat(formData.quantity) <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        // Validate Price (mandatory, min ₹1)
        if (!formData.pricePerUnit || formData.pricePerUnit === '') {
            newErrors.pricePerUnit = 'Price is required';
        } else if (parseFloat(formData.pricePerUnit) < 1) {
            newErrors.pricePerUnit = 'Minimum price is ₹1 per kg';
        } else if (parseFloat(formData.pricePerUnit) <= 0) {
            newErrors.pricePerUnit = 'Price must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPriceStatus = () => {
        if (!formData.pricePerUnit || marketAvg === 0) {
            return {
                label: "New Listing",
                color: "bg-blue-100 text-blue-700 border-blue-200",
                icon: AlertCircle,
                description: "Set your competitive price"
            };
        }

        const userP = parseFloat(formData.pricePerUnit);
        const difference = ((userP - marketAvg) / marketAvg * 100).toFixed(1);

        if (userP < marketAvg) {
            return {
                label: "Competitive Price 🔥",
                color: "bg-green-100 text-green-700 border-green-200",
                icon: TrendingDown,
                description: `${Math.abs(difference)}% below market average`
            };
        }
        if (userP <= marketAvg * 1.1) {
            return {
                label: "Fair Price ✅",
                color: "bg-yellow-100 text-yellow-700 border-yellow-200",
                icon: CheckCircle,
                description: `${difference}% above market average`
            };
        }
        return {
            label: "High Price ⚠️",
            color: "bg-red-100 text-red-700 border-red-200",
            icon: TrendingUp,
            description: `${difference}% above market average`
        };
    };

    const handleSubmit = async () => {
        // Validate all fields
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const submissionData = {
                farmerId,
                name: formData.name,
                category: formData.category,
                quantity: parseFloat(formData.quantity),
                pricePerUnit: parseFloat(formData.pricePerUnit),
                marketPriceAtListing: marketAvg,
                status: 'available'
            };

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();

            if (data.success) {
                // Call onCropAdded callback if provided
                if (onCropAdded) {
                    onCropAdded();
                }
                onClose();
                // Reset form
                setFormData({
                    name: 'Onion',
                    quantity: '',
                    pricePerUnit: '',
                    category: 'Vegetables'
                });
                setErrors({});
            } else {
                setErrors({ submit: data.error || "Failed to save product" });
            }
        } catch (error) {
            console.error("Submission error:", error);
            setErrors({ submit: "Network error. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCropSelect = (cropValue, cropLabel) => {
        const category = cropsList.find(c => c.value === cropValue)?.category || 'Vegetables';

        setFormData({
            ...formData,
            name: cropValue,
            category: category
        });
        setErrors({ ...errors, name: null });
        setIsDropdownOpen(false);
    };

    const handleAddNewCrop = () => {
        if (newCropName.trim()) {
            const formattedName = newCropName.trim();
            const newCrop = {
                value: formattedName,
                label: `🌱 ${formattedName}`,
                category: 'Custom'
            };

            setCropsList([...cropsList, newCrop]);
            setFormData({ ...formData, name: formattedName });
            setErrors({ ...errors, name: null });
            setIsAddingNew(false);
            setIsDropdownOpen(false);
            setSearchTerm('');
            setNewCropName('');
        }
    };

    const handleAddNewClick = () => {
        setIsAddingNew(true);
        setSearchTerm('');
    };

    if (!isOpen) return null;

    const priceStatus = getPriceStatus();
    const StatusIcon = priceStatus.icon;
    const selectedCrop = cropsList.find(crop => crop.value === formData.name);

    return (
        <>
            {/* Backdrop with blur effect */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
                onClick={onClose}
            >
                {/* Modal Container with slide-up animation */}
                <div
                    className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-in slide-in-from-bottom-4 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with gradient background */}
                    <div className="relative bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl p-6 text-white">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-bold">Add New Crop</h2>
                        <p className="text-green-100 text-sm mt-1">List your produce for sale</p>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 space-y-5">
                        {/* Submit Error Message */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 animate-in fade-in">
                                <p className="text-red-600 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Crop Name Field with Searchable Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full border-2 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-left flex items-center justify-between bg-white ${errors.name ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                >
                                    <span className={selectedCrop ? 'text-gray-900' : 'text-gray-500'}>
                                        {selectedCrop ? selectedCrop.label : 'Select a crop'}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.name}
                                    </p>
                                )}

                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        {!isAddingNew ? (
                                            <>
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search crops..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>

                                                {/* Options List with Scrollbar */}
                                                <div className="max-h-64 overflow-y-auto">
                                                    {filteredCrops.length > 0 ? (
                                                        filteredCrops.map((crop) => (
                                                            <button
                                                                key={crop.value}
                                                                type="button"
                                                                onClick={() => handleCropSelect(crop.value, crop.label)}
                                                                className={`w-full text-left px-4 py-2 hover:bg-green-50 transition-colors flex items-center justify-between ${formData.name === crop.value ? 'bg-green-50 text-green-700' : 'text-gray-700'
                                                                    }`}
                                                            >
                                                                <span>{crop.label}</span>
                                                                {formData.name === crop.value && (
                                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                                )}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                            No crops found
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Add New Crop Button */}
                                                {searchTerm && !isExistingCrop && (
                                                    <div className="border-t border-gray-200 p-2">
                                                        <button
                                                            type="button"
                                                            onClick={handleAddNewClick}
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm font-medium"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Add "{searchTerm}" as new crop
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {/* Add New Crop Form */}
                                                <div className="p-4">
                                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Crop</h3>
                                                    <div className="space-y-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter crop name"
                                                            value={newCropName}
                                                            onChange={(e) => setNewCropName(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsAddingNew(false)}
                                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleAddNewCrop}
                                                                disabled={!newCropName.trim()}
                                                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                Add Crop
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Show custom crop indicator */}
                            {selectedCrop && selectedCrop.category === 'Custom' && (
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    Custom crop added
                                </p>
                            )}
                        </div>

                        {/* Quantity Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Package className="inline w-4 h-4 mr-1" />
                                Quantity (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                className={`w-full border-2 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none ${errors.quantity ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="Enter quantity in kilograms (min 1 kg)"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                min="1"
                                step="0.1"
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.quantity}
                                </p>
                            )}
                            {!errors.quantity && formData.quantity && parseFloat(formData.quantity) >= 1 && (
                                <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Valid quantity
                                </p>
                            )}
                        </div>

                        {/* Market Average Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Current Market Average</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ₹{loading ? '--' : marketAvg}
                                        </span>
                                        <span className="text-sm text-gray-500">per kg</span>
                                    </div>
                                </div>
                                {loading && (
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                )}
                                <DollarSign className="w-8 h-8 text-blue-400 opacity-50" />
                            </div>
                        </div>

                        {/* Price Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Price (per kg) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    className={`w-full border-2 rounded-xl p-3 pl-8 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none ${errors.pricePerUnit ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    placeholder="Enter your price (min ₹1)"
                                    value={formData.pricePerUnit}
                                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                                    min="1"
                                    step="0.5"
                                />
                            </div>
                            {errors.pricePerUnit && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.pricePerUnit}
                                </p>
                            )}
                            {!errors.pricePerUnit && formData.pricePerUnit && parseFloat(formData.pricePerUnit) >= 1 && (
                                <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Valid price
                                </p>
                            )}
                        </div>

                        {/* Smart Price Badge with Animation */}
                        {formData.pricePerUnit && marketAvg > 0 && !errors.pricePerUnit && (
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${priceStatus.color} animate-in fade-in slide-in-from-left-2 duration-300`}>
                                <StatusIcon className="w-4 h-4" />
                                <span>{priceStatus.label}</span>
                                <span className="text-xs opacity-75 ml-1">{priceStatus.description}</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all hover:border-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                ) : (
                                    'Post Listing'
                                )}
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-xs text-gray-500 text-center">
                            Prices are compared with current market rates to help you sell faster
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar and Animation Styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-in-from-bottom-4 {
                    from {
                        transform: translateY(1rem);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes slide-in-from-left-2 {
                    from {
                        transform: translateX(-0.5rem);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slide-in-from-top-2 {
                    from {
                        transform: translateY(-0.5rem);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-in {
                    animation-duration: 0.3s;
                    animation-fill-mode: both;
                }
                .fade-in {
                    animation-name: fade-in;
                }
                .slide-in-from-bottom-4 {
                    animation-name: slide-in-from-bottom-4;
                }
                .slide-in-from-left-2 {
                    animation-name: slide-in-from-left-2;
                }
                .slide-in-from-top-2 {
                    animation-name: slide-in-from-top-2;
                }
                .duration-200 {
                    animation-duration: 0.2s;
                }
                .duration-300 {
                    animation-duration: 0.3s;
                }
                
                /* Custom scrollbar styling for the dropdown */
                .max-h-64::-webkit-scrollbar {
                    width: 8px;
                }
                
                .max-h-64::-webkit-scrollbar-track {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                
                .max-h-64::-webkit-scrollbar-thumb {
                    background: #10b981;
                    border-radius: 10px;
                }
                
                .max-h-64::-webkit-scrollbar-thumb:hover {
                    background: #059669;
                }
            `}</style>
        </>
    );
}