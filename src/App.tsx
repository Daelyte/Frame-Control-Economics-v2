import React from "react";
import { ModernDemo } from "./components/ModernDemo";
// import { AuthProvider } from "./contexts/AuthContext"; // Temporarily disabled

// Modern Frame Economics Demo with:
// - OKLCH color system for perceptual uniformity
// - Container queries for intelligent responsive design  
// - Optimized motion system with accessibility
// - Performance-focused architecture

const App: React.FC = () => {
  console.log('App rendering...');
  
  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-0, #ffffff)' }}>
      <ModernDemo />
    </div>
  );
};

export default App;
