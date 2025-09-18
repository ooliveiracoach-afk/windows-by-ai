import React from 'react';

export interface AppContext {
  openApp: (appId: string) => void;
  setWallpaper: (url: string) => void;
}

export interface AppProps {
  windowId: number;
  context: AppContext;
}

export interface AppDef {
  id: string;
  title: string;
  icon: JSX.Element;
  component: React.FC<AppProps>;
  allowMultiple?: boolean;
  defaultSize?: { width: number, height: number };
}

export interface WindowInstance {
  id: number;
  appId: string;
  title:string;
  icon: JSX.Element;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  zIndex: number;
  isClosing?: boolean;
  isMinimizing?: boolean;
}