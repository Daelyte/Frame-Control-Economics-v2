import React from "react";
import FrameEconomicsWebsite from "./FrameEconomicsWebsite";
import ThemeToggle from "./ThemeToggle";

const App: React.FC = () => {
  return (
    <main className="min-h-screen page-light dark:page-gradient transition-colors duration-300">
      {/* Theme toggle positioned in top-right */}
      <div className="container mx-auto px-4 pt-4 flex justify-end">
        <ThemeToggle />
      </div>
      
      {/* Main content */}
      <div className="animate-fade-in">
        <FrameEconomicsWebsite />
      </div>
    </main>
  );
};

export default App;