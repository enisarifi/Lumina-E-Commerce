import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to send reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-black rounded-xl mb-4 transform rotate-12">
            <Package size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-gray-400 text-sm mt-2">Enter your email to receive instructions</p>
        </div>

        {isSent ? (
          <div className="p-8 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Check your email</h3>
              <p className="text-gray-500 mt-2 text-sm">
                We've sent password reset instructions to <span className="font-semibold text-gray-900">{email}</span>
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Did not receive the email? Check your spam filter or try another email address.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl mt-4"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Send Reset Link <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="text-center pt-2">
               <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-gray-500 hover:text-black font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};