

"use client";
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'; // Added Import
import { Eye, EyeOff, Store } from 'lucide-react';

const StoreLogin = () => {
  const router = useRouter(); // Added Router Initialization
  const { login } = useAuth(); 
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 7) {
      newErrors.password = "Password must be at least 7 characters.";
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     try {
  //       const res = await fetch('/api/auth/store-login', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(formData),
  //       });

  //       const data = await res.json();

  //       // if (data.success) {
  //       //   alert("Login Successful!");
  //       //   window.location.href = '/store-dashboard'; 
  //       // }

  //       if (data.success) {
  //         // Make sure 'data.user' contains { id: ..., name: ..., role: ... }
  //         login(data.user);
  //         alert("Login Successful!");
  //         router.push('/store-dashboard');
  //       } else {
  //         setErrors({ email: data.error });
  //       }
  //     } catch (err) {
  //       console.error("Login error:", err);
  //       alert("Server error. Please try again later.");
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await fetch('/api/auth/store-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
          // 3. CRITICAL: Save the user to Context & LocalStorage
          login(data.user); 
          
          alert("Login Successful!");
          router.push('/store-dashboard'); 
        } else {
          setErrors({ email: data.error }); 
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Server error. Please try again later.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      return alert("Please enter your email address first.");
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();

      if (data.success) {
        alert("OTP sent successfully to your email!");
        // Now using router.push correctly
        router.push(`/reset-password?email=${encodeURIComponent(formData.email)}`);
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center opacity-90 justify-center mt-[65px] p-6 bg-[url('/store-registeration.png')] bg-cover bg-center">
      <div className="bg-[#F0F1F2] rounded-3xl opacity-80 shadow-sm border mt-[-25px] border-gray-100 p-10 w-full max-w-[450px]">

        <div className="flex flex-col items-center mb-12">
          <script src="https://cdn.lordicon.com/lordicon.js"></script>
          <lord-icon
            src="https://cdn.lordicon.com/lffntgux.json"
            trigger="in"
            style={{ "width": "50px", "height": "50px" }}>
          </lord-icon>
          <h1 className="text-4xl font-bold text-[#1b4332]">
            Store Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <label className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              required
              onChange={handleChange}
              placeholder="store@example.com"
              className={`w-full border-b ${errors.email ? 'border-red-500' : 'border-gray-300'} py-3 focus:border-emerald-600 focus:outline-none transition-colors bg-transparent`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 absolute">{errors.email}</p>}
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-black">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                onChange={handleChange}
                className={`w-full border-b ${errors.password ? 'border-red-500' : 'border-gray-300'} py-3 focus:border-emerald-600 focus:outline-none transition-colors bg-transparent pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-y-70-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 absolute">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b4332] text-white py-4 rounded-full font-semibold text-lg hover:bg-[#143225] transition-all shadow-md active:scale-[0.98] mt-4"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-10 text-base">
          Don't have an account?{' '}
          <a href="/add-store" className="text-emerald-700 font-bold hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default StoreLogin;