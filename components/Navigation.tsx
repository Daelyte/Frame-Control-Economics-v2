import React from 'react';
import { motion } from 'framer-motion';
import DragonButton from '../src/components/buttons/DragonButton';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const handleLiveSiteClick = () => {
    window.open('https://frame-control.netlify.app/', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1F7A72] to-[#FF3B30] flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div className="text-white font-semibold text-lg tracking-wide">
              Frame Economics
            </div>
          </motion.div>

          {/* Center Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a
              href="#mastery"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Mastery
            </motion.a>
            <motion.a
              href="#experience"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Experience
            </motion.a>
            <motion.a
              href="#contact"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Contact
            </motion.a>
          </div>

          {/* Right Side - Dragon Button */}
          <div className="flex items-center space-x-4">
            <DragonButton
              onClick={handleLiveSiteClick}
              variant="intense"
              ariaLabel="Visit live Frame Economics website"
              className="hidden sm:block"
            >
              🐲 Live Site
            </DragonButton>
            
            {/* Mobile Dragon Button - Compact */}
            <DragonButton
              onClick={handleLiveSiteClick}
              variant="normal"
              ariaLabel="Visit live Frame Economics website"
              className="sm:hidden text-sm px-3"
            >
              🐲
            </DragonButton>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;