// Cloudflare Worker for optimized image serving
const GITHUB_RAW_URL = "https://raw.githubusercontent.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Only handle image requests
    if (!url.pathname.startsWith('/api/images/')) {
      return new Response('Not Found', { status: 404 });
    }

    // Extract image name from URL
    const imageName = url.pathname.replace('/api/images/', '');
    
    // Validate image name (security)
    if (!imageName || imageName.includes('..') || !imageName.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return new Response('Invalid image name', { status: 400 });
    }

    // Check cache first
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let response = await cache.match(cacheKey);

    if (response) {
      // Add cache hit header for debugging
      response = new Response(response.body, response);
      response.headers.set('CF-Cache-Status', 'HIT');
      return response;
    }

    try {
      // Build GitHub URL - handle both pictures folder and root files
      let githubUrl;
      if (imageName === 'headshot.JPG') {
        // Headshot is in the root directory
        githubUrl = `${GITHUB_RAW_URL}/${env.GITHUB_USERNAME}/${env.GITHUB_REPO}/main/${imageName}`;
      } else {
        // Other images are in the pictures folder
        githubUrl = `${GITHUB_RAW_URL}/${env.GITHUB_USERNAME}/${env.GITHUB_REPO}/main/pictures/${imageName}`;
      }
      
      // Fetch from GitHub with authentication
      const githubResponse = await fetch(githubUrl, {
        headers: {
          'Authorization': `Bearer ${env.GITHUB_PAT}`,
          'User-Agent': 'Cloudflare-Worker-Image-Proxy',
          'Accept': 'image/*'
        },
        cf: {
          // Cloudflare-specific optimizations
          cacheEverything: true,
          cacheTtl: 86400, // 24 hours
        }
      });

      if (!githubResponse.ok) {
        console.error(`Failed to fetch ${githubUrl}: ${githubResponse.status}`);
        return new Response('Image not found', { status: 404 });
      }

      // Get the image data
      const imageBuffer = await githubResponse.arrayBuffer();
      
      // Determine content type
      const contentType = getContentType(imageName);
      
      // Create optimized response
      response = new Response(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
          'CF-Cache-Status': 'MISS',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Vary': 'Accept',
          'X-Content-Type-Options': 'nosniff',
          'Content-Security-Policy': "default-src 'none'",
          // Add compression hint
          'Content-Encoding': 'br, gzip'
        }
      });

      // Store in cache
      await cache.put(cacheKey, response.clone());
      
      return response;

    } catch (error) {
      console.error('Error fetching image:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
} 