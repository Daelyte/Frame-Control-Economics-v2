import React, { useEffect } from "react";
import { ModernDemo } from "./components/ModernDemo";
import { WebVitalsMonitor, reportWebVitals } from "./utils/webVitals";
// import { AuthProvider } from "./contexts/AuthContext"; // Temporarily disabled

// Modern Frame Economics Demo with:
// - OKLCH color system for perceptual uniformity
// - Container queries for intelligent responsive design  
// - Optimized motion system with accessibility
// - Performance-focused architecture

const App: React.FC = () => {
  console.log('App rendering...');
  
  // Initialize Web Vitals monitoring
  useEffect(() => {
    const monitor = new WebVitalsMonitor(reportWebVitals);
    
    return () => {
      monitor.destroy();
    };
  }, []);
  
  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-0, #ffffff)' }}>
      <ModernDemo />
    </div>
  );
};

export default App;
