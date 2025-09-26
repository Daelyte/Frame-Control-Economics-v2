import React, { useState, useEffect } from "react";
import FrameEconomicsWebsite from "./FrameEconomicsWebsite";
import ThemeToggle from "./ThemeToggle";
import SkipLink from "./components/SkipLink";
import { AuthProvider } from "./contexts/AuthContext";
// Temporarily disable device detection to fix blank site
// import { initDeviceDetection, getDeviceInfo } from "./utils/deviceDetection";
import { Menu, X } from "lucide-react";

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo());

  // Temporarily disable device detection to fix blank site
  // useEffect(() => {
  //   initDeviceDetection();
  //   const handleResize = () => {
  //     setDeviceInfo(getDeviceInfo());
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

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
        
        
        {/* Main content */}
        <main id="main" className="animate-fade-in" role="main">
          <FrameEconomicsWebsite />
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;