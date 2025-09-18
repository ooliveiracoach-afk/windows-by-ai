import React, { useRef, useCallback, useEffect } from 'react';
import type { WindowInstance } from '../types';
import { audioService } from '../services/audioService';

interface WindowProps {
  instance: WindowInstance;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  setWindows: React.Dispatch<React.SetStateAction<WindowInstance[]>>;
  onCloseEnd: () => void;
  onMinimizeEnd: () => void;
}

export const Window: React.FC<WindowProps> = ({ 
    instance, 
    onClose, 
    onMinimize, 
    onFocus, 
    children, 
    setWindows,
    onCloseEnd,
    onMinimizeEnd,
}) => {
  const dragRef = useRef({ x: 0, y: 0, isDragging: false });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onFocus();
    dragRef.current = {
      x: e.clientX - instance.x,
      y: e.clientY - instance.y,
      isDragging: true,
    };
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  }, [instance.x, instance.y, onFocus]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    setWindows(prev =>
      prev.map(win =>
        win.id === instance.id
          ? { ...win, x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y }
          : win
      )
    );
  }, [instance.id, setWindows]);

  const handleDragEnd = useCallback(() => {
    dragRef.current.isDragging = false;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  }, [handleDragMove]);

  useEffect(() => {
    if (instance.isMinimizing && windowRef.current) {
      const targetElement = document.getElementById(`taskbar-btn-${instance.id}`);
      if (targetElement) {
        const windowRect = windowRef.current.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const windowCenterX = windowRect.left + windowRect.width / 2;
        const translateX = targetCenterX - windowCenterX;
        const translateY = targetRect.top - windowRect.top;

        windowRef.current.style.setProperty('--minimize-translate-x', `${translateX}px`);
        windowRef.current.style.setProperty('--minimize-translate-y', `${translateY}px`);
      }
    }
  }, [instance.isMinimizing, instance.id]);

  const handleAnimationEnd = () => {
    if (instance.isClosing) {
      onCloseEnd();
    }
    if (instance.isMinimizing) {
      onMinimizeEnd();
    }
  };
  
  const handleMinimizeClick = () => {
    audioService.playSound('click');
    onMinimize();
  };

  const handleCloseClick = () => {
    audioService.playSound('click');
    onClose();
  };

  const getAnimationClass = () => {
    if (instance.isClosing) return 'animate-fade-out';
    if (instance.isMinimizing) return 'animate-minimize';
    return 'animate-fade-in';
  };

  return (
    <div
      ref={windowRef}
      className={`absolute bg-slate-800/70 backdrop-blur-lg rounded-lg shadow-2xl border border-slate-600/50 flex flex-col ${getAnimationClass()}`}
      style={{
        left: instance.x,
        top: instance.y,
        width: instance.width,
        height: instance.height,
        zIndex: instance.zIndex,
      }}
      onMouseDown={onFocus}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className="h-8 bg-slate-900/50 rounded-t-lg flex items-center justify-between px-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center space-x-2">
            <span className="w-5 h-5">{instance.icon}</span>
            <span className="text-sm font-medium truncate">{instance.title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleMinimizeClick} className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-black font-bold text-lg">
            -
          </button>
          <button onClick={handleCloseClick} className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-black font-bold text-sm">
            ✕
          </button>
        </div>
      </div>
      <div className="flex-1 p-1 overflow-hidden">
        {children}
      </div>
      <style>{`
        @keyframes fadeIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
        }
        .animate-fade-out {
            animation: fadeOut 0.2s ease-in forwards;
        }
        @keyframes minimize {
            from {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            to {
                transform: translate(var(--minimize-translate-x, 0), var(--minimize-translate-y, 0)) scale(0.1);
                opacity: 0;
            }
        }
        .animate-minimize {
            animation: minimize 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
            transform-origin: top left;
        }
      `}</style>
    </div>
  );
};
