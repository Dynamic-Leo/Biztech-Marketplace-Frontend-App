import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset - in production, this would call an API
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center" style={{ backgroundColor: '#E8EDF2' }}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#CFFAFE' }}>
              <CheckCircle className="w-8 h-8" style={{ color: '#2EC4B6' }} />
            </div>
            <h2 className="mb-2" style={{ color: '#0D1B2A' }}>Check Your Email</h2>
            <p className="mb-6" style={{ color: '#6B7280' }}>
              We&apos;ve sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <Link to="/signin">
              <button
                className="w-full py-3 rounded-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#0D1B2A',
                  color: 'white'
                }}
              >
                Back to Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center" style={{ backgroundColor: '#E8EDF2' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2" style={{ color: '#0D1B2A' }}>Reset Password</h1>
          <p style={{ color: '#6B7280' }}>Enter your email to receive reset instructions</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#374151' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: '#E5E7EB',
                    color: '#374151'
                  }}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg transition-all hover:opacity-90 hover:cursor-pointer"
              style={{
                backgroundColor: '#0D1B2A',
                color: 'white'
              }}
            >
              Send Reset Link
            </button>

            {/* Back to Sign In */}
            <Link to="/signin">
              <button
                type="button"
                className="w-full py-3 rounded-lg border-2 transition-all hover:bg-opacity-5 flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-[#dbdbdb] border-[#E5E7EB] hover:border-[#c9c9c9]"
                style={{
                  // borderColor: '#E5E7EB',
                  // color: '#6B7280',
                  // backgroundColor: 'transparent'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
