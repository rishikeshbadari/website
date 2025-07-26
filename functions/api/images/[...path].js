// Cloudflare Pages Function for optimized image serving
const GITHUB_RAW_URL = "https://raw.githubusercontent.com";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Extract image name from URL path
  const pathSegments = url.pathname.split('/');
  const imageName = pathSegments[pathSegments.length - 1];
  
  // Validate image name (security)
  if (!imageName || imageName.includes('..') || !imageName.match(/\.(jpg|jpeg|png|webp)$/i)) {
    return new Response('Invalid image name', { status: 400 });
  }

  // Check for required environment variables
  if (!env.GITHUB_USERNAME || !env.GITHUB_REPO) {
    console.error('Missing required environment variables: GITHUB_USERNAME, GITHUB_REPO');
    return new Response('Server configuration error - missing GitHub credentials', { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Check cache first
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  let response = await cache.match(cacheKey);

  if (response) {
    // Add cache hit header for debugging
    response = new Response(response.body, response);
    response.headers.set('CF-Cache-Status', 'HIT');
    response.headers.set('X-Debug-Source', 'cache');
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
    
    console.log(`Fetching image from: ${githubUrl}`);
    
    // Prepare headers
    const fetchHeaders = {
      'User-Agent': 'Cloudflare-Pages-Image-Proxy',
      'Accept': 'image/*'
    };
    
    // Add authorization if PAT is available
    if (env.GITHUB_PAT) {
      fetchHeaders['Authorization'] = `Bearer ${env.GITHUB_PAT}`;
      console.log('Using GitHub PAT for authentication');
    } else {
      console.log('No GitHub PAT provided - using public access');
    }
    
    // Fetch from GitHub
    const githubResponse = await fetch(githubUrl, {
      headers: fetchHeaders,
      cf: {
        // Cloudflare-specific optimizations
        cacheEverything: true,
        cacheTtl: 86400, // 24 hours
      }
    });

    if (!githubResponse.ok) {
      console.error(`Failed to fetch ${githubUrl}: ${githubResponse.status} ${githubResponse.statusText}`);
      
      // Return detailed error for debugging
      return new Response(JSON.stringify({
        error: 'Image not found',
        status: githubResponse.status,
        url: githubUrl,
        message: githubResponse.statusText
      }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-URL': githubUrl,
          'X-Debug-Status': githubResponse.status.toString()
        }
      });
    }

    // Get the image data
    const imageBuffer = await githubResponse.arrayBuffer();
    
    // Determine content type
    const contentType = getContentType(imageName);
    
    console.log(`Successfully fetched ${imageName}: ${imageBuffer.byteLength} bytes`);
    
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
        'X-Debug-Source': 'github',
        'X-Debug-URL': githubUrl,
        'X-Image-Size': imageBuffer.byteLength.toString()
      }
    });

    // Store in cache
    await cache.put(cacheKey, response.clone());
    
    return response;

  } catch (error) {
    console.error('Error fetching image:', error);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message,
      imageName: imageName
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

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