"use client";
import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // REDIRECT IF NO EMAIL FOUND
  useEffect(() => {
    if (!email) {
      router.push('/store-login');
    }
  }, [email, router]);

  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation before API call
    if (formData.otp.length !== 6) {
        return setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP' });
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match!' });
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          otp: formData.otp,
          newPassword: formData.newPassword // Ensure backend uses this key
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Password reset successful! Redirecting...' });
        setTimeout(() => router.push('/store-login'), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid OTP' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center mt-[65px] justify-center p-6 bg-[url('/store-registeration.png')] bg-cover bg-center">
      <div className="bg-[#F0F1F2] mt-[-35px] rounded-3xl opacity-85 shadow-2xl border border-white/20 p-10 w-full max-w-[450px] backdrop-blur-sm">
        
        <button 
          onClick={() => router.push('/store-login')}
          className="flex items-center gap-2 text-emerald-800 font-semibold mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft size={18} /> Back to Login
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1b1a]">Verify OTP</h1>
          <p className="text-black-600 text-sm mt-2 text-center">
            Enter the 6-digit code sent to <br/><span className="font-bold text-emerald-900">{email || "your email"}</span>
          </p>
        </div>

        {message.text && (
          <div className={`p-3 rounded-xl mb-6 text-center text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black-500 mb-1">6-Digit OTP</label>
            <input
              type="text"
              maxLength="6"
              inputMode="numeric" // Forces numeric keyboard on mobile
              placeholder="000000"
              required
              className="w-full border-b-2 border-gray-300 py-3 text-2xl tracking-[15px] text-center focus:border-emerald-600 focus:outline-none bg-transparent font-mono"
              onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})} // Only allows numbers
              value={formData.otp}
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-black-500 mb-1">New Password</label>
            <input
              type={showPass ? "text" : "password"}
              required
              className="w-full border-b-2 border-gray-300 py-3 focus:border-emerald-600 focus:outline-none bg-transparent pr-10"
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-0 bottom-3 text-gray-400 hover:text-emerald-600"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black-500 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              className="w-full border-b-2 border-gray-300 py-3 focus:border-emerald-600 focus:outline-none bg-transparent"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1b4332] text-white py-3 rounded-full font-bold text-lg hover:bg-emerald-900 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ResetPassword = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPassword;