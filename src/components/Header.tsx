
import React from 'react';
import { Download } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 w-full flex justify-center items-center">
      <div className="flex items-center gap-2">
        <Download className="h-6 w-6 text-app-button" />
        <h1 className="text-2xl font-bold">
          <span className="instagram-gradient">Reels</span>
          <span>Downloader</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
