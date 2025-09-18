import React from 'react';
import type { AppProps } from '../../types';
import { audioService } from '../../services/audioService';

const wallpapers = [
  'https://picsum.photos/seed/wall1/1920/1080',
  'https://picsum.photos/seed/wall2/1920/1080',
  'https://picsum.photos/seed/wall3/1920/1080',
  'https://picsum.photos/seed/wall4/1920/1080',
  'https://picsum.photos/seed/wall5/1920/1080',
  'https://picsum.photos/seed/wall6/1920/1080',
];

export const WallpaperChanger: React.FC<AppProps> = ({ context }) => {
  const handleClick = (url: string) => {
    audioService.playSound('click');
    context.setWallpaper(url);
  };

  return (
    <div className="w-full h-full bg-slate-900 p-4">
      <h2 className="text-lg font-semibold mb-4 text-white">Choose a background</h2>
      <div className="grid grid-cols-2 gap-3 overflow-y-auto h-[calc(100%-40px)]">
        {wallpapers.map((url, index) => (
          <button
            key={index}
            className="aspect-video bg-cover bg-center rounded-md overflow-hidden focus:ring-2 focus:ring-cyan-400 outline-none"
            style={{ backgroundImage: `url(${url})` }}
            onClick={() => handleClick(url)}
          />
        ))}
      </div>
    </div>
  );
};
