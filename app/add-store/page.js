
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Added for redirection
import { Eye, EyeOff } from 'lucide-react';

const StoreRegistration = () => {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to prevent double clicks

  const validate = () => {
    let newErrors = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required.";
    } else if (formData.storeName.trim().length < 2) {
      newErrors.storeName = "Store name must be at least 2 characters.";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{7,})/;
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must be 7+ chars, 1 uppercase, and 1 symbol.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Store address is required.";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Please provide a more detailed address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  // --- UPDATED SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.storeName,       // ADDED: This fixes the "name is required" error
            storeName: formData.storeName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phone,
            address: formData.address,
            role: 'shopkeeper' 
          }),
        });

        const data = await res.json();

        if (data.success) {
          alert("Store Registered Successfully!");
          router.push('/store-login');
        } else {
          setErrors({ server: data.error });
          alert(data.error);
        }
      } catch (err) {
        console.error("Registration error:", err);
        alert("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center opacity-90 justify-center p-6 mt-[65px] bg-[url('/store-registeration.png')] object-contain bg-center">
      <div className="bg-[#F0F1F2] rounded-3xl opacity-70 shadow-sm border border-[#F0F1F2] p-10 w-full max-w-[450px]">
        <div className="flex flex-col items-center mb-8">
          <script src="https://cdn.lordicon.com/lordicon.js"></script>
          <lord-icon
            src="https://cdn.lordicon.com/lffntgux.json"
            trigger="in"
            style={{ "width": "50px", "height": "50px" }}>
          </lord-icon>
          <h1 className="text-3xl font-bold text-emerald-900">
            Store Registration
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name <span className="text-red-500">*</span></label>
            <input
              name="storeName"
              type="text"
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.storeName ? 'border-red-500' : 'border-black-300'} py-2 focus:border-orange-500 focus:outline-none transition-colors`}
            />
            {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.email ? 'border-red-500' : 'border-black-300'} py-2 focus:border-orange-500 focus:outline-none transition-colors`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            <input
              name="password"
              type={showPass ? "text" : "password"}
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.password ? 'border-red-500' : 'border-black-300'} py-2 focus:border-orange-500 focus:outline-none transition-colors pr-10`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 bottom-2 text-black-400">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
            <input
              name="confirmPassword"
              type={showConfirmPass ? "text" : "password"}
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.confirmPassword ? 'border-red-500' : 'border-black-300'} py-2 focus:border-orange-500 focus:outline-none transition-colors pr-10`}
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-0 bottom-2 text-black-400">
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
            <input
              name="phone"
              type="tel"
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.phone ? 'border-red-500' : 'border-black-300'} py-2 focus:border-orange-500 focus:outline-none transition-colors`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Store Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Address <span className="text-red-500">*</span></label>
            <textarea
              name="address"
              rows="2"
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.address ? 'border-red-500' : 'border-black-300'} py-2 focus:border-orange-500 focus:outline-none transition-colors resize-none`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#1b4332] text-white py-4 rounded-full font-semibold text-lg hover:bg-emerald-900 transition-all mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Already have an account?{' '}
          <a href="/store-login" className="text-emerald-700 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default StoreRegistration;