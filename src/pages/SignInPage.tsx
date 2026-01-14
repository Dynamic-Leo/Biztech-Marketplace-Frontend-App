import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // UI State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);

      const storedUser = localStorage.getItem('biztech_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(`/dashboard/${user.role}`);
      }
    } catch (err: any) {
      // 🔐 EMAIL NOT VERIFIED → Verify Email page
      if (
        err.status === 403 &&
        err.message?.toLowerCase().includes('verify')
      ) {
        navigate('/verify-email', {
          state: { email: formData.email },
        });
        return;
      }

      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center" style={{ backgroundColor: '#E8EDF2' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2" style={{ color: '#0D1B2A' }}>Welcome Back</h1>
          <p style={{ color: '#6B7280' }}>Sign in to access your dashboard</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="mb-2" style={{ color: '#0D1B2A' }}>Sign In</h2>
          <p className="mb-6" style={{ color: '#6B7280' }}>Enter your credentials to continue</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2" style={{ color: '#374151' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#E5E7EB', color: '#374151' }}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm" style={{ color: '#374151' }}>
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm" style={{ color: '#2EC4B6' }}>
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-12"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9CA3AF' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-5 hover:cursor-pointer"
              style={{ backgroundColor: '#0D1B2A', color: 'white' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#E5E7EB' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white" style={{ color: '#6B7280' }}>New to Biz Marketplace?</span>
              </div>
            </div>

            <Link to="/register">
              <button
                type="button"
                className="w-full py-3 rounded-lg border-2 transition-all hover:bg-opacity-5 hover:cursor-pointer hover:bg-[#dbdbdb] border-[#E5E7EB] hover:border-[#c9c9c9]"
              >
                Create an Account
              </button>
            </Link>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: '#6B7280' }}>
          By signing in, you agree to our{' '}
          <Link to="/terms" style={{ color: '#2EC4B6' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" style={{ color: '#2EC4B6' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};