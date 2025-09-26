import React from "react";
import FrameEconomicsWebsite from "./FrameEconomicsWebsite";
import ThemeToggle from "./ThemeToggle";
import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <main className="min-h-screen page-light dark:page-gradient transition-colors duration-300">
        {/* Professional top navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/20 dark:border-slate-700/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo/Brand */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FE</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Frame Economics
                </span>
              </div>
              
              {/* Simple nav links */}
              <div className="hidden md:flex items-center gap-6">
                <a href="#introduction" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Home
                </a>
                <a href="#about" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  About
                </a>
                <a href="#rules" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Rules
                </a>
                <a href="#community" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Community
                </a>
                <a href="#connect" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Connect
                </a>
              </div>
              
              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </div>
        </nav>
        
        {/* Main content */}
        <div className="animate-fade-in">
          <FrameEconomicsWebsite />
        </div>
      </main>
    </AuthProvider>
  );
};

export default App;