
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-white/10 py-6 px-8 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-xl font-extrabold tracking-tighter uppercase italic">Aura Noir</h1>
      </div>
      <div className="flex gap-6 text-xs uppercase tracking-widest font-semibold text-white/50">
        <span className="hover:text-white cursor-pointer transition-colors">Archive</span>
        <span className="hover:text-white cursor-pointer transition-colors">About</span>
        <span className="hover:text-white cursor-pointer transition-colors text-white border-b border-white">Generator</span>
      </div>
    </header>
  );
};

export default Header;
