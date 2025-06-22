
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DownloadRequest {
  url: string;
}

interface DownloadResponse {
  success: boolean;
  message: string;
  videoUrl?: string;
  filename?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url }: DownloadRequest = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, message: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Downloading Instagram Reel from URL:', url);

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY not found in environment');
      return new Response(
        JSON.stringify({ success: false, message: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call RapidAPI Instagram downloader
    const apiResponse = await fetch(
      `https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
        }
      }
    );

    if (!apiResponse.ok) {
      console.error('RapidAPI request failed:', apiResponse.status, apiResponse.statusText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to fetch video information from Instagram' 
        }),
        { status: apiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await apiResponse.json();
    console.log('RapidAPI response:', data);

    if (data.error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: data.error || 'Failed to download the Reels video.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract video URL from API response
    if (data.media && data.media[0] && data.media[0].url) {
      const reelsId = url.match(/instagram\.com\/(reel|reels|p)\/([A-Za-z0-9_-]+)/i)?.[2] || 'video';
      const filename = `instagram-reel-${reelsId}.mp4`;
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Reel information retrieved successfully!',
          videoUrl: data.media[0].url,
          filename: filename
        } as DownloadResponse),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No video URL found in the API response.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in download-instagram-reel function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'An error occurred while processing your request.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
