
import React, { useState } from 'react';
import type { AppProps } from '../../types';

export const Notepad: React.FC<AppProps> = () => {
  const [content, setContent] = useState('');

  return (
    <div className="w-full h-full bg-white text-black">
      <textarea
        className="w-full h-full p-2 resize-none outline-none bg-transparent font-mono text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
      />
    </div>
  );
};
