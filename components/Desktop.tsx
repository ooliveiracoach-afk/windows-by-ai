
import React from 'react';

interface DesktopProps {
  wallpaper: string;
  children: React.ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({ wallpaper, children }) => {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {children}
    </div>
  );
};
