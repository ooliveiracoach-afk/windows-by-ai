import React, { useRef, useEffect } from 'react';
import { APPS, ICONS } from '../constants';
import { audioService } from '../services/audioService';

interface StartMenuProps {
  openApp: (appId: string) => void;
  closeMenu: () => void;
  onShutdown: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ openApp, closeMenu, onShutdown }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeMenu]);

    const handleAppClick = (appId: string) => {
        audioService.playSound('click');
        openApp(appId);
    };
    
    const handleShutdownClick = () => {
        audioService.playSound('click');
        onShutdown();
    };

  return (
    <div 
        ref={menuRef}
        className="absolute bottom-12 left-0 w-80 h-auto max-h-[70vh] bg-slate-800/80 backdrop-blur-lg rounded-tr-lg rounded-bl-none rounded-tl-none rounded-br-lg z-[99999] border border-slate-700/50 flex flex-col overflow-hidden"
        style={{ animation: 'slideUp 0.2s ease-out' }}
    >
      <div className="p-4 bg-slate-900/50">
          <h2 className="text-xl font-semibold">Windows 6.1</h2>
          <p className="text-xs text-slate-400">GMM Alternative Timeline Edition</p>
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {APPS.map(app => (
            <li key={app.id}>
              <button
                onClick={() => handleAppClick(app.id)}
                className="w-full flex items-center space-x-4 p-3 rounded-md hover:bg-cyan-500/20 transition-colors duration-200 text-left"
              >
                <div className="w-6 h-6 flex-shrink-0">{app.icon}</div>
                <span className="text-sm font-medium">{app.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
       <div className="border-t border-slate-700/50 p-2">
            <button
                onClick={handleShutdownClick}
                className="w-full flex items-center space-x-4 p-3 rounded-md hover:bg-red-500/20 transition-colors duration-200 text-left"
            >
                <ICONS.PowerIcon className="w-6 h-6 flex-shrink-0 text-red-400"/>
                <span className="text-sm font-medium">Shut Down</span>
            </button>
       </div>
       <style>{`
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
       `}</style>
    </div>
  );
};
