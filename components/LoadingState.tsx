
import React, { useState, useEffect } from 'react';

const messages = [
  "Synchronizing sensors...",
  "Calibrating flash intensity...",
  "Developing film grain...",
  "Analyzing shadow depth...",
  "Rendering matte textures...",
  "Drying the print...",
  "Finalizing frame composition..."
];

const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[400px] space-y-8">
      <div className="relative">
        <div className="w-24 h-24 border-2 border-white/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-white rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
        </div>
      </div>
      <div className="text-center">
        <p className="mono text-xs uppercase tracking-widest text-white/40 mb-2">Processing</p>
        <p className="text-xl font-light tracking-wide animate-pulse">{messages[msgIndex]}</p>
      </div>
    </div>
  );
};

export default LoadingState;
