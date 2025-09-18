import React from 'react';

export const ShutdownScreen: React.FC = () => {
  return (
    <div
      className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white transition-opacity duration-500 animate-fade-in-boot"
    >
        <p className="text-lg text-slate-300 mb-4">Shutting down...</p>
        <p className="text-sm text-slate-500">It is now safe to close this tab.</p>
      <style>{`
        @keyframes fade-in-boot {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-boot {
          animation: fade-in-boot 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
