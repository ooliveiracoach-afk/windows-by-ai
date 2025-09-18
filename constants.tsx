import React from 'react';
import type { AppDef } from './types';
import { Notepad } from './components/apps/Notepad';
import { AboutPC } from './components/apps/AboutPC';
import { WallpaperChanger } from './components/apps/WallpaperChanger';
import { GeminiChat } from './components/apps/GeminiChat';

// Fix: Updated WinIcon to accept all SVG props to allow event handlers like onAnimationEnd.
const WinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3,12V6.75L9,5.43V11.91L3,12M21,12V4.5L11,3V11.81L21,12M3,13L9,13.09V19.57L3,18.25V13M21,13.19L11,13.2V21L21,19.5V13.19Z" />
    </svg>
);

// Fix: Updated icon to accept all SVG props for consistency and future-proofing.
const ComputerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20,18H4V8H20M20,6H4A2,2 0 0,0 2,8V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M8,12H6V14H8V12M12,12H10V14H12V12M16,12H14V14H16V12Z" />
    </svg>
);

// Fix: Updated icon to accept all SVG props for consistency and future-proofing.
const NotepadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>
);

// Fix: Updated icon to accept all SVG props for consistency and future-proofing.
const PictureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>
);

// Fix: Updated icon to accept all SVG props for consistency and future-proofing.
const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.58 8.42L3 10l5.42 4.58L6 22l6-4.42L18 22l-2.42-7.42L21 10l-6.58-1.58z"/>
    </svg>
);

const PowerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13,3H11V13H13V3M17.83,5.17L16.41,6.59C17.95,7.95 19,9.82 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12C5,9.82 6.05,7.95 7.59,6.59L6.17,5.17C4.22,6.84 3,9.27 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,9.27 19.78,6.84 17.83,5.17Z" />
    </svg>
);

export const ICONS = {
    WinIcon,
    ComputerIcon,
    NotepadIcon,
    PictureIcon,
    SparkleIcon,
    PowerIcon,
}

export const APPS: AppDef[] = [
  {
    id: 'gemini_chat',
    title: 'G-Assistant',
    icon: <SparkleIcon className="w-5 h-5"/>,
    component: GeminiChat,
    allowMultiple: false,
    defaultSize: { width: 450, height: 650 },
  },
  {
    id: 'notepad',
    title: 'Notepad',
    icon: <NotepadIcon className="w-5 h-5"/>,
    component: Notepad,
    allowMultiple: true,
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: 'wallpaper_changer',
    title: 'Display Settings',
    icon: <PictureIcon className="w-5 h-5"/>,
    component: WallpaperChanger,
    allowMultiple: false,
    defaultSize: { width: 400, height: 300 },
  },
  {
    id: 'about_pc',
    title: 'About This PC',
    icon: <ComputerIcon className="w-5 h-5"/>,
    component: AboutPC,
    allowMultiple: false,
    defaultSize: { width: 450, height: 450 },
  },
];
