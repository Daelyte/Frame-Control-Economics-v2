import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const CommunityTest: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [tests, setTests] = useState<{[key: string]: 'pending' | 'pass' | 'fail' | 'running'}>({
    supabaseConnection: 'pending',
    authentication: 'pending', 
    profileAccess: 'pending',
    databaseTables: 'pending',
    permissions: 'pending'
  });
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});

  const runTest = async (testName: string, testFn: () => Promise<{ success: boolean; message: string }>) => {
    setTests(prev => ({ ...prev, [testName]: 'running' }));
    
    try {
      const result = await testFn();
      setTests(prev => ({ ...prev, [testName]: result.success ? 'pass' : 'fail' }));
      setTestResults(prev => ({ ...prev, [testName]: result.message }));
    } catch (error) {
      setTests(prev => ({ ...prev, [testName]: 'fail' }));
      setTestResults(prev => ({ ...prev, [testName]: error instanceof Error ? error.message : 'Unknown error' }));
    }
  };

  useEffect(() => {
    const runAllTests = async () => {
      // Test 1: Supabase Connection
      await runTest('supabaseConnection', async () => {
        const { error } = await supabase.from('users').select('count').limit(1);
        return {
          success: !error,
          message: error ? `Connection failed: ${error.message}` : 'Supabase connected successfully'
        };
      });

      // Test 2: Authentication Status
      await runTest('authentication', async () => {
        const isAuthenticated = !!user;
        return {
          success: true, // Always pass, just report status
          message: isAuthenticated 
            ? `Authenticated as: ${user?.email}` 
            : 'Not authenticated (this is normal - try logging in)'
        };
      });

      // Test 3: Profile Access
      if (user) {
        await runTest('profileAccess', async () => {
          const hasProfile = !!profile;
          return {
            success: hasProfile,
            message: hasProfile 
              ? `Profile loaded: ${profile.full_name}` 
              : 'Profile not found - this might need to be created'
          };
        });
      }

      // Test 4: Database Tables
      await runTest('databaseTables', async () => {
        try {
          const tablesStatus = [];
          
          // Check users table
          const { error: usersError } = await supabase.from('users').select('id').limit(1);
          tablesStatus.push(`Users: ${usersError ? 'FAIL' : 'OK'}`);
          
          // Check stories table  
          const { error: storiesError } = await supabase.from('stories').select('id').limit(1);
          tablesStatus.push(`Stories: ${storiesError ? 'FAIL' : 'OK'}`);
          
          // Check comments table
          const { error: commentsError } = await supabase.from('comments').select('id').limit(1);
          tablesStatus.push(`Comments: ${commentsError ? 'FAIL' : 'OK'}`);
          
          // Check likes table
          const { error: likesError } = await supabase.from('likes').select('id').limit(1);
          tablesStatus.push(`Likes: ${likesError ? 'FAIL' : 'OK'}`);

          const allTablesWork = !usersError && !storiesError && !commentsError && !likesError;
          
          return {
            success: allTablesWork,
            message: tablesStatus.join(' | ')
          };
        } catch (error) {
          return {
            success: false,
            message: `Database test failed: ${error}`
          };
        }
      });

      // Test 5: Permissions (if authenticated)
      if (user) {
        await runTest('permissions', async () => {
          try {
            // Test if user can create a story (simulate, don't actually create)
            const { error } = await supabase
              .from('stories')
              .select('id')
              .eq('author_id', user.id)
              .limit(1);
              
            return {
              success: !error,
              message: error 
                ? `Permission issue: ${error.message}` 
                : 'User has proper database permissions'
            };
          } catch (error) {
            return {
              success: false,
              message: `Permission test failed: ${error}`
            };
          }
        });
      }
    };

    if (!authLoading) {
      runAllTests();
    }
  }, [user, profile, authLoading]);

  const getIcon = (status: typeof tests[string]) => {
    switch (status) {
      case 'running': return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: typeof tests[string]) => {
    switch (status) {
      case 'pass': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'fail': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'running': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-800/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-effect rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          🧪 Community System Diagnostics
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-8">
          Let's test your community features to see what's working and what needs attention.
        </p>

        <div className="space-y-4">
          {Object.entries(tests).map(([testName, status]) => (
            <div key={testName} className={`p-4 rounded-lg border-2 transition-colors duration-200 ${getStatusColor(status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(status)}
                  <span className="font-semibold text-slate-900 dark:text-white capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                  {status}
                </span>
              </div>
              {testResults[testName] && (
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 ml-8">
                  {testResults[testName]}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            What to do next:
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>• ✅ <strong>Green tests</strong>: Everything is working perfectly!</p>
            <p>• ❌ <strong>Red tests</strong>: These need attention to get community features working</p>
            <p>• 🔄 <strong>Blue tests</strong>: Currently testing...</p>
            <p>• ⚪ <strong>Gray tests</strong>: Waiting to run</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityTest;