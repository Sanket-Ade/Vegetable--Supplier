"use client";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useAuth } from "@/context/AuthContext";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const FarmerLogin = () => {
    const { login, user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authMethod, setAuthMethod] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        otp: '',
        newPassword: ''
    });

    useEffect(() => {
        if (!authLoading && user) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onCaptchVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
            });
        }
    }

    const handleSendOtp = async () => {
        if (!formData.phone) {
            alert("Please enter your phone number first!");
            return;
        }
        setIsSubmitting(true);
        try {
            const checkRes = await fetch('/api/auth/check-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: formData.phone }),
            });
            const checkData = await checkRes.json();
            if (!checkRes.ok || !checkData.exists) {
                alert("User not found! Please register first.");
                setIsSubmitting(false);
                return;
            }
            onCaptchVerify();
            const appVerifier = window.recaptchaVerifier;
            const formatPh = "+91" + formData.phone;
            const confirmationResult = await signInWithPhoneNumber(auth, formatPh, appVerifier);
            window.confirmationResult = confirmationResult;
            alert("OTP sent successfully!");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = () => {
        if (!formData.phone) {
            alert("Please enter your phone number first.");
            return;
        }
        setAuthMethod('otp');
        setIsResetMode(true);
        alert("Verify OTP to reset your password.");
    };

    const handleResetPassword = async () => {
        if (formData.newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.phone,
                    newPassword: formData.newPassword,
                    otpVerified: true
                }),
            });
            if (response.ok) {
                alert("Password updated! Now login with your new password.");
                setIsResetMode(false);
                setAuthMethod('password');
            } else {
                alert("Reset failed.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    






    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (authMethod === 'otp') {
                // --- OTP LOGIN FLOW ---
                // 1. Verify the OTP with Firebase
                const result = await window.confirmationResult.confirm(formData.otp);

                // 2. Fetch User Details from MongoDB using phoneNumber
                const response = await fetch('/api/auth/check-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber: formData.phone }),
                });
                const data = await response.json();

                if (data.exists) {
                    login(data.user); // Log the user into Context
                    alert("Logged in successfully via OTP!");
                } else {
                    alert("OTP verified, but no account found. Please register.");
                }

            } else {
                // --- PASSWORD LOGIN FLOW ---
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phoneNumber: formData.phone,
                        password: formData.password
                    }),
                });
                const data = await response.json();

                if (data.success) {
                    login(data.user);
                    alert("Logged in successfully!");
                } else {
                    alert(data.error || "Invalid credentials.");
                }
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Authentication failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Checking session...</div>;
    if (user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center mt-[65px] justify-center p-6 bg-[url('/registeration.jpg')] bg-cover bg-center">
            <div id="recaptcha-container"></div>
            <div className="bg-[#F0F1F2] rounded-3xl mt-[-30px]  shadow-xl border opacity-80 border-gray-100 p-10 w-full max-w-[430px] relative z-10">

                <div className="flex flex-col items-center mb-8">
                    <script src="https://cdn.lordicon.com/lordicon.js"></script>
                    <lord-icon
                        src="https://cdn.lordicon.com/hlfocnwl.json"
                        trigger="loop"
                        delay="900"
                        stroke="bold"
                        state="in-reveal"
                        colors="primary:#050504,secondary:#08330d"
                        style={{ width: "50px", height: "50px" }}
                    ></lord-icon>
                    <h1 className="text-3xl font-bold text-[#1b4332]">
                        {isResetMode ? "Reset Password" : "Farmer Login"}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isResetMode && (
                        <div className="flex bg-gray-200 p-1 rounded-xl">
                            <button type="button" onClick={() => setAuthMethod('password')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMethod === 'password' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
                                Password
                            </button>
                            <button type="button" onClick={() => setAuthMethod('otp')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMethod === 'otp' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
                                OTP
                            </button>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                            className="w-full border-b py-2 focus:outline-none border-gray-300 focus:border-[#1b4332] bg-transparent"
                            placeholder="9699xxxxxx" required disabled={isResetMode} />
                    </div>

                    {authMethod === 'password' ? (
                        <div>
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <button type="button" onClick={handleForgotPassword} className="text-xs text-emerald-700 font-semibold hover:underline">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                                    className="w-full border-b py-2 focus:outline-none border-gray-300 focus:border-[#1b4332] bg-transparent pr-10" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2 text-gray-400">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium">OTP Code</label>
                                <button type="button" onClick={handleSendOtp} className="text-xs text-emerald-700 font-bold hover:underline">
                                    {isSubmitting ? 'Sending...' : 'Send OTP'}
                                </button>
                            </div>
                            <input type="text" name="otp" value={formData.otp} onChange={handleChange}
                                placeholder="Enter 6-digit OTP" className="w-full border-b py-2 focus:outline-none border-gray-300 focus:border-[#1b4332] bg-transparent" required />

                            {isResetMode && (
                                <div className="pt-2">
                                    <label className="block text-sm font-medium mb-1">New Password</label>
                                    <div className="relative">
                                        <input type={showNewPassword ? "text" : "password"} name="newPassword" value={formData.newPassword} onChange={handleChange}
                                            className="w-full border-b py-2 focus:outline-none border-gray-300 focus:border-[#1b4332] bg-transparent" required />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-0 bottom-2 text-gray-400">
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type={isResetMode && formData.newPassword ? "button" : "submit"}
                        onClick={isResetMode && formData.newPassword ? handleResetPassword : undefined}
                        disabled={isSubmitting}
                        className="w-full bg-[#1b4332] text-white py-3 rounded-full font-semibold text-lg hover:bg-[#143225] transition-all mt-4 shadow-md"
                    >
                        {isSubmitting ? 'Please wait...' :
                            isResetMode ? (formData.newPassword ? 'Update Password' : 'Verify OTP First') :
                                (authMethod === 'password' ? 'Login' : 'Verify & Login')}
                    </button>
                </form>
                {!isResetMode && (
                    <p className="text-center text-gray-600 mt-8 text-sm">
                        Don't have an account? <a href="/add-farmer" className="text-[#1b4332] font-bold hover:underline">Register here</a>
                    </p>
                )}
                {isResetMode && (
                    <button onClick={() => setIsResetMode(false)} className="w-full text-center text-sm text-gray-500 mt-4 hover:underline">
                        Back to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default FarmerLogin;