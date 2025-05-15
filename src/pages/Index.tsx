
import React from 'react';
import Header from '@/components/Header';
import DownloadForm from '@/components/DownloadForm';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-background flex flex-col items-center px-4 py-8">
      <Header />
      
      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">Instagram Reels Downloader</h2>
          <p className="text-gray-600">Download Instagram Reels videos quickly and easily</p>
        </div>
        
        <DownloadForm />
        
        <div className="space-y-4 text-center text-sm text-gray-600 max-w-sm">
          <p>
            Simply paste the URL of any Instagram Reel and click download. 
            Your video will be saved directly to your device.
          </p>
          <p className="text-xs">
            ReelsDownloader is not affiliated with Instagram and respects content ownership.
            Please only download content you have permission to use.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
