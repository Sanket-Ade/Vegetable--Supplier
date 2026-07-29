

"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FarmerRegistration = () => {
  const router = useRouter();
  
  // 1. ADD LOADING STATE HERE
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters.";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email format.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{7,})/;
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must be 7+ chars, 1 uppercase, 1 special symbol.";
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
      newErrors.address = "Farm address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // Now this will work!
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,      // Maps to Mongoose 'name'
          phoneNumber: formData.phone,   // Maps to Mongoose 'phoneNumber'
          email: formData.email || null,
          password: formData.password,
          address: formData.address,
          role: 'farmer'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registration Successful!");
        router.push('/farmer-login');
      } else {
        alert("❌ Error: " + (data.error || "Registration failed"));
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("❌ Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex opacity-80 items-center justify-center p-5 mt-[65px] bg-[url('/registeration.jpg')] bg-cover bg-center ">
      <div className="opacity-70 bg-[#c2d8e3] rounded-2xl shadow-sm border-gray-100 p-10 w-full max-w-[450px]">
        <div className="flex flex-col items-center mb-8">
          <script src="https://cdn.lordicon.com/lordicon.js"></script>
          <lord-icon
            src="https://cdn.lordicon.com/hlfocnwl.json"
            trigger="in"
            delay="900"
            stroke="bold"
            state="in-reveal"
            colors="primary:#050504,secondary:#08330d"
            style={{ width: "50px", height: "50px" }}
          ></lord-icon>
          <h1 className="text-3xl font-bold text-emerald-900">Farmer Registration</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black">Full Name <span className="text-red-500">*</span></label>
            <input
              name="fullName"
              type="text"
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.fullName ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-emerald-600 focus:outline-none bg-transparent`}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Email (Optional)</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className={`w-full border-b ${errors.email ? 'border-red-500' : 'border-gray-200'} py-2 focus:border-emerald-600 focus:outline-none bg-transparent`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-black">Password <span className="text-red-500">*</span></label>
            <input
              name="password"
              type={showPass ? "text" : "password"}
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.password ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-emerald-600 focus:outline-none pr-10 bg-transparent`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 bottom-2 text-gray-500">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.password}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-black">Confirm Password <span className="text-red-500">*</span></label>
            <input
              name="confirmPassword"
              type={showConfirmPass ? "text" : "password"}
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-emerald-600 focus:outline-none pr-10 bg-transparent`}
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-0 bottom-2 text-gray-500">
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Phone Number <span className="text-red-500">*</span></label>
            <input
              name="phone"
              type="tel"
              required
              onChange={handleChange}
              placeholder="10 digit number"
              className={`w-full border-b ${errors.phone ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-emerald-600 focus:outline-none bg-transparent`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Farm Address <span className="text-red-500">*</span></label>
            <textarea
              name="address"
              rows="2"
              required
              onChange={handleChange}
              className={`w-full border-b ${errors.address ? 'border-red-500' : 'border-gray-300'} py-2 focus:border-emerald-600 focus:outline-none resize-none bg-transparent`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <button
            type="submit"
            disabled={loading} // Use loading state to disable button
            className={`cursor-pointer w-full ${loading ? 'bg-gray-400' : 'bg-[#1b4332]'} text-white py-4 rounded-full font-semibold text-lg hover:bg-emerald-900 transition-all mt-4 shadow-md active:scale-95`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Already have an account?{' '}
          <a href="/farmer-login" className="text-emerald-700 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default FarmerRegistration;