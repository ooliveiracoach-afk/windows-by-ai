import React, { useState, useEffect } from 'react';
import type { WindowInstance } from '../types';
import { ICONS } from '../constants';
import { audioService } from '../services/audioService';

interface TaskbarProps {
  openWindows: WindowInstance[];
  onToggleStart: () => void;
  onRestore: (windowId: number) => void;
  onFocus: (windowId: number) => void;
}

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    // This key is essential to re-trigger the animation on every update.
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
            setAnimationKey(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    // Using formatToParts to safely get time components for any locale
    const parts = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(time);

    const timeElements = parts.map((part, index) => {
        if (part.type === 'second') {
            return (
                <span key={animationKey} className="animate-second-tick opacity-70">
                    {part.value}
                </span>
            );
        }
        // Make the separator before the seconds less prominent as well
        if (part.type === 'literal' && parts[index + 1]?.type === 'second') {
             return <span key={index} className="opacity-70">{part.value}</span>;
        }
        return <span key={index}>{part.value}</span>;
    });

    return (
        <div className="flex flex-col items-center justify-center px-4 text-xs">
            <div className="tabular-nums tracking-wider">
                {timeElements}
            </div>
            <span>{time.toLocaleDateString()}</span>
            <style>{`
                @keyframes second-tick {
                    from { opacity: 0.3; transform: translateY(2px); }
                    to { opacity: 0.7; transform: translateY(0px); }
                }
                .animate-second-tick {
                    display: inline-block; /* Required for transforms */
                    animation: second-tick 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </div>
    );
};


export const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onToggleStart, onRestore, onFocus }) => {
    const [isStartAnimating, setStartAnimating] = useState(false);
    
    const handleTabClick = (win: WindowInstance) => {
        audioService.playSound('click');
        if(win.isMinimized) {
            onRestore(win.id);
        } else {
            onFocus(win.id);
        }
    }

    const handleStartClick = () => {
        audioService.playSound('click');
        setStartAnimating(true);
        onToggleStart();
    }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/70 backdrop-blur-md flex items-center z-[100000] border-t border-slate-700/50">
      <button
        onClick={handleStartClick}
        className="h-full w-12 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
      >
        <ICONS.WinIcon 
            className={`w-6 h-6 text-cyan-400 ${isStartAnimating ? 'animate-start-pop' : ''}`}
            onAnimationEnd={() => setStartAnimating(false)}
        />
      </button>

      <div className="flex-1 h-full flex items-center space-x-1 px-2">
        {openWindows.map(win => (
          <button
            key={win.id}
            id={`taskbar-btn-${win.id}`}
            onClick={() => handleTabClick(win)}
            className={`flex items-center space-x-2 h-10 px-3 rounded-md transition-colors duration-200 text-sm truncate ${win.isMinimized ? 'bg-white/5 hover:bg-white/10' : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-b-2 border-cyan-400'}`}
          >
            <span className="w-5 h-5">{win.icon}</span>
            <span className="truncate max-w-[120px]">{win.title}</span>
          </button>
        ))}
      </div>
      
      <Clock />
      <style>{`
        @keyframes start-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.85); }
        }
        .animate-start-pop {
          animation: start-pop 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
