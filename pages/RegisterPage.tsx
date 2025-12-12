import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Lock, Mail, User as UserIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { register } from '../services/auth';
import { User } from '../types';

interface RegisterPageProps {
  onLogin: (user: User) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
    }

    try {
      const user = await register(formData.name, formData.email, formData.password);
      onLogin(user);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-black rounded-xl mb-4 transform -rotate-12">
            <Package size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-2">Join Lumina for exclusive offers</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-transparent outline-none transition-all caret-white"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-transparent outline-none transition-all caret-white"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-transparent outline-none transition-all caret-white"
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? {' '}
            <button onClick={() => navigate('/login')} className="text-black font-bold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};