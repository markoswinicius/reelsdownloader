
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import DownloadButton from './DownloadButton';
import { isValidReelsUrl, downloadReels, triggerDownload } from '@/utils/downloadUtils';
import { ArrowDown } from 'lucide-react';

const DownloadForm: React.FC = () => {
  const [reelsUrl, setReelsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setReelsUrl(url);
    setIsValid(url === '' || isValidReelsUrl(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reelsUrl.trim()) {
      toast.error('Please enter an Instagram Reels URL');
      return;
    }

    if (!isValidReelsUrl(reelsUrl)) {
      toast.error('Please enter a valid Instagram Reels URL');
      setIsValid(false);
      return;
    }

    setIsLoading(true);

    try {
      const result = await downloadReels(reelsUrl);
      
      if (result.success) {
        toast.success(result.message);
        triggerDownload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred while downloading. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Paste Instagram Reels URL</h2>
          <Input
            placeholder="https://www.instagram.com/reel/..."
            value={reelsUrl}
            onChange={handleInputChange}
            className={`focus-ring ${!isValid ? 'border-red-500' : ''}`}
          />
          {!isValid && (
            <p className="text-xs text-red-500">Please enter a valid Instagram Reels URL</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <ArrowDown className="text-gray-400" />
        </div>

        <DownloadButton
          onClick={handleSubmit}
          isLoading={isLoading}
          isDisabled={!reelsUrl.trim()}
        />

        <div className="text-xs text-center text-gray-500">
          <p>No login required • Fast & Free • No download limits</p>
        </div>
      </form>
    </Card>
  );
};

export default DownloadForm;
