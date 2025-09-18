
import React from 'react';
import type { AppProps } from '../../types';
import { ICONS } from '../../constants';

export const AboutPC: React.FC<AppProps> = () => {
  return (
    <div className="w-full h-full bg-slate-900 text-slate-300 p-6 flex flex-col">
        <div className="flex items-center space-x-4 mb-6">
            <ICONS.WinIcon className="w-20 h-20 text-cyan-400" />
            <div>
                <h1 className="text-3xl font-bold text-white">Windows 6.1</h1>
                <p className="text-slate-400">GMM Alternate Timeline Edition</p>
                <p className="text-xs text-slate-500">© 2024 GMM Corporation. All rights reserved.</p>
            </div>
        </div>
        
        <div className="border-t border-slate-700 pt-4 text-sm space-y-3">
            <h2 className="text-lg font-semibold text-white mb-2">System Information</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="font-medium text-slate-400">Processor:</span>
                <span>Gemini Quantum Core @ 7.0 GHz</span>

                <span className="font-medium text-slate-400">Installed RAM:</span>
                <span>128 GB (Chrono-RAM)</span>

                <span className="font-medium text-slate-400">System type:</span>
                <span>128-bit Operating System, x128-based processor</span>

                <span className="font-medium text-slate-400">Pen and Touch:</span>
                <span>Neural Interface Support Available</span>
            </div>
        </div>
        
        <div className="border-t border-slate-700 pt-4 mt-6 text-sm flex-1">
             <h2 className="text-lg font-semibold text-white mb-2">Windows Activation</h2>
             <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Windows is activated via universal consciousness.</span>
             </div>
        </div>
        <div className="text-center text-xs text-slate-500">
            This operating system is a work of fiction.
        </div>
    </div>
  );
};
