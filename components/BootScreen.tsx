import React from 'react';
import { ICONS } from '../constants';

interface BootScreenProps {
  isFadingOut: boolean;
}

export const BootScreen: React.FC<BootScreenProps> = ({ isFadingOut }) => {
  return (
    <div
      className={`w-screen h-screen bg-black flex flex-col items-center justify-center text-white transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center animate-fade-in-boot">
        <ICONS.WinIcon className="w-24 h-24 text-cyan-400 mb-6" />
        <p className="text-lg text-slate-300 mb-8">Starting Windows 6.1</p>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.4s]"></span>
          <span className="w-3 h-3 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.2s]"></span>
          <span className="w-3 h-3 bg-slate-500 rounded-full animate-pulse"></span>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-boot {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-boot {
          animation: fade-in-boot 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
