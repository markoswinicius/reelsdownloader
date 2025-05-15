
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  onClick, 
  isLoading = false, 
  isDisabled = false,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={cn(
        "w-full bg-app-button hover:bg-app-button/90 flex items-center justify-center gap-2 transition-all",
        isLoading && "animate-pulse-soft",
        className
      )}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download
        </>
      )}
    </Button>
  );
};

export default DownloadButton;
