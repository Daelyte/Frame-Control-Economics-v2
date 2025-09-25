import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { validateEnvironment } from '../utils/security';

interface SecurityContextType {
  isSecure: boolean;
  securityErrors: string[];
  securityWarnings: string[];
}

const SecurityContext = createContext<SecurityContextType | null>(null);

interface SecurityProviderProps {
  children: ReactNode;
}

/**
 * SecurityProvider ensures the application environment is secure
 * before allowing access to community features
 */
export function SecurityProvider({ children }: SecurityProviderProps) {
  const [securityStatus, setSecurityStatus] = useState<SecurityContextType>({
    isSecure: false,
    securityErrors: [],
    securityWarnings: []
  });

  useEffect(() => {
    // Validate environment on startup
    const validation = validateEnvironment();
    const warnings: string[] = [];
    
    // Check for development-specific security warnings
    if (import.meta.env.DEV) {
      warnings.push('Running in development mode');
    }
    
    // Check if running on localhost vs production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      warnings.push('Running on localhost - ensure production uses HTTPS');
    }
    
    // Check for HTTPS in production
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      validation.errors.push('Production site must use HTTPS');
    }

    setSecurityStatus({
      isSecure: validation.valid,
      securityErrors: validation.errors,
      securityWarnings: warnings
    });

    // Log security status for debugging (development only)
    if (import.meta.env.DEV) {
      console.group('🔒 Security Status');
      console.log('Secure:', validation.valid);
      if (validation.errors.length > 0) {
        console.error('Errors:', validation.errors);
      }
      if (warnings.length > 0) {
        console.warn('Warnings:', warnings);
      }
      console.groupEnd();
    }
  }, []);

  // If there are security errors, show error screen instead of app
  if (!securityStatus.isSecure) {
    return <SecurityErrorScreen errors={securityStatus.securityErrors} />;
  }

  return (
    <SecurityContext.Provider value={securityStatus}>
      {children}
    </SecurityContext.Provider>
  );
}

/**
 * Hook to access security context
 */
export function useSecurityContext(): SecurityContextType {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
}

/**
 * Security error screen shown when environment validation fails
 */
function SecurityErrorScreen({ errors }: { errors: string[] }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-red-400">Security Configuration Error</h1>
        </div>
        
        <div className="space-y-3 mb-6">
          <p className="text-red-200">
            The application cannot start due to security configuration issues:
          </p>
          <ul className="list-disc list-inside space-y-1 text-red-300">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-800 rounded border border-slate-600">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Quick Fix:</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-400">
              <li>Check your <code className="bg-slate-700 px-1 rounded">.env.local</code> file</li>
              <li>Ensure all required environment variables are set</li>
              <li>Verify Supabase URL and key are correct</li>
              <li>Restart the development server</li>
            </ol>
          </div>

          <div className="text-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Development-only security warnings component
 */
export function SecurityWarnings() {
  const { securityWarnings } = useSecurityContext();

  // Only show in development
  if (!import.meta.env.DEV || securityWarnings.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 z-50">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
        <span className="text-sm font-medium text-yellow-400">Security Warnings</span>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {securityWarnings.map((warning, index) => (
          <li key={index} className="text-xs text-yellow-300">{warning}</li>
        ))}
      </ul>
    </div>
  );
}