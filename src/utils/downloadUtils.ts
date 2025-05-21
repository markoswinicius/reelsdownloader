
// Instagram Reels downloader utility functions

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
 * Extract Reels ID from URL
 */
const extractReelsId = (url: string): string | null => {
  const match = url.match(/instagram\.com\/(reel|reels|p)\/([A-Za-z0-9_-]+)/i);
  return match ? match[2] : null;
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
 * Download Reels video using a proxy API
 */
export const downloadReels = async (url: string): Promise<DownloadResult> => {
  try {
    const reelsId = extractReelsId(url);
    
    if (!reelsId) {
      return {
        success: false,
        message: 'Could not extract the Reels ID from the provided URL.'
      };
    }

    // For this implementation, we're using the RapidAPI Instagram downloader
    // Note: In a real app, this API call would be made from a backend service
    // to protect your API key. This is for demonstration purposes only.
    const apiUrl = `https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index`;
    
    const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'RAPID_API_KEY_HERE', // This should be in a secure backend in a real app
        'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      return {
        success: false,
        message: data.error || 'Failed to download the Reels video.'
      };
    }
    
    // In this demo we assume the API returns a video URL that we can fetch
    if (data.media && data.media[0] && data.media[0].url) {
      // Fetch the actual video file
      const videoResponse = await fetch(data.media[0].url);
      if (!videoResponse.ok) {
        throw new Error('Failed to fetch the video file');
      }
      
      const videoBlob = await videoResponse.blob();
      const filename = `instagram-reel-${reelsId}.mp4`;
      
      return {
        success: true,
        message: 'Reel downloaded successfully!',
        filename: filename,
        videoData: videoBlob
      };
    } else {
      return {
        success: false,
        message: 'No video URL found in the API response.'
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
    // For the demo, if no blob is provided, use a placeholder
    if (!blobData) {
      console.log(`No blob data provided for download of ${fileName}, using placeholder`);
      
      // This is just for demonstration - in a real app, we'd always have the blob
      const placeholderText = 'This is a placeholder for the video download.';
      blobData = new Blob([placeholderText], { type: 'text/plain' });
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
 * Alternative implementation for serverless environment
 * Note: In a real production app, we'd implement a proxy server or
 * use edge functions to safely make the API call without exposing API keys.
 */
export const downloadReelsServerless = async (url: string): Promise<DownloadResult> => {
  // For demo purposes, this would be implemented in an actual serverless function
  // Currently falls back to the mock implementation
  
  console.log('Using serverless fallback for Reels download (mock)');
  
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      if (isValidReelsUrl(url)) {
        // Simulate download success
        resolve({
          success: true,
          message: 'Download successful! The video has been saved to your device.',
          filename: 'instagram-reel-demo.mp4'
        });
      } else {
        // Simulate error
        resolve({
          success: false,
          message: 'Invalid Instagram Reels URL. Please check and try again.'
        });
      }
    }, 2000); // Simulate 2 second delay
  });
};
