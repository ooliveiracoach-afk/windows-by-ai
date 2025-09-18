import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import type { WindowInstance, AppDef } from './types';
import { APPS } from './constants';
import { Window } from './components/Window';
import { BootScreen } from './components/BootScreen';
import { ShutdownScreen } from './components/ShutdownScreen';
import { audioService } from './services/audioService';

type ShutdownState = 'off' | 'pending' | 'final';

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState('https://picsum.photos/1920/1080');
  const [isBooting, setIsBooting] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shutdownState, setShutdownState] = useState<ShutdownState>('off');
  const nextWindowId = useRef(0);
  const zIndexCounter = useRef(10);

  // Effect for handling the boot sequence
  useEffect(() => {
    const bootTime = 3000; // How long the boot screen stays visible
    const fadeTime = 500;  // Duration of the fade-out animation

    const bootTimer = setTimeout(() => {
      setIsFadingOut(true); // Start fading out
      setTimeout(() => {
        setIsBooting(false); // Remove boot screen from DOM
      }, fadeTime);
    }, bootTime);

    return () => clearTimeout(bootTimer);
  }, []);

  // Effect for playing startup sound and unlocking audio context
  useEffect(() => {
    // Unlock audio on first user interaction
    const unlockAudio = () => {
        audioService.unlockAudio();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    
    // Play startup sound once boot is finished
    if (!isBooting) {
        audioService.playSound('startup');
    }

    return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };
  }, [isBooting]);

  // Effect to transition to final shutdown screen after windows close
  useEffect(() => {
    if (shutdownState === 'pending' && windows.length === 0) {
      const timer = setTimeout(() => {
        setShutdownState('final');
      }, 500); // A short delay after the last window closes
      return () => clearTimeout(timer);
    }
  }, [windows, shutdownState]);


  const openApp = useCallback((appId: string) => {
    const appDef = APPS.find(app => app.id === appId);
    if (!appDef) return;

    // Check if a window for this app is already open
    const existingWindow = windows.find(win => win.appId === appId && !appDef.allowMultiple);
    if (existingWindow) {
        // Bring existing window to front
        setWindows(prev => prev.map(win => win.id === existingWindow.id ? { ...win, zIndex: zIndexCounter.current++ } : win));
        if (existingWindow.isMinimized) {
            restoreApp(existingWindow.id);
        }
        return;
    }

    audioService.playSound('open');
    const newWindow: WindowInstance = {
      id: nextWindowId.current++,
      appId: appDef.id,
      title: appDef.title,
      icon: appDef.icon,
      x: Math.random() * 200 + 50,
      y: Math.random() * 100 + 50,
      width: appDef.defaultSize?.width || 600,
      height: appDef.defaultSize?.height || 400,
      isMinimized: false,
      zIndex: zIndexCounter.current++,
    };
    setWindows(prev => [...prev, newWindow]);
    setStartMenuOpen(false);
  }, [windows]);

  const closeApp = useCallback((windowId: number) => {
    audioService.playSound('close');
    setWindows(prev => prev.map(win => win.id === windowId ? { ...win, isClosing: true } : win));
  }, []);
  
  const finishClose = useCallback((windowId: number) => {
    setWindows(prev => prev.filter(win => win.id !== windowId));
  }, []);

  const minimizeApp = useCallback((windowId: number) => {
    audioService.playSound('minimize');
    setWindows(prev => prev.map(win => win.id === windowId ? { ...win, isMinimizing: true } : win));
  }, []);

  const finishMinimize = useCallback((windowId: number) => {
      setWindows(prev => prev.map(win => (
          win.id === windowId ? { ...win, isMinimized: true, isMinimizing: false } : win
      )));
  }, []);

  const restoreApp = useCallback((windowId: number) => {
     audioService.playSound('open');
     setWindows(prev => prev.map(win => {
        if (win.id === windowId) {
            return { ...win, isMinimized: false, zIndex: zIndexCounter.current++ };
        }
        return win;
    }));
  }, []);

  const bringToFront = useCallback((windowId: number) => {
    setWindows(prev => prev.map(win => {
      if (win.id === windowId) {
        return { ...win, zIndex: zIndexCounter.current++ };
      }
      return win;
    }));
  }, []);

  const toggleStartMenu = () => setStartMenuOpen(prev => !prev);
  
  const handleShutdown = () => {
    audioService.playSound('shutdown');
    setStartMenuOpen(false);
    if (windows.length === 0) {
        setShutdownState('pending');
        setTimeout(() => setShutdownState('final'), 1500);
    } else {
        setShutdownState('pending');
        setWindows(prev => prev.map(win => ({ ...win, isClosing: true })));
    }
  };

  const getAppDef = (appId: string): AppDef | undefined => APPS.find(app => app.id === appId);

  const contextValue = { openApp, setWallpaper };

  if (isBooting) {
    return <BootScreen isFadingOut={isFadingOut} />;
  }

  if (shutdownState === 'final') {
    return <ShutdownScreen />;
  }

  return (
    <div className={`w-screen h-screen bg-black font-sans text-white select-none transition-opacity duration-1000 ${shutdownState === 'pending' ? 'opacity-30 pointer-events-none' : ''}`}>
      <Desktop wallpaper={wallpaper}>
        {windows.filter(win => !win.isMinimized).map(win => {
          const appDef = getAppDef(win.appId);
          if (!appDef) return null;
          const AppComponent = appDef.component;
          return (
            <Window
              key={win.id}
              instance={win}
              onClose={() => closeApp(win.id)}
              onCloseEnd={() => finishClose(win.id)}
              onMinimize={() => minimizeApp(win.id)}
              onMinimizeEnd={() => finishMinimize(win.id)}
              onFocus={() => bringToFront(win.id)}
              setWindows={setWindows}
            >
                <AppComponent windowId={win.id} context={contextValue} />
            </Window>
          );
        })}
      </Desktop>
      {isStartMenuOpen && <StartMenu openApp={openApp} closeMenu={() => setStartMenuOpen(false)} onShutdown={handleShutdown} />}
      <Taskbar
        openWindows={windows}
        onToggleStart={toggleStartMenu}
        onRestore={restoreApp}
        onFocus={bringToFront}
      />
    </div>
  );
};

export default App;
