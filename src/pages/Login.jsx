import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login/', form);
      login(res.data.user, {
        access: res.data.access,
        refresh: res.data.refresh,
      });
      navigate('/');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 p-3 lg:p-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
      <div className="w-full flex flex-col items-center justify-center p-6 lg:p-8 bg-slate-50">

        
        {/* Invenger Logo */}
        <div className="flex justify-center mb-6">
          <img src="/invenger-logo.png" alt="Invenger Logo" className="h-10 object-contain drop-shadow-sm" />
        </div>

        {/* Card */}
        <div className="w-full max-w-[340px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-7">

          {/* Header */}
<div className="text-center mb-4">

  {/* <div className="flex justify-center">
    <img
      src="/logo.png"
      alt="Inovatrix Logo"
      className="h-24 w-auto object-contain"
    />
  </div> */}

  <h2 className="text-xl font-bold text-gray-800 mt-2">
    Welcome back
  </h2>

  <p className="text-gray-400 text-sm mt-1 font-medium">
    Sign in to your HR portal
  </p>

</div>
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-5 text-xs font-semibold text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-gray-600 text-[11px] font-bold block mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-600 text-[11px] font-bold block mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Sign In button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-all duration-200 text-sm w-full shadow-md shadow-cyan-500/20"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <p className="text-gray-400 text-[11px] text-center mt-5 font-medium uppercase tracking-wide">
            🔒 Restricted to HR personnel
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;