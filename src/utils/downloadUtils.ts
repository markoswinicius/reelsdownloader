
import { supabase } from "@/integrations/supabase/client";

/**
 * Validates if the provided URL is a valid Instagram Reels URL
 */
export const isValidReelsUrl = (url: string): boolean => {
  // Instagram Reels URL formats:
  // https://www.instagram.com/reel/[code]/
  // https://www.instagram.com/reels/[code]/
  // https://www.instagram.com/p/[code]/ (sometimes Reels use this format too)
  const instagramUrlRegex = /instagram\.com\/(reel|reels|p)\/([A-Za-z0-9_-]+)/i;
  return instagramUrlRegex.test(url);
};

/**
 * Interface for download result
 */
interface DownloadResult {
  success: boolean;
  message: string;
  filename?: string;
  videoData?: Blob;
}

/**
 * Download Reels video using Supabase Edge Function
 */
export const downloadReels = async (url: string): Promise<DownloadResult> => {
  try {
    console.log('Calling Edge Function to download Reel:', url);
    
    const { data, error } = await supabase.functions.invoke('download-instagram-reel', {
      body: { url }
    });

    if (error) {
      console.error('Edge Function error:', error);
      return {
        success: false,
        message: 'Failed to process the request. Please try again.'
      };
    }

    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Failed to download the Reels video.'
      };
    }

    // Fetch the actual video file from the URL provided by the API
    if (data.videoUrl) {
      console.log('Fetching video from URL:', data.videoUrl);
      
      const videoResponse = await fetch(data.videoUrl);
      if (!videoResponse.ok) {
        throw new Error('Failed to fetch the video file');
      }
      
      const videoBlob = await videoResponse.blob();
      
      return {
        success: true,
        message: data.message,
        filename: data.filename,
        videoData: videoBlob
      };
    } else {
      return {
        success: false,
        message: 'No video URL received from the server.'
      };
    }
    
  } catch (error) {
    console.error('Error downloading Reels:', error);
    return {
      success: false,
      message: 'An error occurred while downloading the Reels video.'
    };
  }
};

/**
 * Trigger download of a file
 */
export const triggerDownload = (fileName: string = 'instagram-reel.mp4', blobData?: Blob): void => {
  try {
    if (!blobData) {
      console.error('No blob data provided for download');
      return;
    }
    
    // Create a blob URL from the video data
    const blobUrl = URL.createObjectURL(blobData);
    
    // Create a download link and trigger the download
    const element = document.createElement('a');
    element.href = blobUrl;
    element.download = fileName;
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(element);
      URL.revokeObjectURL(blobUrl); // Free up memory
    }, 100);
    
    console.log(`Downloading file: ${fileName}`);
  } catch (error) {
    console.error('Error triggering download:', error);
    alert('Failed to download the file. Please try again.');
  }
};

/**
 * Alternative implementation for serverless environment (kept for backwards compatibility)
 */
export const downloadReelsServerless = async (url: string): Promise<DownloadResult> => {
  console.log('Using serverless fallback - this should not be called anymore');
  return downloadReels(url);
};
