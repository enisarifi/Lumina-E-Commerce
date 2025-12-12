import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { login } from '../services/auth';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('user@lumina.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      onLogin(user);
      navigate(user.role === 'admin' ? '/admin' : '/profile');
    } catch (err) {
      setError('Invalid email or password. Try "user@lumina.com" / "password"');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-black rounded-xl mb-4 transform rotate-12">
            <Package size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-2">Sign in to your Lumina account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-transparent outline-none transition-all caret-white"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-transparent outline-none transition-all caret-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <button 
              type="button" 
              onClick={() => navigate('/forgot-password')}
              className="text-brand-600 hover:text-black font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? {' '}
            <button onClick={() => navigate('/register')} className="text-black font-bold hover:underline">Create Account</button>
          </p>
        </div>
      </div>
    </div>
  );
};