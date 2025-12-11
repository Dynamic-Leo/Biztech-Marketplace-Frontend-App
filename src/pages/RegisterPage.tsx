import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Info, CheckCircle, ArrowLeft } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserData } = useAuth();
  
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState<'register' | 'otp' | 'pending_approval'>('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [role, setRole] = useState<UserRole>('seller');
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- VALIDATION ---
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasUppercase: /[A-Z]/.test(formData.password),
  };
  const isPasswordValid = passwordValidation.minLength && passwordValidation.hasNumber && passwordValidation.hasUppercase;

  // --- 1. HANDLE REGISTRATION FORM SUBMISSION ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role,
        companyName: formData.companyName,
        agreedToCommission: role === 'seller' ? true : undefined,
        financialMeans: role === 'buyer' ? '100k-1M' : undefined 
      });

      setStep('otp');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLE OTP VERIFICATION ---
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyEmail(formData.email, otp);

      if (response.token && response.user) {
        setUserData(response.user, response.token);
        navigate(`/dashboard/${role}`);
      } else if (response.requireApproval) {
        setStep('pending_approval');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  //        RENDER VIEWS
  // ==========================

  // --- VIEW 1: OTP INPUT FORM ---
  if (step === 'otp') {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-[#E8EDF2]">
        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit code to <strong>{formData.email}</strong>.
          </p>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 text-center text-xl tracking-widest border rounded-lg focus:ring-2 focus:outline-none border-gray-300"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium bg-[#0D1B2A] hover:opacity-90 disabled:opacity-50 mb-4"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <button
              type="button"
              onClick={() => setStep('register')}
              className="text-[#6B7280] text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 2: PENDING APPROVAL (SELLERS) ---
  if (step === 'pending_approval') {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-[#E8EDF2]">
        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0D1B2A] mb-2">Registration Submitted</h2>
          <p className="text-gray-600 mb-6">
            Your email has been verified! Since you registered as a <strong>Seller</strong>, 
            your account requires Admin approval before you can access the dashboard.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800">
            You will be notified via email once your account is active (typically within 24 hours).
          </div>
          <Link to="/signin">
            <button className="w-full py-3 rounded-lg border-2 border-[#0D1B2A] text-[#0D1B2A] hover:bg-gray-50 transition-all">
              Return to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // --- VIEW 3: REGISTRATION FORM (DEFAULT) ---
  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-[#E8EDF2]">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded bg-[#0D1B2A]">
              <span className="text-xl text-[#2EC4B6]">B</span>
            </div>
            <span className="text-xl text-[#0D1B2A] font-bold">BizTech</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#0D1B2A]">Join BizTech Today</h1>
          <p className="text-[#6B7280]">Connect with partners and opportunities worldwide</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-[#0D1B2A]">Create Account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Account Type Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'seller' ? 'bg-white shadow text-[#0D1B2A]' : 'text-gray-500'}`}
                onClick={() => setRole('seller')}
              >
                I want to Sell
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'buyer' ? 'bg-white shadow text-[#0D1B2A]' : 'text-gray-500'}`}
                onClick={() => setRole('buyer')}
              >
                I want to Buy
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-200"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Company (Optional)</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-200"
                  placeholder="Company LLC"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-200"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-200"
                placeholder="+971 50 000 0000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 border-gray-200"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 border-gray-200"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1 text-gray-500">
              <p className={passwordValidation.minLength ? 'text-green-600' : ''}>• At least 8 characters</p>
              <p className={passwordValidation.hasNumber ? 'text-green-600' : ''}>• Contains a number</p>
              <p className={passwordValidation.hasUppercase ? 'text-green-600' : ''}>• Contains uppercase letter</p>
            </div>

            {role === 'seller' && (
              <div className="p-4 rounded-lg flex gap-3 bg-[#CFFAFE] border-l-4 border-[#2EC4B6]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#0891B2]" />
                <p className="text-sm text-[#0E7490]">
                  By registering as a seller, you agree to the 1% commission fee on successful sales.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium bg-[#0D1B2A] hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Creating Account...' : 'Next'}
            </button>

            <div className="text-center text-sm text-gray-500">
              Already have an account? <Link to="/signin" className="text-[#2EC4B6] font-medium hover:underline">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};