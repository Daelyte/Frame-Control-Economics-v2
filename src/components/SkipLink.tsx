import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      href="#main"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;