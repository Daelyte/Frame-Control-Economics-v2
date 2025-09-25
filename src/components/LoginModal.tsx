import React, { useState } from 'react';
import { Github, Mail, X, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Join the Frame Economics Community",
  description = "Connect with fellow learners and share your journey"
}) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState<'github' | 'google' | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async (provider: 'github' | 'google') => {
    setLoading(provider);
    setError(null);
    
    try {
      const { error } = await signIn(provider);
      if (error) {
        setError(error.message);
      } else {
        // Success - the auth state change will be handled by the AuthContext
        onClose();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sign In
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            {description}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleSignIn('github')}
            disabled={loading !== null}
            className={`
              w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200
              ${loading === 'github' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 hover:bg-gray-800 text-white hover:shadow-lg transform hover:scale-105'
              }
            `}
          >
            {loading === 'github' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Github className="w-5 h-5" />
            )}
            {loading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
          </button>

          <button
            onClick={() => handleSignIn('google')}
            disabled={loading !== null}
            className={`
              w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200
              ${loading === 'google' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transform hover:scale-105'
              }
            `}
          >
            {loading === 'google' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Mail className="w-5 h-5" />
            )}
            {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4" />
            <span>Your privacy is protected. We only use your email and name to create your profile.</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By signing in, you agree to participate respectfully in our learning community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;