import React, { useState, useEffect } from "react";
import FrameEconomicsWebsite from "./FrameEconomicsWebsite";
import ThemeToggle from "./ThemeToggle";
import SkipLink from "./components/SkipLink";
import { AuthProvider } from "./contexts/AuthContext";
import { initDeviceDetection, getDeviceInfo } from "./utils/deviceDetection";
import { Menu, X } from "lucide-react";

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo());

  useEffect(() => {
    // Initialize device detection
    initDeviceDetection();
    
    // Update device info on resize
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen page-light dark:page-gradient transition-colors duration-300">
        <SkipLink />
        
        {/* Enhanced professional top navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/30 dark:border-slate-700/30 shadow-lg shadow-black/5" role="navigation" aria-label="Main navigation">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Enhanced Logo/Brand */}
              <div className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <span className="text-white font-bold text-xs sm:text-sm animate-glow">FE</span>
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent">
                  <span className="hidden xs:inline">Frame Economics</span>
                  <span className="xs:hidden">Frame Econ</span>
                </span>
                {/* Device indicator for development */}
                {process.env.NODE_ENV === 'development' && (
                  <span className="text-xs text-green-500 opacity-75 hidden lg:inline">
                    {deviceInfo.screenSize.toUpperCase()} • {deviceInfo.isTouch ? 'Touch' : 'Mouse'}
                  </span>
                )}
              </div>
              
              {/* Enhanced Desktop nav links */}
              <div className="hidden md:flex items-center gap-1 lg:gap-2">
                <a href="#introduction" className="relative px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group">
                  Home
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
                <a href="#about" className="relative px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group">
                  About
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
                <a href="#rules" className="relative px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group">
                  Rules
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
                <a href="#community" className="relative px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group">
                  Community
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
                <a href="#connect" className="relative px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group">
                  Connect
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
                {/* Quick action button for desktop users */}
                <a href="#assessment" className="ml-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm">
                  Start Assessment
                </a>
              </div>
              
              {/* Mobile menu button and theme toggle */}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  aria-label="Toggle mobile menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200/20 dark:border-slate-700/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg animate-slide-up">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col space-y-3">
                  <a 
                    href="#introduction" 
                    onClick={closeMobileMenu}
                    className="group flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 border-b border-slate-200/20 dark:border-slate-700/20"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    Home
                  </a>
                  <a 
                    href="#about" 
                    onClick={closeMobileMenu}
                    className="group flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 border-b border-slate-200/20 dark:border-slate-700/20"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    About
                  </a>
                  <a 
                    href="#rules" 
                    onClick={closeMobileMenu}
                    className="group flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 border-b border-slate-200/20 dark:border-slate-700/20"
                  >
                    <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    Rules
                  </a>
                  <a 
                    href="#community" 
                    onClick={closeMobileMenu}
                    className="group flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 border-b border-slate-200/20 dark:border-slate-700/20"
                  >
                    <div className="w-2 h-2 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    Community
                  </a>
                  <a 
                    href="#connect" 
                    onClick={closeMobileMenu}
                    className="group flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    Connect
                  </a>
                  {/* Mobile CTA */}
                  <div className="pt-4 mt-2 border-t border-slate-200/20 dark:border-slate-700/20">
                    <a 
                      href="#assessment" 
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Start Assessment
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
        
        {/* Main content */}
        <main id="main" className="animate-fade-in" role="main">
          <FrameEconomicsWebsite />
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;