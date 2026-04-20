import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, user, isMocked } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await signup(email, password);
    }

    setLoading(false);

    if (res.error) {
      setError(res.error.message || 'An error occurred.');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-dark-900">
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary-600 text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-32 w-96 h-96 rounded-full bg-primary-500 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 rounded-full bg-primary-700 blur-3xl opacity-50"></div>
        <div className="z-10 text-center max-w-md">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md">
             <LayoutDashboard size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">FreelanceFlow</h1>
          <p className="text-lg text-primary-100">
            Smart Finance & Invoice Manager for Creators. Track income, expenses, and issue beautiful invoices all in one place.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center p-8 sm:p-12 z-10">
        <div className="w-full max-w-md bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-dark-800">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isMocked ? "Running in Mock Mode - Enter any email to continue" : "Enter your credentials below"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-primary-600/20"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 dark:text-primary-500 hover:text-primary-700 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
